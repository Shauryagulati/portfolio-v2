import { site } from "~/content/site";
import { projects } from "~/content/projects";
import { cwdString, listDir, normalize, resolve } from "./vfs";

export interface Line {
  id: number;
  kind: "in" | "out" | "dim" | "ok" | "err";
  text: string;
}

export interface ShellCtx {
  cwd: string[];
  setCwd: (segs: string[]) => void;
  print: (kind: Line["kind"], ...lines: string[]) => void;
  clear: () => void;
  close: () => void;
  navigate: (to: string) => void;
  toggleTheme: () => void;
  history: string[];
}

type Command = { run: (ctx: ShellCtx, args: string[]) => void; help: string };

/** file path → site route, for `open` */
function routeFor(path: string): string | null {
  const m = path.match(/^~\/projects\/(.+)\.md$/);
  if (m) return `/projects/${m[1]}`;
  if (path === "~/about.md") return "/about";
  if (path === "~/resume.md") return "/resume";
  return null;
}

export const commands: Record<string, Command> = {
  help: {
    help: "list commands",
    run: (ctx) => {
      ctx.print(
        "out",
        ...Object.entries(commands).map(
          ([name, c]) => `  ${name.padEnd(10)} ${c.help}`,
        ),
        `  ${site.handle.padEnd(10)} talk to my agent (RAG over everything here)`,
      );
    },
  },
  ls: {
    help: "list files",
    run: (ctx, args) => {
      const node = resolve(ctx.cwd, args[0] ?? "");
      if (!node) return ctx.print("err", `ls: no such file: ${args[0]}`);
      if (node.kind === "file") return ctx.print("out", node.name);
      ctx.print("out", listDir(node).join("   "));
    },
  },
  cd: {
    help: "change directory",
    run: (ctx, args) => {
      const target = args[0] ?? "~";
      const node = resolve(ctx.cwd, target);
      if (!node) return ctx.print("err", `cd: no such directory: ${target}`);
      if (node.kind !== "dir")
        return ctx.print("err", `cd: not a directory: ${target}`);
      ctx.setCwd(normalize(ctx.cwd, target));
    },
  },
  cat: {
    help: "print a file",
    run: (ctx, args) => {
      if (!args[0]) return ctx.print("err", "cat: which file?  try: ls");
      const node = resolve(ctx.cwd, args[0]);
      if (!node) return ctx.print("err", `cat: no such file: ${args[0]}`);
      if (node.kind !== "file")
        return ctx.print("err", `cat: ${args[0]} is a directory`);
      ctx.print("out", ...node.doc.text.split("\n"));
    },
  },
  pwd: {
    help: "where am i",
    run: (ctx) => ctx.print("out", cwdString(ctx.cwd)),
  },
  open: {
    help: "open a file as a page",
    run: (ctx, args) => {
      if (!args[0]) return ctx.print("err", "open: which file?");
      const node = resolve(ctx.cwd, args[0]);
      if (!node || node.kind !== "file")
        return ctx.print("err", `open: no such file: ${args[0]}`);
      const route = routeFor(node.doc.path);
      if (!route) return ctx.print("err", `open: no page for ${args[0]}`);
      ctx.print("ok", `▸ opening ${route}`);
      ctx.navigate(route);
      ctx.close();
    },
  },
  theme: {
    help: "toggle day/night",
    run: (ctx) => {
      ctx.toggleTheme();
      ctx.print("ok", "▸ theme flipped");
    },
  },
  history: {
    help: "command history",
    run: (ctx) =>
      ctx.print(
        "out",
        ...ctx.history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`),
      ),
  },
  neofetch: {
    help: "about this machine",
    run: (ctx) => {
      ctx.print(
        "out",
        "        ▄▄▄▄▄▄▄▄        guest@" + site.handle,
        "       █ ▄▄▄▄▄▄ █       ─────────────────",
        "       █ █░░░░█ █       os: shaurya-os v2.0",
        "       █ ▀▀▀▀▀▀ █       shell: web-zsh",
        "       ▀▀▀▀▀▀▀▀▀▀       stack: react · three.js · workers-ai",
        "        ▄██████▄        projects: " + projects.length,
        "                        agent: type " + site.handle,
      );
    },
  },
  credits: {
    help: "who made this",
    run: (ctx) =>
      ctx.print(
        "out",
        `built by ${site.name} — design + code in the open.`,
        "v1 of this site was a retro-computer built on Edward Hinrichsen's",
        "open-source work (MIT). v2 is a from-scratch rebuild; the CRT in",
        "the hero is a tip of the hat, drawn in text this time.",
      ),
  },
  whoami: {
    help: "who are you",
    run: (ctx) => ctx.print("out", "guest — but the agent knows the owner. type: " + site.handle),
  },
  clear: {
    help: "clear the screen",
    run: (ctx) => ctx.clear(),
  },
  exit: {
    help: "close the terminal",
    run: (ctx) => ctx.close(),
  },
};

export const commandNames = [...Object.keys(commands), site.handle];
