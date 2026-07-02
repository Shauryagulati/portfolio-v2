import type { Config } from "@react-router/dev/config";
import { projects } from "./app/content/projects";

export default {
  ssr: false,
  prerender: [
    "/",
    "/projects",
    ...projects.map((p) => `/projects/${p.slug}`),
    "/about",
    "/resume",
  ],
} satisfies Config;
