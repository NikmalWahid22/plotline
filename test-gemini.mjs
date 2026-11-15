import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
console.log("Model:", model);

const schema = {
  type: "object",
  properties: {
    ideas: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, hook: { type: "string" } },
        required: ["title", "hook"],
      },
    },
  },
  required: ["ideas"],
};

async function run(label, config) {
  const t = Date.now();
  try {
    const r = await Promise.race([
      ai.models.generateContent({
        model,
        contents: "Beri 2 ide konten TikTok tentang tips CSS. Judul dan hook singkat.",
        config,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("tidak membalas dalam 60 detik")), 60000)
      ),
    ]);
    console.log(`[${label}] OK ${((Date.now() - t) / 1000).toFixed(1)} detik:`, r.text?.slice(0, 150));
  } catch (e) {
    console.error(`[${label}] GAGAL ${((Date.now() - t) / 1000).toFixed(1)} detik:`, e.message);
  }
}

await run("1. teks biasa");
await run("2. JSON terstruktur", {
  responseMimeType: "application/json",
  responseJsonSchema: schema,
});
process.exit(0);