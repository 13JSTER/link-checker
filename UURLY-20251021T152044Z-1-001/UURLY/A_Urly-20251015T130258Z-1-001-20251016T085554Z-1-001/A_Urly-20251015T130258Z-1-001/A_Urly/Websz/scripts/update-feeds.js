import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feedsDir = path.join(__dirname, "..", "feeds");
const outFile = path.join(feedsDir, "urls.txt");

const SOURCES = [
  "https://openphish.com/feed.txt",
  "https://urlhaus.abuse.ch/downloads/text_online/"
];

function normalize(url) {
  try {
    const u = new URL(url.trim());
    u.hash = "";
    if ((u.protocol === "http:" && u.port === "80") || (u.protocol === "https:" && u.port === "443")) {
      u.port = "";
    }
    const params = [...u.searchParams.keys()];
    for (const k of params) if (k.toLowerCase().startsWith("utm_")) u.searchParams.delete(k);
    if (u.pathname === "/") u.pathname = "";
    return u.toString().toLowerCase();
  } catch {
    return null;
  }
}

async function download(url) {
  const r = await fetch(url, { redirect: "follow" });
  if (!r.ok) throw new Error(`fetch_failed ${url} ${r.status}`);
  return r.text();
}

async function main() {
  await fs.mkdir(feedsDir, { recursive: true });
  const set = new Set();
  for (const src of SOURCES) {
    try {
      const txt = await download(src);
      for (const line of txt.split(/\r?\n/)) {
        if (!line || line.startsWith("#")) continue;
        const norm = normalize(line);
        if (norm) set.add(norm);
      }
      console.log(`ok: ${src}`);
    } catch (e) {
      console.warn(`skip: ${src} -> ${e.message}`);
    }
  }
  const arr = [...set];
  await fs.writeFile(outFile, arr.join("\n"), "utf8");
  console.log(`wrote ${arr.length} URLs -> ${outFile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
