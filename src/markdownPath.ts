import path from "path";
import { expandHome } from "./utils.js";

const MARKDOWN_EXTENSIONS = new Set([".md", ".markdown"]);

export function validateMarkdownReadPath({
  filePath,
  mdShareDir,
}: {
  filePath: string;
  mdShareDir?: string;
}): string {
  const normalizedPath = path.normalize(path.resolve(expandHome(filePath)));
  const extension = path.extname(normalizedPath).toLowerCase();

  if (!MARKDOWN_EXTENSIONS.has(extension)) {
    throw new Error("Required file is not a Markdown file.");
  }

  if (!mdShareDir) {
    return normalizedPath;
  }

  const normalizedShareDir = path.normalize(path.resolve(expandHome(mdShareDir)));
  const relative = path.relative(normalizedShareDir, normalizedPath);
  const isWithinShareDir =
    relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));

  if (!isWithinShareDir) {
    throw new Error(`Only files in ${normalizedShareDir} are allowed.`);
  }

  return normalizedPath;
}
