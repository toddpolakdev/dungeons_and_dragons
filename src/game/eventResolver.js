import { events } from "./events";

export function resolveEvents(eventIds = [], worldState) {
  const messages = [];
  const triggeredEvents = [...worldState.triggeredEvents];

  for (const eventId of eventIds) {
    const event = events[eventId];

    if (!event) continue;

    const alreadyTriggered = triggeredEvents.includes(eventId);

    if (event.once && alreadyTriggered) {
      continue;
    }

    messages.push(event.message);

    if (!alreadyTriggered) {
      triggeredEvents.push(eventId);
    }
  }

  return {
    messages,
    triggeredEvents,
  };
}
