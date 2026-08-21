import GameText from "./GameText";

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
            <GameText key={index} text={message} />
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
