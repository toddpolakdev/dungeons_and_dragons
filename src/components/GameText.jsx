import { parseGameText, LABEL_SEPARATOR } from "../utils/parseGameText";

function Finding({ text }) {
  // Findings are authored as "Body #1 — description". Pulling the label out lets
  // the list be scanned without reading every entry end to end.
  const separator = text.indexOf(LABEL_SEPARATOR);

  if (separator === -1) {
    return <li className="finding">{text}</li>;
  }

  return (
    <li className="finding">
      <span className="finding-label">{text.slice(0, separator)}</span>
      {text.slice(separator + LABEL_SEPARATOR.length)}
    </li>
  );
}

/**
 * Renders a game message as readable blocks rather than one dense paragraph.
 * Parsing lives in src/utils/parseGameText.js.
 */
export default function GameText({ text }) {
  const blocks = parseGameText(text);

  if (blocks.length === 0) return null;

  return blocks.map((block, index) =>
    block.type === "list" ? (
      <ul className="findings" key={index}>
        {block.items.map((item, itemIndex) => (
          <Finding key={itemIndex} text={item} />
        ))}
      </ul>
    ) : (
      <p className="prose" key={index}>
        {block.text}
      </p>
    ),
  );
}
