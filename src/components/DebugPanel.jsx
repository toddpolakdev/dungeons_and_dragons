/**
 * Development inspector.
 *
 * docs/01_PRODUCT_DIRECTION.md guardrail 3 says DM / internal source data must not
 * appear in the normal player view, and docs/03_OPEN_QUESTIONS.md leaves the real
 * developer inspector unspecified. This stays for now because the current phase
 * explicitly values easy inspection, but it belongs to the test page only and should
 * be gated before there is ever a player-facing build.
 */
export default function DebugPanel({ worldState }) {
  return (
    <details className="debug">
      <summary>World State / Debug</summary>

      <pre>{JSON.stringify(worldState, null, 2)}</pre>
    </details>
  );
}
