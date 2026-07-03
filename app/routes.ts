import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/:slug", "routes/project.tsx"),
    route("writing", "routes/writing.tsx"),
    route("writing/:slug", "routes/post.tsx"),
    route("about", "routes/about.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
