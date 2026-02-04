import os from "os";
import path from "path";
import { validateMarkdownReadPath } from "./markdownPath.js";

describe("validateMarkdownReadPath", () => {
  it("returns an absolute normalized path for markdown files", () => {
    const result = validateMarkdownReadPath({ filePath: "notes/readme.md" });
    expect(result).toBe(path.resolve("notes/readme.md"));
  });

  it("expands the home directory shortcut", () => {
    const result = validateMarkdownReadPath({ filePath: "~/notes/readme.md" });
    expect(result).toBe(path.join(os.homedir(), "notes/readme.md"));
  });

  it("rejects files that are not markdown", () => {
    expect(() =>
      validateMarkdownReadPath({ filePath: "/tmp/notes/readme.txt" }),
    ).toThrow("Required file is not a Markdown file.");
  });

  it("allows files within MD_SHARE_DIR", () => {
    const shareDir = path.resolve("/tmp/share");
    const filePath = path.join(shareDir, "docs/readme.md");

    const result = validateMarkdownReadPath({
      filePath,
      mdShareDir: shareDir,
    });

    expect(result).toBe(filePath);
  });

  it("rejects files outside MD_SHARE_DIR, even with a shared prefix", () => {
    const shareDir = path.resolve("/tmp/share");
    const filePath = path.resolve("/tmp/share-evil/readme.md");

    expect(() =>
      validateMarkdownReadPath({
        filePath,
        mdShareDir: shareDir,
      }),
    ).toThrow(`Only files in ${shareDir} are allowed.`);
  });
});
