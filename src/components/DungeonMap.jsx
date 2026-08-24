import { useRef, useState } from "react";
import { maps, roomCoords, DEFAULT_LEVEL } from "../map/roomCoords";
import FloatingPanel from "./FloatingPanel";

function round(value) {
  return Math.round(value * 1000) / 1000;
}

/**
 * Development map for the test page.
 *
 * This deliberately shows the whole level. It is an inspection tool in the same
 * category as the world-state dump, NOT a player-facing automap — docs/01
 * guardrail 5 freezes that until the navigation question in docs/03 is decided.
 * Keep it off any player build.
 *
 * Coordinates in src/map/roomCoords.js are fractions of the map IMAGE, so they
 * are only meaningful against the exact file in public/maps/ — a differently
 * cropped scan invalidates all of them. Calibrate here rather than by hand:
 * turn on "Pick coordinates" and play. The picker follows the player, so each
 * room is placed while you are standing in it.
 */
export default function DungeonMap({
  rooms,
  currentRoomId,
  visitedRoomIds,
  onClose,
  picks = {},
  onPicksChange = () => {},
}) {
  const frameRef = useRef(null);

  const [levelOverride, setLevelOverride] = useState(null);
  const [pickerOn, setPickerOn] = useState(false);
  const [followPlayer, setFollowPlayer] = useState(true);
  const [manualRoomId, setManualRoomId] = useState(currentRoomId);
  // Calibration picks are owned by the parent so they survive closing this
  // panel — losing a calibration pass to a stray click on the X would be bad.
  const captured = picks;
  const setCaptured = onPicksChange;
  const [showAll, setShowAll] = useState(false);
  const [hover, setHover] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [missingImages, setMissingImages] = useState([]);
  const [copied, setCopied] = useState(false);

  const roomList = Object.values(rooms);

  // Picks override the committed values so corrections show on the map as they
  // are made, before anything is pasted back into roomCoords.js.
  const effectiveCoords = { ...roomCoords, ...captured };

  // While calibrating, the target follows the player: walk into a room, click
  // where you actually are. That keeps placement honest without a dropdown.
  const targetRoomId = followPlayer ? currentRoomId : manualRoomId;

  const playerLevel = effectiveCoords[currentRoomId]?.level ?? DEFAULT_LEVEL;
  const activeLevel = levelOverride ?? playerLevel;
  const activeMap = maps[activeLevel];

  const imageMissing = missingImages.includes(activeLevel);

  const pinnedIds = showAll ? roomList.map((room) => room.id) : visitedRoomIds;

  const plotted = pinnedIds
    .map((id) => ({ id, name: rooms[id]?.name ?? id, ...effectiveCoords[id] }))
    .filter(
      (pin) =>
        pin.level === activeLevel &&
        typeof pin.x === "number" &&
        typeof pin.y === "number",
    );

  // The trail follows visit order, so it stays the visited set even when every
  // room is being shown for verification.
  const trail = visitedRoomIds
    .map((id) => effectiveCoords[id])
    .filter(
      (pin) =>
        pin?.level === activeLevel &&
        typeof pin.x === "number" &&
        typeof pin.y === "number",
    );

  const missingCoords = roomList.filter((room) => !effectiveCoords[room.id]);

  const targetRoom = rooms[targetRoomId];
  const target = effectiveCoords[targetRoomId];
  const targetCaptured = captured[targetRoomId];

  function pointFromEvent(event) {
    const rect = frameRef.current.getBoundingClientRect();

    return {
      x: round((event.clientX - rect.left) / rect.width),
      y: round((event.clientY - rect.top) / rect.height),
    };
  }

  function handleFrameClick(event) {
    if (!pickerOn || !frameRef.current) return;

    const point = pointFromEvent(event);

    setCaptured((prev) => ({
      ...prev,
      [targetRoomId]: {
        ...roomCoords[targetRoomId],
        level: activeLevel,
        ...point,
      },
    }));

    setCopied(false);
  }

  function handleFrameMove(event) {
    if (!pickerOn || !frameRef.current) return;

    setHover(pointFromEvent(event));
  }

  function handleImageLoad(event) {
    setImageSize({
      width: event.target.naturalWidth,
      height: event.target.naturalHeight,
    });

    // StrictMode remounts in dev, which aborts the in-flight request and can
    // fire onError even though the file is fine. Clearing the flag on any
    // successful load stops a spurious abort showing "no image" permanently.
    setMissingImages((prev) => prev.filter((level) => level !== activeLevel));
  }

  function buildBlock() {
    const lines = roomList
      .map((room) => {
        const coords = effectiveCoords[room.id];

        if (!coords) return null;

        const area = coords.area ? `"${coords.area}"` : "null";

        return `  ${room.id}: { level: ${coords.level}, area: ${area}, x: ${coords.x}, y: ${coords.y} },`;
      })
      .filter(Boolean);

    return `export const roomCoords = {\n${lines.join("\n")}\n};`;
  }

  const capturedCount = Object.keys(captured).length;

  return (
    <FloatingPanel
      title="Dungeon Map"
      subtitle="Development view — shows the whole level"
      onClose={onClose}
    >
      <div className="map-levels">
        {Object.values(maps).map((level) => (
          <button
            key={level.level}
            className={
              level.level === activeLevel
                ? "map-level map-level--active"
                : "map-level"
            }
            onClick={() => setLevelOverride(level.level)}
          >
            {level.name}
          </button>
        ))}

        {levelOverride !== null && levelOverride !== playerLevel && (
          <button onClick={() => setLevelOverride(null)}>Follow player</button>
        )}

        <button onClick={() => setShowAll((on) => !on)}>
          {showAll ? "Show visited only" : "Show all rooms"}
        </button>
      </div>

      {imageMissing ? (
        <p className="empty-message">
          No image for {activeMap.name}. Save the scan as{" "}
          <code>public{activeMap.src}</code> and reload.
        </p>
      ) : (
        <div
          ref={frameRef}
          className={`map-frame${pickerOn ? " map-frame--picking" : ""}`}
          onClick={handleFrameClick}
          onMouseMove={handleFrameMove}
          onMouseLeave={() => setHover(null)}
        >
          <img
            src={activeMap.src}
            alt={`B1 ${activeMap.name}`}
            onLoad={handleImageLoad}
            onError={() =>
              setMissingImages((prev) =>
                prev.includes(activeLevel) ? prev : [...prev, activeLevel],
              )
            }
          />

          {trail.length > 1 && (
            <svg
              className="map-trail"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                points={trail
                  .map((pin) => `${pin.x * 100},${pin.y * 100}`)
                  .join(" ")}
              />
            </svg>
          )}

          {plotted.map((pin) => (
            <span
              key={pin.id}
              className={`map-pin${
                pin.id === currentRoomId ? " map-pin--current" : ""
              }`}
              style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
              title={pin.name}
            >
              {showAll && <span className="map-pin-label">{pin.name}</span>}
            </span>
          ))}

          {/* The room being calibrated, shown even if never visited. */}
          {pickerOn && target?.level === activeLevel && (
            <span
              className="map-pin map-pin--target"
              style={{
                left: `${target.x * 100}%`,
                top: `${target.y * 100}%`,
              }}
            />
          )}
        </div>
      )}

      <div className="map-controls">
        <button
          onClick={() => {
            setPickerOn((on) => !on);
            setCopied(false);
          }}
        >
          {pickerOn ? "Stop calibrating" : "Pick coordinates"}
        </button>

        {pickerOn && (
          <>
            <select
              value={targetRoomId}
              onChange={(event) => {
                setFollowPlayer(false);
                setManualRoomId(event.target.value);
              }}
            >
              {roomList.map((room) => (
                <option key={room.id} value={room.id}>
                  {captured[room.id] ? "✓ " : ""}
                  {room.name}
                </option>
              ))}
            </select>

            {!followPlayer && (
              <button onClick={() => setFollowPlayer(true)}>
                Follow player
              </button>
            )}
          </>
        )}
      </div>

      {pickerOn && (
        <div className="map-picker">
          <p className="map-picker-target">
            Click{" "}
            <strong>
              {target?.area ? `area ${target.area}` : "the location"}
            </strong>{" "}
            for <strong>{targetRoom?.name ?? targetRoomId}</strong>
            {followPlayer && (
              <span className="summary-note"> — following the player</span>
            )}
            {targetCaptured && (
              <span className="summary-note">
                {" "}
                — set to {targetCaptured.x}, {targetCaptured.y}
              </span>
            )}
          </p>

          <div className="map-controls">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(buildBlock());
                setCopied(true);
              }}
            >
              {copied ? "Copied" : "Copy all coordinates"}
            </button>

            <button
              onClick={() => {
                setCaptured({});
                setCopied(false);
              }}
              disabled={capturedCount === 0}
            >
              Reset picks
            </button>

            <span className="summary-note">
              {capturedCount} of {roomList.length} set this session
            </span>
          </div>

          <p className="map-readout">
            cursor: {hover ? `${hover.x}, ${hover.y}` : "—"}
            {imageSize && (
              <>
                {" · "}image: {imageSize.width}×{imageSize.height}px
              </>
            )}
          </p>
        </div>
      )}

      {missingCoords.length > 0 && (
        <p className="summary-note map-warning">
          No coordinates yet for:{" "}
          {missingCoords.map((room) => room.id).join(", ")}
        </p>
      )}
    </FloatingPanel>
  );
}
