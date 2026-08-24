import GameText from "./GameText";

export default function StepLog({ steps }) {
  return (
    <details className="panel history" open>
      <summary>
        <span className="summary-title">Game History</span>

        <span className="summary-note">
          {steps.length === 1 ? "1 step" : `${steps.length} steps`}
        </span>
      </summary>

      {steps.length === 0 ? (
        <p className="empty-message">No actions have been taken yet.</p>
      ) : (
        steps.map((step) => (
          <div className="step" key={step.id}>
            <div className="step-heading">
              <span className="step-number">Step {step.id}</span>

              <span className="step-title">{step.title}</span>
            </div>

            <div className="step-body">
              {step.messages.map((message, index) => (
                <GameText key={index} text={message} />
              ))}
            </div>
          </div>
        ))
      )}
    </details>
  );
}
