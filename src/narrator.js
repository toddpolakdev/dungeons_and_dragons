export function speak(text, options = {}) {
  if (!text) return;

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this browser.");
    return;
  }

  // Stop current narration before starting something new.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = options.rate ?? 0.9;
  utterance.pitch = options.pitch ?? 0.9;
  utterance.volume = options.volume ?? 1;

  if (options.voiceName) {
    const voices = window.speechSynthesis.getVoices();

    const selectedVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes(options.voiceName.toLowerCase()),
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function getAvailableVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  return window.speechSynthesis.getVoices();
}

/**
 * Voices load ASYNCHRONOUSLY in Chromium browsers: getVoices() returns an empty
 * array on the first call and fills in later, firing a `voiceschanged` event.
 * Reading it once during render will usually see nothing, so subscribe instead.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToVoices(callback) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    callback([]);
    return () => {};
  }

  function emit() {
    callback(window.speechSynthesis.getVoices());
  }

  emit();

  window.speechSynthesis.addEventListener("voiceschanged", emit);

  return () => {
    window.speechSynthesis.removeEventListener("voiceschanged", emit);
  };
}

/**
 * Shared narration settings.
 *
 * Kept as module state rather than context: every SpeakButton reads these at
 * click time, so choosing a voice in the narration panel applies everywhere
 * without threading props through RoomPanel and LatestStep.
 */
let narrationSettings = {
  rate: 0.9,
  pitch: 0.9,
  volume: 1,
  voiceName: null,
};

export function getNarrationSettings() {
  return { ...narrationSettings };
}

export function setNarrationSettings(next) {
  narrationSettings = { ...narrationSettings, ...next };
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
