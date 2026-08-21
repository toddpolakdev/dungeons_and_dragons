# Gameplay and Implementation Status

**Status snapshot:** 2026-08-20

This file distinguishes between:

- **SETTLED** — safe for UI work to rely on;
- **IN FLUX / NOT FULLY SPECIFIED** — avoid making the UI depend on one assumed final design;
- **PLANNED / DELIBERATELY UNBUILT** — absence is expected and should not automatically be treated as a bug.

It intentionally does not document the code layout.

---

## SETTLED

### B1 is the content authority

Implemented adventure content should be driven by the module rather than by invented replacement prose.

This has already caused a cleanup pass over the implemented Entrance → Alcoves → Magic Mouths → Intersection sequence.

### Exploration is action-driven

The current interaction model includes explicit exploration actions such as movement and examination/searching rather than dumping every room fact immediately.

UI should make it obvious:

- where the player is;
- what they can do;
- what result came from the action they just took.

### Discoveries and world changes can persist

The game tracks persistent exploration outcomes such as:

- examined features;
- triggered events;
- discovered secrets;
- collected items.

The UI should therefore be able to represent a room differently after the player has interacted with it.

Do not assume every room is stateless or that revisiting it produces the same available interactions forever.

### Module events are not all one-shot

The Magic Mouths in B1's third pair of entrance alcoves are a specific example.

The module says they are a permanent feature and **reappear on every visit**. Therefore the UI and event presentation must not assume that an event being recorded in state means it can never be presented again.

Source reference: B1 upper-level key, **1. ALCOVES**.

### Examination results should be readable as discrete findings

Where one action returns several independently meaningful observations, show them as separate readable units.

The entrance intersection's five bodies are the established example.

### Hidden information should stay hidden until earned

A source description may contain details that require examination or a specific interaction. Those details should not be surfaced merely because the room has loaded.

This is central to the text-adventure model and to B1's exploration play.

---

## IN FLUX / NOT FULLY SPECIFIED

### Final UI / visual system

Not decided. See `01_PRODUCT_DIRECTION.md`.

### Full character-facing rules presentation

The project has rules-related systems in progress, but the final presentation of character stats, inventory, checks, timing, and other Basic D&D procedures is not documented as settled enough for a highly specialized UI.

Build flexible presentation, not a rigid rules dashboard.

### Exact treatment of Basic D&D edition differences

The project has multiple Basic D&D rules references available. No project decision captured here establishes that every global rule must follow one specific edition in every disputed case.

B1-specific instructions are authoritative for B1-specific behavior.

Where a non-B1 rule differs among Holmes / Moldvay / later Basic material, do not silently choose an edition in the UI. That is a game-design/rules decision.

### Player map / automapping

Because the target is the full module, some form of navigation support may eventually be useful.

What is **not** decided:

- no map at all;
- player-drawn style automap;
- discovered-rooms-only map;
- schematic navigation aid;
- room history / breadcrumb trail.

Do not build an omniscient full-dungeon map by assumption.

### Dungeon stocking behavior

B1 was designed so a Dungeon Master could place monsters and treasures from supplied lists, producing different stocked versions of the dungeon.

For a solo digital adaptation, the final policy for this has not been captured as a settled product decision here.

Possible approaches would have materially different UI consequences, so do not assume one:

- fixed canonical stocking chosen by the project;
- randomized stocking at new game;
- seeded random stocking;
- selectable configurations.

Treat this as an open design issue until explicitly resolved.

---

## PLANNED / DELIBERATELY UNBUILT

### Wandering monsters

**Planned. Not a bug merely because they are not wired in yet.**

Wandering monsters are part of the intended B1 experience and were explicitly called out as something the project must include.

For the upper level, B1 specifies a wandering-monster check cadence and table. This system still needs to become part of actual play rather than being forgotten while fixed room content is implemented.

Source reference: B1 upper-level **WANDERING MONSTERS** section.

UI implication: leave room for unsolicited encounter/event results that can occur because time has passed, not only because the player clicked a room-specific action.

### Combat state / encounter handoff

The project has a `COMBAT` game state and combat-related code, but combat is **not yet fully wired into the B1 exploration flow**.

Treat this as **planned integration**, not proof that the state machine is broken.

The UI should not contort itself to fake a complete combat loop before encounters actually transition into it.

### Full-module room implementation

Most of Quasqueton remains to be brought into the game.

The currently working entrance material is a milestone, not a finished scope boundary.

### Encounter population across the dungeon

Fixed and wandering encounters beyond the currently implemented slice are still future work.

### Complete treasure / object interaction coverage

Only the interactions reached so far should be assumed implemented.

The project is proceeding feature-by-feature through room details. Missing interactions in unimplemented rooms are expected.

---

## Current milestone

The implemented/tested path has progressed through the beginning of B1's upper level:

- entrance movement;
- the alcoves;
- the Magic Mouth warning;
- the intersection after the alcoves;
- examination of the bodies;
- discovery-oriented interactions around that area.

The team has also been cleaning up the temporary test UI so each action and result is easier to inspect.

The development sequence is still moving outward from this opening area. Do not mistake the current content boundary for the intended product scope.

---

## Bug triage rule for UI work

Before treating missing behavior as a defect, classify it:

**Likely bug**
- a behavior already implemented and specified stops working;
- player-visible state contradicts a known settled rule;
- a module-driven interaction that is already in the current implemented slice regresses.

**Likely planned / not wired yet**
- wandering monsters do not occur;
- combat never begins from B1 encounters that have not been integrated;
- rooms outside the current implementation boundary are unavailable;
- broader character/rules UI is absent.

When uncertain, prefer labeling the issue as **needs product/gameplay classification** rather than repairing it by inventing behavior.
