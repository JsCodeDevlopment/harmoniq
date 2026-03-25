export const API_BASE = "http://localhost:3001/api/v1";

export async function searchSongs(query: string) {
  const res = await fetch(`${API_BASE}/songs/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Falha na busca");
  return res.json();
}

export async function getSong(url: string) {
  const res = await fetch(`${API_BASE}/songs/song?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Falha ao carregar cifra");
  return res.json();
}
