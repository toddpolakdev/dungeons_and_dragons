import { useState } from "react";
import { useVoices } from "../hooks/useVoices";
import {
  speak,
  stopSpeaking,
  setNarrationSettings,
  getNarrationSettings,
  isSpeechSupported,
} from "../narrator";

const SAMPLE =
  "Two steps rise to an intersection. Five decomposing bodies mark the site of a violent hand-to-hand battle.";

/**
 * Development panel for auditioning speech-synthesis voices.
 *
 * What voices exist is entirely browser- and OS-dependent, so this exists to
 * show what is actually available on this machine rather than guessing. The
 * chosen settings are shared with every SpeakButton via narrator.js.
 */
export default function NarrationPanel() {
  const voices = useVoices();
  const initial = getNarrationSettings();

  const [voiceName, setVoiceName] = useState(initial.voiceName ?? "");
  const [rate, setRate] = useState(initial.rate);
  const [pitch, setPitch] = useState(initial.pitch);
  const [volume, setVolume] = useState(initial.volume);
  const [langFilter, setLangFilter] = useState("all");
  const [sample, setSample] = useState(SAMPLE);

  const supported = isSpeechSupported();

  const languages = [...new Set(voices.map((voice) => voice.lang))].sort();

  const shown =
    langFilter === "all"
      ? voices
      : voices.filter((voice) => voice.lang === langFilter);

  function apply(next) {
    const merged = { voiceName, rate, pitch, volume, ...next };

    if (next.voiceName !== undefined) setVoiceName(next.voiceName);
    if (next.rate !== undefined) setRate(next.rate);
    if (next.pitch !== undefined) setPitch(next.pitch);
    if (next.volume !== undefined) setVolume(next.volume);

    setNarrationSettings({
      ...merged,
      voiceName: merged.voiceName || null,
    });
  }

  function test(name) {
    speak(sample, { rate, pitch, volume, voiceName: name || null });
  }

  return (
    <details className="panel narration-panel">
      <summary>
        <span className="summary-title">Narration</span>

        <span className="summary-note">
          {supported
            ? `${voices.length} voice${voices.length === 1 ? "" : "s"} available`
            : "Not supported in this browser"}
        </span>
      </summary>

      {!supported ? (
        <p className="empty-message">
          This browser does not expose the Web Speech API.
        </p>
      ) : (
        <>
          <div className="narration-controls">
            <label className="narration-field">
              <span className="narration-label">Rate {rate.toFixed(2)}</span>

              <input
                type="range"
                min="0.5"
                max="1.6"
                step="0.05"
                value={rate}
                onChange={(event) =>
                  apply({ rate: Number(event.target.value) })
                }
              />
            </label>

            <label className="narration-field">
              <span className="narration-label">Pitch {pitch.toFixed(2)}</span>

              <input
                type="range"
                min="0.5"
                max="1.6"
                step="0.05"
                value={pitch}
                onChange={(event) =>
                  apply({ pitch: Number(event.target.value) })
                }
              />
            </label>

            <label className="narration-field">
              <span className="narration-label">
                Volume {volume.toFixed(2)}
              </span>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(event) =>
                  apply({ volume: Number(event.target.value) })
                }
              />
            </label>

            <label className="narration-field">
              <span className="narration-label">Language</span>

              <select
                value={langFilter}
                onChange={(event) => setLangFilter(event.target.value)}
              >
                <option value="all">All ({voices.length})</option>

                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="narration-sample">
            <span className="narration-label">Sample text</span>

            <textarea
              rows="2"
              value={sample}
              onChange={(event) => setSample(event.target.value)}
            />
          </label>

          <div className="map-controls">
            <button onClick={() => test(voiceName)}>Test selected</button>

            <button onClick={stopSpeaking}>Stop</button>

            <span className="summary-note">
              {voiceName || "Browser default"} — applies to every Read Aloud
              button
            </span>
          </div>

          {voices.length === 0 ? (
            <p className="empty-message">
              No voices reported yet. Chromium populates these asynchronously —
              if this stays empty, the OS has no speech voices installed.
            </p>
          ) : (
            <ul className="voice-list">
              <li className="voice-row">
                <button
                  className={voiceName === "" ? "voice-name is-active" : "voice-name"}
                  onClick={() => apply({ voiceName: "" })}
                >
                  Browser default
                </button>

                <span className="summary-note">—</span>

                <button onClick={() => test("")}>Test</button>
              </li>

              {shown.map((voice) => (
                <li className="voice-row" key={`${voice.name}-${voice.lang}`}>
                  <button
                    className={
                      voiceName === voice.name
                        ? "voice-name is-active"
                        : "voice-name"
                    }
                    onClick={() => apply({ voiceName: voice.name })}
                  >
                    {voice.name}
                  </button>

                  <span className="summary-note">
                    {voice.lang}
                    {voice.localService ? " · local" : " · network"}
                    {voice.default ? " · default" : ""}
                  </span>

                  <button onClick={() => test(voice.name)}>Test</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </details>
  );
}
