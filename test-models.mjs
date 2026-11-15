import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
];

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

for (const model of models) {
  const t = Date.now();
  const sec = () => ((Date.now() - t) / 1000).toFixed(1);
  try {
    const r = await Promise.race([
      ai.models.generateContent({
        model,
        contents: "Beri 5 ide konten TikTok tentang tips CSS untuk pemula. Judul dan hook singkat.",
        config: { responseMimeType: "application/json", responseJsonSchema: schema },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("tidak membalas dalam 45 detik")), 45000)
      ),
    ]);
    const n = JSON.parse(r.text).ideas.length;
    console.log(`OK     ${model}  ${sec()} detik  (${n} ide)`);
  } catch (e) {
    const msg = String(e.message).replace(/\s+/g, " ").slice(0, 170);
    console.log(`GAGAL  ${model}  ${sec()} detik  ${msg}`);
  }
}
process.exit(0);
