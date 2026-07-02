import type { Config } from "@react-router/dev/config";
import { projects } from "./app/content/projects";
import { posts } from "./app/content/writing";

export default {
  ssr: false,
  prerender: [
    "/",
    "/projects",
    ...projects.map((p) => `/projects/${p.slug}`),
    ...(posts.length ? ["/writing"] : []),
    ...posts.map((p) => `/writing/${p.slug}`),
    "/about",
    "/resume",
    "/404", // catch-all renders the terminal joke; postbuild copies to 404.html
  ],
} satisfies Config;
