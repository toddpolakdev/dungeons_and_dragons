import { speak, stopSpeaking, getNarrationSettings } from "../narrator";

/**
 * Props override the shared narration settings when given, so a specific button
 * can be pinned to a particular voice. Left undefined, they follow whatever is
 * chosen in the Narration panel.
 */
export default function SpeakButton({
  text,
  label = "🔊 Read Aloud",
  rate,
  pitch,
  volume,
  voiceName,
}) {
  function handleSpeak() {
    const shared = getNarrationSettings();

    speak(text, {
      rate: rate ?? shared.rate,
      pitch: pitch ?? shared.pitch,
      volume: volume ?? shared.volume,
      voiceName: voiceName ?? shared.voiceName,
    });
  }

  return (
    <div className="speech-controls">
      <button type="button" onClick={handleSpeak} disabled={!text}>
        {label}
      </button>

      <button type="button" onClick={stopSpeaking}>
        ⏹ Stop
      </button>
    </div>
  );
}
