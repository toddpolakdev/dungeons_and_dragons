import GameText from "./GameText";

export default function Discoveries({ items, collectedItems, onTakeItem }) {
  return items.map((item) => {
    const collected = collectedItems.some(
      (collectedItem) => collectedItem.id === item.id,
    );

    return (
      <div className="discovery" key={item.id}>
        <div className="discovery-name">{item.name}</div>

        {item.source && <div className="discovery-source">{item.source}</div>}

        <div className="discovery-description">
          <GameText text={item.description} />
        </div>

        {collected ? (
          <span className="discovery-taken">✓ Taken</span>
        ) : (
          <button onClick={() => onTakeItem(item)}>Take {item.name}</button>
        )}
      </div>
    );
  });
}
