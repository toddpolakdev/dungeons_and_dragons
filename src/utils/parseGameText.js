export const BULLET = "•";
export const LABEL_SEPARATOR = " — ";

/**
 * Game copy arrives as preformatted strings (see the body descriptions in
 * src/game/rooms.js). Rather than dropping them into one `white-space: pre-line`
 * paragraph, split them into real blocks so multi-part results read as discrete
 * findings — docs/01_PRODUCT_DIRECTION.md cites the five bodies as the example,
 * and docs/02_GAMEPLAY_STATUS.md makes it a settled rule.
 *
 * This is presentation only: it reads the existing string format and needs no
 * change to the room data.
 *
 * Returns an array of blocks, each either:
 *   { type: "paragraph", text: string }
 *   { type: "list", items: string[] }
 */
export function parseGameText(text) {
  const blocks = [];

  let paragraph = [];
  let listItems = null;

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  }

  function flushList() {
    if (listItems) {
      blocks.push({ type: "list", items: listItems });
      listItems = null;
    }
  }

  for (const rawLine of String(text ?? "").split("\n")) {
    const line = rawLine.trim();

    // A blank line closes a paragraph but deliberately leaves an open list
    // alone: the room data separates consecutive bullets with blank lines.
    if (line === "") {
      flushParagraph();
      continue;
    }

    if (line.startsWith(BULLET)) {
      flushParagraph();

      const item = line.slice(BULLET.length).trim();

      if (listItems) {
        listItems.push(item);
      } else {
        listItems = [item];
      }

      continue;
    }

    // Ordinary prose ends any list that was open.
    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}
