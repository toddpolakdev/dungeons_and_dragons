import { Fragment } from "react";
import GameText from "./GameText";
import SpeakButton from "../components/SpeakButton";

export default function LatestStep({ step }) {
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
