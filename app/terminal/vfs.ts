import { corpus, type Doc } from "~/content/corpus";

/** Virtual file system grown from the corpus. Paths like
 *  "~/projects/eu-navigator.md" become real, navigable structure. */

export interface VDir {
  kind: "dir";
  name: string;
  children: Map<string, VNode>;
}

export interface VFile {
  kind: "file";
  name: string;
  doc: Doc;
}

export type VNode = VDir | VFile;

function makeDir(name: string): VDir {
  return { kind: "dir", name, children: new Map() };
}

export const root: VDir = makeDir("~");

for (const doc of corpus) {
  const parts = doc.path.replace(/^~\//, "").split("/");
  let dir = root;
  for (const part of parts.slice(0, -1)) {
    let next = dir.children.get(part);
    if (!next || next.kind !== "dir") {
      next = makeDir(part);
      dir.children.set(part, next);
    }
    dir = next;
  }
  const fname = parts[parts.length - 1];
  dir.children.set(fname, { kind: "file", name: fname, doc });
}

/** Normalize a path (absolute "~/x" or relative "x/../y") against cwd
 *  into clean segments from root. */
export function normalize(cwd: string[], path: string): string[] {
  const absolute = path === "~" || path.startsWith("~/");
  const raw = absolute ? path.replace(/^~\/?/, "") : path;
  const segs: string[] = absolute ? [] : [...cwd];
  for (const part of raw.split("/")) {
    const seg = part.trim();
    if (seg === "" || seg === ".") continue;
    if (seg === "..") segs.pop();
    else segs.push(seg);
  }
  return segs;
}

/** Resolve a path against cwd segments. Returns the node or null. */
export function resolve(cwd: string[], path: string): VNode | null {
  let node: VNode = root;
  for (const seg of normalize(cwd, path)) {
    if (node.kind !== "dir") return null;
    const next = node.children.get(seg);
    if (!next) return null;
    node = next;
  }
  return node;
}

export function cwdString(cwd: string[]): string {
  return cwd.length ? `~/${cwd.join("/")}` : "~";
}

export function listDir(dir: VDir): string[] {
  return [...dir.children.values()]
    .sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "dir" ? -1 : 1))
    .map((n) => (n.kind === "dir" ? `${n.name}/` : n.name));
}
