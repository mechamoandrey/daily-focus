/** Server-only: resolve absolute base URL for metadata (OG, canonical). */
export function getMetadataBase() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof site === "string" && site.trim()) {
    try {
      return new URL(site.endsWith("/") ? site.slice(0, -1) : site);
    } catch {
      /* fall through */
    }
  }
  const v = process.env.VERCEL_URL;
  if (typeof v === "string" && v.trim()) {
    return new URL(`https://${v.trim()}`);
  }
  return new URL("http://localhost:3000");
}
