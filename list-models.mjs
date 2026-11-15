const key = process.env.GEMINI_API_KEY;
const base = "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200";
let url = base;
const names = [];

while (url) {
  const res = await fetch(url, { headers: { "x-goog-api-key": key } });
  const data = await res.json();
  if (!res.ok) {
    console.error("GAGAL:", JSON.stringify(data));
    process.exit(1);
  }
  for (const m of data.models ?? []) {
    if ((m.supportedGenerationMethods ?? []).includes("generateContent")) {
      names.push(m.name.replace("models/", ""));
    }
  }
  url = data.nextPageToken
    ? `${base}&pageToken=${encodeURIComponent(data.nextPageToken)}`
    : null;
}

console.log("Model yang mendukung generateContent:");
for (const n of names.sort()) console.log("-", n);
