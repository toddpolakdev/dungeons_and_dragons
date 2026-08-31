import { Fragment, useEffect, useState } from "react";
import GameText from "./GameText";
import SpeakButton from "../components/SpeakButton";

export default function LatestStep({ step, room }) {
  const [imageOpen, setImageOpen] = useState(false);

  const image = step?.image ?? room?.image ?? null;

  useEffect(() => {
    if (!imageOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setImageOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageOpen]);

  return (
    <aside className="panel latest-panel">
      <p className="latest-label">What just happened</p>

      {step ? (
        <>
          <h2 className="latest-title">
            Step {step.id}: {step.title}
          </h2>

          {step.messages.map((message, index) => (
            <Fragment key={index}>
              <GameText text={message} />
              <SpeakButton text={message} label="🔊 Read Latest Narration" />
            </Fragment>
          ))}

          {image && (
            <>
              <button
                type="button"
                className="latest-step-image"
                onClick={() => setImageOpen(true)}
                aria-label="View larger image"
              >
                <img src={image.src} alt={image.alt} />
              </button>

              {imageOpen && (
                <div
                  className="image-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Larger scene image"
                  onClick={() => setImageOpen(false)}
                >
                  <button
                    type="button"
                    className="image-modal-close"
                    onClick={() => setImageOpen(false)}
                    aria-label="Close image"
                  >
                    ×
                  </button>

                  <div
                    className="image-modal-content"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <h2 className="latest-title">Nothing yet</h2>

          <p className="empty-message">
            Your most recent action will appear here.
          </p>
        </>
      )}
    </aside>
  );
}
