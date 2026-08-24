import { useEffect, useState } from "react";
import { subscribeToVoices } from "../narrator";

/**
 * Live list of the browser's speech-synthesis voices.
 *
 * Handles the asynchronous population described in narrator.js, so consumers
 * get an empty list on first render and the real list once the browser is ready.
 */
export function useVoices() {
  const [voices, setVoices] = useState([]);

  useEffect(() => subscribeToVoices(setVoices), []);

  return voices;
}
