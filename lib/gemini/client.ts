// Klien Gemini: memanggil model, meminta output JSON, mencoba ulang, dan memakai model cadangan.
// Tidak tahu apa-apa soal ide atau script, jadi bisa dipakai ulang untuk fitur apa pun.
//
// File ini HANYA boleh diimpor dari kode server (server action, route handler, server component).
// GEMINI_API_KEY tidak boleh sampai ke browser.

import { GoogleGenAI } from "@google/genai";
import {
  GeminiError,
  isOverloaded,
  toGeminiError,
} from "@/lib/gemini/errors";

// Model bisa diganti lewat GEMINI_MODEL di .env.local tanpa mengubah kode.
// GEMINI_FALLBACK_MODEL (opsional) dipakai kalau model utama tetap overload.
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const TIMEOUT_MS = 20_000;
// Percobaan ulang kalau Google sedang overload. Tidak memotong kuota user lagi.
const RETRY_DELAYS_MS = [1500, 3500];

export type JsonRequest = {
  systemInstruction: string;
  prompt: string;
  // JSON Schema untuk bentuk jawaban yang diminta.
  schema: Record<string, unknown>;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new GeminiError("timeout", "Gemini timeout")),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function callModel(
  ai: GoogleGenAI,
  model: string,
  req: JsonRequest
): Promise<unknown> {
  const response = await withTimeout(
    ai.models.generateContent({
      model,
      contents: req.prompt,
      config: {
        systemInstruction: req.systemInstruction,
        responseMimeType: "application/json",
        responseJsonSchema: req.schema,
        temperature: 1,
      },
    }),
    TIMEOUT_MS
  );

  const text = response.text;
  if (!text) throw new GeminiError("bad_output", "Respons kosong");

  try {
    return JSON.parse(text);
  } catch {
    throw new GeminiError("bad_output", "JSON tidak valid");
  }
}

// Coba satu model, dengan percobaan ulang kalau Google sedang overload.
async function tryModel(
  ai: GoogleGenAI,
  model: string,
  req: JsonRequest
): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await callModel(ai, model, req);
    } catch (err) {
      lastError = err;
      if (!isOverloaded(err) || attempt === RETRY_DELAYS_MS.length) break;
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
  throw lastError;
}

// Hasilnya BELUM divalidasi. Pemanggil wajib memeriksa bentuknya sendiri.
export async function generateJson(req: JsonRequest): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError("config", "GEMINI_API_KEY belum diisi");

  const primary = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const fallback = process.env.GEMINI_FALLBACK_MODEL;
  const ai = new GoogleGenAI({ apiKey });

  try {
    try {
      return await tryModel(ai, primary, req);
    } catch (err) {
      if (fallback && fallback !== primary && isOverloaded(err)) {
        console.warn(`[gemini] ${primary} overload, mencoba ${fallback}`);
        return await tryModel(ai, fallback, req);
      }
      throw err;
    }
  } catch (err) {
    throw toGeminiError(err);
  }
}
