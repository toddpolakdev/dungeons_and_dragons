import { useRef, useState } from "react";

/**
 * A draggable, resizable panel that floats above the page.
 *
 * Drag by the title bar; resize from the bottom-right corner of the body (native
 * CSS resize). Position is clamped so the bar can never be dragged fully off
 * screen and become unreachable.
 */
export default function FloatingPanel({
  title,
  subtitle,
  initialPosition = { x: 24, y: 88 },
  onClose,
  children,
}) {
  const [position, setPosition] = useState(initialPosition);
  const [minimized, setMinimized] = useState(false);
  const dragOffset = useRef(null);

  function clamp(x, y) {
    // Keep a grabbable strip of the title bar on screen in both axes.
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 48;

    return {
      x: Math.min(Math.max(x, -80), maxX),
      y: Math.min(Math.max(y, 0), maxY),
    };
  }

  function handlePointerDown(event) {
    // Let the minimise / close buttons work without starting a drag.
    if (event.target.closest("button")) return;

    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragOffset.current) return;

    setPosition(
      clamp(
        event.clientX - dragOffset.current.x,
        event.clientY - dragOffset.current.y,
      ),
    );
  }

  function handlePointerUp(event) {
    if (!dragOffset.current) return;

    dragOffset.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <section
      className="floating-panel"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <header
        className="floating-bar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="floating-title">{title}</span>

        {subtitle && <span className="summary-note">{subtitle}</span>}

        <span className="floating-actions">
          <button
            type="button"
            onClick={() => setMinimized((on) => !on)}
            title={minimized ? "Expand" : "Minimise"}
          >
            {minimized ? "▣" : "—"}
          </button>

          {onClose && (
            <button type="button" onClick={onClose} title="Close">
              ✕
            </button>
          )}
        </span>
      </header>

      {!minimized && <div className="floating-body">{children}</div>}
    </section>
  );
}
