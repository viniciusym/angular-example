// Uso: node fix-covers.mjs [caminho/para/db.json]
// Requer Node 18+ (fetch nativo). Faz backup em db.json.bak antes de escrever.
import { readFile, writeFile, copyFile } from "node:fs/promises";

const DB_PATH = process.argv[2] ?? "db.json";
const UA = "album-covers-script/1.0 (uso pessoal)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Tira "(Deluxe Edition)", "- EP", reticências, etc. para a pesquisa
const cleanTitle = (t) =>
  t
    .replace(/\(.*?\)/g, "")
    .replace(/\s+-\s+EP\b/i, "")
    .replace(/…/g, "")
    .replace(/\s+/g, " ")
    .trim();

async function fromItunes(album) {
  const title = cleanTitle(album.title);
  const term = encodeURIComponent(`${album.artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${term}&media=music&entity=album&limit=10`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const { results } = await res.json();

  const a = norm(album.artist);
  const t = norm(title).slice(0, 20);
  const sameArtist = results.filter((r) => norm(r.artistName).includes(a));
  const best =
    sameArtist.find((r) => norm(r.collectionName).includes(t)) ?? null;
  if (!best?.artworkUrl100) return null;
  return best.artworkUrl100.replace(/\d+x\d+bb/, "600x600bb");
}

async function fromCoverArtArchive(album) {
  const title = cleanTitle(album.title);
  const q = encodeURIComponent(
    `releasegroup:"${title}" AND artist:"${album.artist}"`
  );
  const res = await fetch(
    `https://musicbrainz.org/ws/2/release-group/?query=${q}&fmt=json&limit=3`,
    { headers: { "User-Agent": UA } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  for (const rg of data["release-groups"] ?? []) {
    const url = `https://coverartarchive.org/release-group/${rg.id}/front-500`;
    // HEAD segue redirects; só aceitamos se a capa existir mesmo
    const head = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (head.ok) return url;
    await sleep(1100);
  }
  return null;
}

const raw = await readFile(DB_PATH, "utf8");
const db = JSON.parse(raw);
await copyFile(DB_PATH, `${DB_PATH}.bak`);

const failed = [];
for (const album of db.albums) {
  let url = null;
  try {
    url = await fromItunes(album);
    if (!url) {
      await sleep(1100); // MusicBrainz: máx. ~1 pedido/s
      url = await fromCoverArtArchive(album);
    }
  } catch (err) {
    console.warn(`Erro em "${album.title}":`, err.message);
  }

  if (url) {
    album.coverUrl = url;
    console.log(`OK   ${album.artist} - ${album.title}\n     ${url}`);
  } else {
    failed.push(album);
    console.log(`FALHA ${album.artist} - ${album.title} (mantido o URL antigo)`);
  }
  await sleep(400);
}

await writeFile(DB_PATH, JSON.stringify(db, null, 2) + "\n");
console.log(
  `\nConcluído: ${db.albums.length - failed.length}/${db.albums.length} atualizados.`
);
if (failed.length) {
  console.log("Por resolver manualmente:");
  failed.forEach((a) => console.log(` - [${a.id}] ${a.artist} - ${a.title}`));
}
