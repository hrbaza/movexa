const TMDB_BASE = "https://api.themoviedb.org/3";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TMDB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "TMDB_TOKEN is not configured" });
  }

  const path = Array.isArray(req.query.path) ? req.query.path[0] : req.query.path;
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return res.status(400).json({ error: "Invalid TMDB path" });
  }

  try {
    const upstream = await fetch(`${TMDB_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await upstream.text();
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(upstream.status).send(body);
  } catch {
    return res.status(502).json({ error: "TMDB is unreachable" });
  }
}
