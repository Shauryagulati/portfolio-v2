/** The boot line knows how you got here. UTM params first, referrer second —
 *  read client-side, sent nowhere. */

const SOURCES: Record<string, string> = {
  linkedin: "linkedin",
  "lnkd.in": "linkedin",
  instagram: "instagram",
  ig: "instagram",
  twitter: "x",
  x: "x",
  "t.co": "x",
  github: "github",
  google: "google",
  bing: "bing",
  reddit: "reddit",
  hackernews: "hacker news",
  "news.ycombinator.com": "hacker news",
};

export function trafficSource(): string | null {
  try {
    const utm = new URLSearchParams(location.search).get("utm_source");
    if (utm) {
      const key = utm.toLowerCase();
      return SOURCES[key] ?? key;
    }
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host === location.hostname) return null;
      for (const [needle, label] of Object.entries(SOURCES)) {
        if (host.includes(needle)) return label;
      }
      return host;
    }
  } catch {
    /* opaque referrers, private mode */
  }
  return null;
}

export function bootLines(handle: string): string[] {
  const src = trafficSource();
  const via = src ? ` — via ${src}` : "";
  const now = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const hello =
    src === "linkedin"
      ? "recruiter mode detected. try: cat resume.md"
      : "type help for commands · shaurya to talk to my agent";
  return [`last login: ${now} on guest@${handle}${via}`, hello];
}
