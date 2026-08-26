# Dungeons and Dragons - B1 Digital Adventure - Project Overview

> A solo-player digital adaptation of D&D Module B1, *In Search of the Unknown*,
> where the app takes on the Dungeon Master's role.

> **Generated file. Don't hand-edit.** Produced by `/overview` from
> [../project-plan.md](../project-plan.md) and [../build-plan.md](../build-plan.md).
> When the plans change, re-run `/overview` rather than editing here.

## Problem

D&D Module B1 (Mike Carr, 1979) is a tabletop adventure that requires a Dungeon
Master to run. A solo player cannot experience it without one.

This app performs the DM's role: describing rooms, resolving examinations and
searches, running module events, tracking what the player has discovered, and
applying the module's procedures.

The governing constraint is **content fidelity**. Where B1 specifies a feature,
event, object, clue, or behavior, the module is the authority. Gaps are not filled
with invented replacement prose. When the digital format forces a decision B1 does
not make, that is recorded as a product decision rather than disguised as source
fidelity. See `docs/00_README.md`.

## Users

One user type, no accounts, no access tiers.

- **Solo player** - wants to play B1 directly, without a DM and without a group.

Explicitly **not** the audience: a DM running B1 at a table. This is not a DM
dashboard.

**Spoiler boundary.** The player receives only what their character has
legitimately obtained by entering an area, observing it, examining or searching,
triggering an event, interacting with an object, or otherwise satisfying the
relevant condition. The presence of data in a room object is never a reason to
display it.

## Features

Shipped before Blueprint adoption (items 1 to 10):

1. **Game engine foundation** - dice and formula rolling, characters, attack
   resolution, game states.
2. **Room model and movement** - rooms with descriptions, examine text, exits, and
   features; directional movement between them.
3. **B1 entrance through the intersection** - entrance, three alcove pairs, the
   recurring Magic Mouth event, the intersection and its five bodies.
4. **Persistent world state** - *headline feature.* Examined, searched, triggered,
   discovered, and collected outcomes change how a room presents on a revisit.
   This is what makes it an adventure rather than a room viewer.
5. **Readable findings presentation** - one action returning several observations
   renders as discrete blocks, not one dense paragraph.
6. **Kitchen interactions** - B1 kitchen features, searches, discoveries.
7. **Test UI componentization** - the harness split into components on its own page.
8. **Dining room and lounge interactions** - features, nested interactions,
   discoveries for both rooms.
9. **Wizard chamber, locks and traps** - locked container, thief lock-picking
   gated on class, tools, skill, and a single attempt; trap keys.
10. **Narration and developer map panel** - Web Speech API read-aloud, plus a
    floating panel pinning rooms onto the module map scans.

Active queue:

11. **Unit test runner** (Claude) - Vitest, scripts, one example test, test gate on.
12. **B1 upper level, continued** (ChatGPT / Todd) - area 6 onward. Each new room
    also needs a map pin in `src/map/roomCoords.js`, which is Claude's file.
15. **Router** (Claude) - so a player-facing page can live beside the test page.
16. **Player-facing UI** (Claude) - the real presentation layer, replacing the harness.
17. **TypeScript migration** (unassigned) - convert the codebase to TypeScript.

On hold (engine-heavy, deferred by Todd):

13. **Combat integration** - make `COMBAT` reachable from B1 encounters.
14. **Wandering monsters** - B1 check cadence and table, plus the turn model.
18. **B1 lower level** - the second half of Quasqueton.
19. **AI Dungeon Master / narrator** - an AI narration and interaction layer over
    the deterministic engine. The engine stays authoritative for B1 content, rules,
    state, dice, discoveries, encounters, inventory, and legal actions; the AI
    narrates results and translates conversational input into supported actions.
    A safe structured context and result boundary is defined before any
    conversational input or generated narration is added.

Numbering is non-contiguous by design; on-hold items keep their numbers.

> The current Web Speech API narration (item 10) is an **interim** mechanism, not
> the AI feature. Item 19 eventually supersedes it.

## Data model

**There is no database and no server.** Data splits into static authored content
and in-memory runtime state that is lost on reload. The shapes below are the real
contract every module reads, so later features depend on them.

### Room (static, `src/game/rooms.js`)

Keyed by id in a flat `rooms` object.

- `id` (string) - camelCase, matches the object key
- `name` (string) - player-facing
- `description` (string) - shown on entry
- `examine` (string) - revealed only by the examine action
- `exits` (object) - direction to room id, e.g. `{ north: "firstAlcoves" }`
- `features` (Feature[])
- `dm` (object) - `areaType`, `level`, `module`, `moduleName`, `sourceArea`

### Feature (static, nested in Room)

- `id`, `name`, `description` (string)
- `unlockedDescription`, `openDescription` (string, optional) - state-dependent
  replacements for `description`
- `searchable` (boolean), `search` (string) - the search action and its narration
- `searchResults` (Item[]) - what searching yields
- `interactions` (Interaction[])
- `lock` (Lock, optional), `container` (Container, optional), `trap` (Trap, optional)
- `dm` (object) - always includes `hidden` and usually `sourceArea`

### Interaction (static, nested in Feature)

- `id`, `name`, `message` (string)
- `requiresExamination` (boolean) - gates the action behind having examined first
- `afterDescription` (string) - replaces the feature description once completed
- `discoveredSecret` (Secret, optional), `discoveredItem` (Item, optional)
- `effects.condition` (Condition, optional)

### Item

- `id`, `name` (string)
- `type` (string) - `coins`, `item`, `weapon`
- `quantity` (number), `source` (string) - which body or feature it came from
- `description` (string)
- `condition` (string), `usable` (boolean), `valueGp` (number) - optional

### Lock / Container / Trap (static, nested in Feature)

- **Lock**: `id`, `initiallyLocked` (boolean), `lockedMessage` (string)
- **Container**: `id`, `name`, `openMessage` (string), `empty` (boolean)
- **Trap**: `id`, `trigger` (string), `message` (string), `damage` (number),
  `condition` (Condition), `bypass` (object)

### Condition

- `id`, `name`, `description` (string)
- `duration` (dice formula string, e.g. `"1d4+1"`) - rolled into `durationTurns`
- `isPoison` (boolean)

> **Known gap.** `durationTurns` is rolled and stored on active effects but never
> decremented, because no turn model exists. Conditions currently last forever.
> Recorded in `build-plan.md` under "Known gap worth an owner"; the same clock
> item 14 needs.

### Event (static, `src/game/events.js`)

- `id`, `type`, `message` (string)
- `once` (boolean) - **false means recurring.** The Magic Mouths are permanent in
  B1 and fire on every visit, so a recorded event id does not mean it can never
  present again.
- `dm` (object) - `permanent`, `trigger`, `sourceArea`

### WorldState (runtime, `createWorldState()`)

Fourteen arrays, all appended immutably. Entries that identify a specific thing
use a **composite string key** built by a helper, never an ad-hoc template
literal: `getLockKey(roomId, featureId, lockId)` yields `roomId:featureId:lockId`.

- `examinedFeatures`, `searchedFeatures`, `completedInteractions`
- `discoveredItems`, `collectedItems`, `discoveredSecrets`
- `triggeredEvents`, `completedEncounters`, `activeEffects`
- `unlockedLocks`, `openedContainers`, `attemptedLocks`, `triggeredTraps`

> Lock this shape. Every engine module and most components read it, so a change
> here affects all three contributors.

### Player (runtime, `createPlayer()` / `createTestThief()`)

- `id`, `name`, `classId` (string), `level` (number)
- `hp`, `ac`, `attackBonus` (number), `damage` (dice formula string)
- `equipment` (string[]) - `canPickLock` requires `"thieves-tools"`
- `thiefSkills` (object or null) - `openLocks`, `findTraps`, `removeTraps` as
  percentile targets

### Session state (runtime, `TestPage.jsx`)

`currentRoom`, `visitedRoomIds`, `steps` (the action log), `gameState`
(`EXPLORING` / `COMBAT` / `GAME_OVER`), map panel state.

> TODO: no save or resume. Nothing survives a reload, and no build-plan item
> delivers persistence. Flagged in `project-plan.md` section 4.

### Narration context (item 19, not yet designed)

Item 19 turns the spoiler boundary from a UI rule into a **data boundary**. The AI
layer may only receive what the player is legitimately allowed to know. That means
a deliberate, filtered projection of the shapes above, never the raw objects:

- `dm:` blocks must not be in the context, on any room, feature, or event
- undiscovered secrets, unrevealed `searchResults`, and unfired interactions must
  not be in the context
- rooms the player has not reached, and future encounters, must not be in the context

> TODO: this projection does not exist. Defining it is the first real step of item
> 19, ahead of any conversational input or generated narration. A leak here is not
> a cosmetic bug; it destroys the exploration the module depends on.

## Tech stack

- **React 19** - UI, function components, `useState` only
- **Vite 8** - dev server and build
- **JavaScript with JSX** - no TypeScript until item 17
- **Plain CSS** - two files, design tokens as custom properties on `:root`
- **npm** - `package-lock.json`
- **ESLint 10** - flat config, react-hooks and react-refresh plugins
- **Web Speech API** - narration, no external TTS service

No backend, no database, no auth, no state library, no router (until item 15), no
UI component library, no test runner (until item 11).

> **TODO: item 19 has no stack.** The AI Dungeon Master needs a model provider, an
> API key, and a way to keep that key off the client, which normally means a
> server-side proxy. `project-plan.md` section 5 currently says no backend, and
> section 8 describes a static build with no environment variables. Those three
> statements cannot all stay true. Decide the provider and the hosting shape
> before item 19 is spec'd, then update section 5 and re-run `/overview`.

## Monetization

**Not in v1.** This is a portfolio and demo piece.

> Rights constraint: B1's text and maps are third-party material (TSR, now Wizards
> of the Coast). `public/maps/README.md` already flags the map scans as fine for
> local development but needing review before publication. This gates any public
> deployment.

> Cost note: item 19 makes this project cost money per play session, since every
> narrated action is a model call. A portfolio piece with no revenue and a public
> URL is an open-ended bill. Worth deciding alongside the stack question above.

## UI/UX

**The final visual direction is deliberately undecided** and must not be settled
by implementation drift. Not chosen, and not to be assumed: faux-parchment 1979
facsimile, modern dark dungeon crawler, fantasy RPG HUD, ebook reader, terminal
interface.

The current interface is a **temporary development and testing UI**. Until an art
direction is chosen, prefer a clear, restrained reading-and-action interface
optimized for readability, clear separation between room description, actions,
results, and state changes, visible per-step outcomes, low clutter, and easy
inspection.

Routes: there is no router. `App.jsx` renders one page.

- `TestPage` - the entire app. Room panel, action bar, latest step, step log,
  narration panel, debug panel, floating dungeon map.

Product guardrails for UI work, from `docs/01_PRODUCT_DIRECTION.md`:

1. Do not invent a final art direction.
2. Do improve readability now.
3. Do not expose `dm:` or internal source data in the player view.
4. Do not design as if the project ends at the entrance corridor.
5. Do not expose a complete dungeon map or room index unless explicitly approved.
   B1 depends on incomplete player knowledge, so an omniscient map is not neutral.
6. Do not rewrite module-driven text into new canonical narrative to fill a screen.

## Deployment

Not deployed. No host, no provider config, no CI.

If it ships, it is a static build: `npm run build` produces `dist/`, servable from
any static host. No server runtime, no environment variables, no database, no
workers, no health check path.

> TODO: whether deployment is in scope at all, and where. The B1 rights question
> under Monetization comes first. No build-plan item covers deployment readiness.

> **Item 19 breaks the static-build assumption.** An AI narrator needs a secret API
> key, so it needs a server-side proxy or serverless function, which means a host
> that runs code, environment variables, and a spend limit. "Static build, any
> static host" holds only until item 19 is real.

## Working agreement

Three contributors, recorded in `build-plan.md`:

| Contributor | Owns |
|---|---|
| Todd + ChatGPT | `src/game/*` - engine and B1 content |
| Claude Code | `src/components/`, `src/pages/`, `src/hooks/`, `src/utils/`, `src/map/`, CSS, tooling |

- Every build-plan item carries an owner. One owner per item.
- **Hot files**, one contributor at a time: `src/game/rooms.js` and
  `src/pages/TestPage.jsx`. `src/game/worldState.js` is a third watch item.
- Everyone branches from `working-branch` and lands through a pull request into it.
- `current-feature.md` has one slot and tracks Claude's lane only, so `/status`
  does not see work done outside the Blueprint loop.

## Open questions

Product decisions that are open in `docs/03_OPEN_QUESTIONS.md` and must not be
settled by implementation:

- **Final visual direction** - blocks item 16.
- **Turn, light, rest, and resource model** - how turns advance per action. Blocks
  item 14 and the `durationTurns` gap above.
- **Dungeon stocking policy** - fixed, random, seeded, or selectable. Materially
  different UI consequences.
- **Rules-edition baseline** - which Basic D&D source is authoritative where B1 is
  silent and editions differ.
- **Character and party model** - one PC, PC plus retainers, or several. Avoid
  layouts that only work for exactly one permanent character.
- **Player mapping model** - automap, explored-only, breadcrumb, or none.
- **DM/developer inspector** - whether it exists in production and how it toggles.

New with item 19, and unresolved:

- **Which model provider, and where the key lives.** Contradicts "no backend" in
  section 5 and "static build, no env vars" in section 8. See the TODOs there.
- **What the narration context projection contains.** See the Data model section.
  This is the first real step of item 19.
- **How much conversational input is supported**, and what happens when player
  intent cannot be safely mapped to a legal engine action.
- **Whether the AI may ever author prose B1 does not specify.** The governing
  fidelity rule says the module is the authority, and an LLM narrating "naturally"
  is exactly the mechanism by which invented canonical prose creeps in. Item 19
  needs an explicit answer, and `docs/03_OPEN_QUESTIONS.md` already has a "final
  prose adaptation policy" question this belongs under.

Gaps and plan-shape notes from this generation:

- **Item 12 is nested under item 11 in `build-plan.md`.** It reads as a sub-step of
  the test runner, which it is not, and the On hold section still says "the next
  unchecked item is the first one under Next, not item 12." One of the two is
  stale. Left as found; see the report from this run.
- **Item 19 has two owners** ("ChatGPT / Todd + Claude UI"), which the working
  agreement's one-owner-per-item rule does not allow. It probably wants splitting
  into an engine item and a UI item.
- **Item 16 is oversized.** "Player-facing UI" bundles an entire presentation
  layer. `/feature 16` will need to split it, and it cannot start until the visual
  direction is decided.
- **Items 11 and 17 are tooling, not user-visible outcomes.** Intentional, and the
  Blueprint sanctions a test-runner item, but they will not produce a demoable
  change.
- **No persistence feature** exists despite the save/resume TODO in the plan.
- **No deployment-readiness item** exists, and item 19 now makes one necessary.
- **Item 14 is unassigned** and blocked twice: on item 13 and on the turn model.
