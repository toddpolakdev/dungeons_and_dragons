# Open Questions

**Status snapshot:** 2026-08-20

These items have **not** been decided clearly enough to treat one answer as project canon.

For a developer joining the project, this file is as important as the decision docs: do not turn an unanswered question into an accidental product decision through UI implementation.

---

## Visual direction

### What should the finished game look like?

Still open.

No final choice has been made between a period-inspired B1 presentation, a dark modern dungeon interface, a minimal reader, or another direction.

Until decided, optimize the temporary UI for clarity and testing.

---

## Player mapping and navigation

The project target is the full B1 dungeon, but the player-facing mapping model is unresolved.

Questions still open:

- Should the game provide an automap?
- If so, should it show only explored spaces?
- Should it reproduce the module geometry or use an abstract graph?
- Should the player have a location history or breadcrumb trail?
- Should discovered secret doors appear automatically once found?
- Should a room index exist at all?

Important constraint: the original adventure relies on exploration and incomplete knowledge, so a complete omniscient map is **not** a neutral UI choice.

---

## Monster and treasure stocking

B1 intentionally leaves much of the dungeon's monster and treasure placement to the Dungeon Master.

A solo digital version needs a policy, but no final policy is documented here.

Open questions:

- fixed project-authored stocking;
- random stocking per new game;
- seeded/reproducible random stocking;
- multiple presets;
- some hybrid.

This should be resolved before UI is built around concepts such as encounter previews, run seeds, restart behavior, or a deterministic room encyclopedia.

---

## Rules baseline outside B1-specific instructions

The project has access to multiple Basic D&D rules references.

Open question:

> Which rules source is authoritative when B1 itself does not specify the behavior and the Basic editions differ?

Do not make edition-specific assumptions in UI copy or rules explanations unless the rules baseline is explicitly chosen.

---

## Character model and party model

The current project is a solo-player digital adventure, but the eventual breadth of the controlled adventuring party is not fully specified here.

Open questions include:

- one player character only;
- one player character plus retainers;
- multiple directly controlled adventurers;
- how death / replacement characters work;
- how much of B1's original 3–8-adventurer expectation should be simulated.

Avoid UI layouts that only work for exactly one permanent character unless that constraint is separately confirmed.

---

## Time, light, rest, and resource pressure

B1 and Basic D&D assume meaningful time passage, wandering-monster checks, light sources, and other expedition pressures.

Wandering monsters are explicitly planned, but the full digital treatment of the surrounding time/resource loop is not yet settled in these project notes.

Open questions include:

- how turns advance for each action;
- whether the player sees an explicit turn clock;
- torch / lantern tracking;
- rest handling;
- whether examination/search actions consume standardized time;
- how much of encumbrance is simulated.

Do not build a large permanent HUD for these until the model is decided.

---

## DM / developer inspector

Normal play should not expose `dm:` blocks or module citations.

A separate development/debug view may eventually be useful, but it has not been specified.

Open questions:

- whether it exists in production;
- how it is toggled;
- what hidden state it exposes;
- whether it shows source citations and raw room data.

Do not mix this into the default player UI.

---

## Final prose adaptation policy

The settled rule is: do not invent replacement canonical content where B1 already provides the material.

Still open at a finer level:

- how closely player-facing prose should mirror B1 wording;
- when to paraphrase for interactive presentation;
- whether original module quotations are ever shown verbatim;
- how much detail to defer behind Examine/Search.

For now, preserve source fidelity and avoid adding flavor merely to make a screen feel more literary.

---

## Questions the UI developer should escalate rather than answer alone

- “Should I show the whole map?”
- “Should this DM note be visible?”
- “Should every triggered event disappear forever?”
- “Should a room always have a monster?”
- “Should a new game randomize the dungeon?”
- “Which Basic rules edition should this tooltip quote?”
- “Should I add a turn/light/encumbrance HUD?”
- “Should I create extra narrative copy for empty states?”

These are product/gameplay questions, not styling details.

## AI Dungeon Master / narrator

The long-term product is intended to support an AI Dungeon Master / narrator
layer over the deterministic B1 game engine.

Settled boundary:

- the game engine remains authoritative for B1 content and mechanical state;
- AI must not invent canonical room facts, encounters, treasures, rules, or
  outcomes;
- hidden DM information must not be exposed to the model when the player has not
  earned it.

Still open:

- whether AI narration is optional or the primary play mode;
- whether the player can communicate through free-form text, voice, or both;
- how free-form requests map onto supported engine actions;
- whether generated narration may add non-canonical atmospheric phrasing;
- which model/provider is used;
- whether AI processing requires a server or serverless layer;
- cost, latency, privacy, and offline/fallback behavior;
- whether generated voice replaces or supplements browser speech synthesis;
- how conversation history is separated from authoritative game state.
