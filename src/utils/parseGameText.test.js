import { describe, expect, it } from "vitest";
import { BULLET, parseGameText } from "./parseGameText";

describe("parseGameText", () => {
  describe("empty input", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["an empty string", ""],
      ["whitespace only", "   \n  \n"],
    ])("returns no blocks for %s", (_label, input) => {
      expect(parseGameText(input)).toEqual([]);
    });
  });

  describe("paragraphs", () => {
    it("returns a single paragraph block for one line of prose", () => {
      expect(parseGameText("The drawer is locked.")).toEqual([
        { type: "paragraph", text: "The drawer is locked." },
      ]);
    });

    it("joins consecutive lines into one paragraph", () => {
      expect(parseGameText("The drawer is locked.\nIt will not open.")).toEqual([
        { type: "paragraph", text: "The drawer is locked. It will not open." },
      ]);
    });

    it("splits paragraphs on a blank line", () => {
      expect(parseGameText("First.\n\nSecond.")).toEqual([
        { type: "paragraph", text: "First." },
        { type: "paragraph", text: "Second." },
      ]);
    });

    it("trims surrounding whitespace on each line", () => {
      expect(parseGameText("   Padded.   ")).toEqual([
        { type: "paragraph", text: "Padded." },
      ]);
    });
  });

  describe("lists", () => {
    it("collects consecutive bullets into one list", () => {
      expect(parseGameText(`${BULLET} First\n${BULLET} Second`)).toEqual([
        { type: "list", items: ["First", "Second"] },
      ]);
    });

    // The room data separates consecutive bullets with blank lines, so a blank
    // line must not close an open list. This is the case a naive rewrite breaks.
    it("keeps a list open across blank lines between bullets", () => {
      expect(parseGameText(`${BULLET} First\n\n${BULLET} Second`)).toEqual([
        { type: "list", items: ["First", "Second"] },
      ]);
    });

    it("closes an open list when prose follows", () => {
      expect(parseGameText(`${BULLET} First\nBack to prose.`)).toEqual([
        { type: "list", items: ["First"] },
        { type: "paragraph", text: "Back to prose." },
      ]);
    });

    it("flushes a list that ends the text", () => {
      expect(parseGameText(`Intro.\n\n${BULLET} Only item`)).toEqual([
        { type: "paragraph", text: "Intro." },
        { type: "list", items: ["Only item"] },
      ]);
    });

    it("strips the bullet and surrounding whitespace from each item", () => {
      expect(parseGameText(`  ${BULLET}   Spaced out   `)).toEqual([
        { type: "list", items: ["Spaced out"] },
      ]);
    });
  });

  // The five bodies at the entrance intersection are the shape this parser
  // exists for: docs/01_PRODUCT_DIRECTION.md cites them as the worked example.
  it("splits an intro paragraph from its findings list", () => {
    const text = [
      "Three of the dead were adventurers, while two appear to have been guards.",
      "",
      `${BULLET} Body #1 — A human fighter slumped against the wall.`,
      "",
      `${BULLET} Body #2 — A human magic-user impaled against the wall.`,
    ].join("\n");

    expect(parseGameText(text)).toEqual([
      {
        type: "paragraph",
        text: "Three of the dead were adventurers, while two appear to have been guards.",
      },
      {
        type: "list",
        items: [
          "Body #1 — A human fighter slumped against the wall.",
          "Body #2 — A human magic-user impaled against the wall.",
        ],
      },
    ]);
  });
});
