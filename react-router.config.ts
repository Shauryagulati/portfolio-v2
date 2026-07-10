import type { Config } from "@react-router/dev/config";
import { projects } from "./app/content/projects";
import { posts } from "./app/content/writing";

export default {
  ssr: false,
  prerender: [
    "/",
    "/projects",
    ...projects.map((p) => `/projects/${p.slug}`),
    "/writing", // always prerendered — direct loads must never hit 404.html
    ...posts.filter((p) => p.body).map((p) => `/writing/${p.slug}`),
    "/about",
    // NOTE: 404.html is generated as PLAIN static HTML by scripts/gen-404.mjs
    // (postbuild). Serving a prerendered React page for unknown paths caused
    // hydration mismatches: route tree ≠ /404, and the page rendered twice.
  ],
} satisfies Config;
