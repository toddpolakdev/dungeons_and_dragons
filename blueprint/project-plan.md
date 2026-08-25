# Project Plan

> One of the two planning docs you provide. Use as much detail as the project
> needs, including rationale, constraints, examples, edge cases, and explicit
> exclusions that should guide later feature work. Draft it directly, develop it
> through any AI conversation, or optionally run `/discovery` for a guided deep
> planning session. The content is always yours to direct. When it is filled in,
> run `/overview` to generate the project overview from this plus `build-plan.md`.

> Seeded by `/adopt` from the existing codebase and the `docs/` notes. Sections 1,
> 2, 3, 5, and 7 restate decisions already recorded in `docs/`; that folder stays
> the source of truth for product intent, and this file is the Blueprint-facing
> summary of it.

## 1. Problem - What problem are we solving?

D&D Module B1, *In Search of the Unknown* (Mike Carr, 1979), is a tabletop
adventure that needs a Dungeon Master to run it. A solo player cannot experience
it without one.

This project is a digital adaptation that takes on the DM's responsibilities:
describing rooms, resolving examinations and searches, running events, tracking
what the party has discovered, and applying the module's procedures.

The governing constraint is content fidelity. Where B1 specifies a room feature,
event, object, clue, or behavior, the module is the authority. Gaps are not
filled by inventing replacement canonical prose. When the digital format forces a
decision B1 does not make, that gets recorded as a product decision rather than
disguised as source fidelity.

See `docs/00_README.md` for the full statement of this principle.

## 2. Users - Who is this for?

A **solo player** who wants to play through B1 directly, without a DM and without
a group.

Explicitly not the audience right now: a DM running B1 for a table. This is not a
DM dashboard. Room data carries `dm:` blocks and module source-area citations, and
that material is internal authoring and verification data, not player-facing
content.

The spoiler boundary follows from that: the player receives only what their
character has legitimately obtained by entering an area, observing it, examining
or searching, triggering an event, interacting with an object, or otherwise
satisfying the relevant condition. The presence of data in a room object is never
a reason to display it.

## 3. Features - What does the MVP need?

Already built (see `build-plan.md` for the checked list):

- Room model with descriptions, examine text, exits, features, and nested
  interactions, driven by B1
- Action-driven exploration: move, examine room, examine feature, search feature,
  interact, open container, take item
- Persistent world state so a room can present differently after the player has
  acted on it
- Module events that respect B1's once-versus-recurring semantics
- Dice, ability checks, and percentile rolls
- Thief lock-picking gated on class, tools, skill, and one attempt per lock
- Text-to-speech narration of room and result text
- A development and testing UI that shows each action and its result as a
  discrete, inspectable step
- A developer map panel overlaying pins on the module map scans

Still needed for the product to be what it intends to be:

- The rest of the B1 upper level, then the lower level
- Combat actually reachable from B1 encounters
- Wandering monsters and the time model they depend on
- A player-facing presentation layer that replaces the test harness

## 4. Data - What are we storing?

There is no database and no server. All state is in-memory React state for the
duration of a session, and it is lost on reload.

- **Room and content data** - static, authored in `src/game/rooms.js`. Rooms,
  features, nested interactions, containers, locks, traps, items, secrets, and
  `dm:` metadata including module source-area citations.
- **Event definitions** - static, in `src/game/events.js`.
- **World state** - runtime, from `createWorldState()`. Arrays tracking examined
  features, searched features, completed interactions, discovered items,
  triggered events, completed encounters, discovered secrets, collected items,
  active effects, unlocked locks, opened containers, attempted locks, and
  triggered traps. Entries that identify a specific thing use composite string
  keys such as `roomId:featureId:lockId`.
- **Character state** - runtime. Player, including class, level, hp, ac, attack
  bonus, damage, equipment, and thief skills.
- **Session state** - runtime. Current room, visited room ids, step log, game
  state (`EXPLORING`, `COMBAT`, `GAME_OVER`), map panel state.

> TODO (confirm): whether save/resume is wanted, and if so whether it is
> `localStorage` or something server-backed. Nothing today survives a reload.

## 5. Tech - What stack are we using?

Current, and intentional:

- **React 19** with **Vite 8**, `@vitejs/plugin-react`
- **JavaScript with JSX**, no TypeScript
- **Plain CSS** in two files, built on custom-property design tokens in
  `src/index.css`
- **npm** (`package-lock.json`)
- **ESLint 10** flat config, with the react-hooks and react-refresh plugins
- **Web Speech API** for narration, no external TTS service
- No database, no backend, no auth, no state library beyond React `useState`, no
  router

Wanted later, and tracked as build-plan items rather than assumed:

- TypeScript
- A unit test runner (Vitest is the natural fit for a Vite project)
- A router, which becomes relevant once a player-facing page lives beside the
  test page

## 6. Monetize - How will this make money?

It does not. This is a **portfolio and demo piece**.

One rights note that matters before anything is published: B1's text and maps are
third-party material (TSR, now Wizards of the Coast). The module map scans under
`public/maps/` already carry this caveat in their README. Fine for a local
development tool, but a public deployment needs that question answered first.

> TODO (confirm): whether a public deployment is a goal at all, given the above.

## 7. UI/UX - How should this look and feel?

**The final visual direction is deliberately undecided.** `docs/03_OPEN_QUESTIONS.md`
lists this as open, and it should not be settled by implementation drift.

Not yet chosen, and none of these should be assumed: faux-parchment 1979
facsimile, modern dark dungeon crawler, polished fantasy RPG HUD, clean ebook
reader, terminal or parser interface.

What *is* decided: the current interface is a **temporary development and testing
UI**, not the target presentation layer. Until an art direction is chosen, prefer a
clear, restrained reading-and-action interface. Optimize for:

- readability
- clear separation between room description, available actions, results, and
  state changes
- being able to see what happened on each individual step
- low visual clutter
- easy inspection while mechanics are still being implemented

The established concrete example: examining the five bodies at the entrance
intersection renders as separate readable findings, not one dense paragraph.

Product guardrails for UI work, from `docs/01_PRODUCT_DIRECTION.md`:

1. Do not invent a final art direction.
2. Do improve readability now.
3. Do not expose DM or internal source data in the normal player view.
4. Do not design as if the project ends at the entrance corridor.
5. Do not expose a complete dungeon map or room index unless explicitly approved.
   B1 is built around exploration and incomplete knowledge, so an omniscient map
   is not a neutral choice.
6. Do not rewrite module-driven text into new canonical narrative just to fill a
   screen.

## 8. Deployment - Where and how will this ship?

Not deployed. There is no host, no provider config, and no CI.

If it ships, it is a static build: `npm run build` produces `dist/`, servable from
any static host with no server runtime, no environment variables, no database, and
no health check path.

> TODO (confirm): whether deployment is in scope, and if so where. The B1 rights
> question in section 6 comes first.
