import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("assistme", 16)).toBe("assistme");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("assistme-status-output", 10)).toBe("assistme-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});
