# Coding Standards

> Rewritten by `/adopt` to describe what this codebase actually does, not a
> template's defaults. When a convention changes in the code, change it here too.

## Ownership

`src/game/*` is the **game engine, and Todd owns it**. It is under active
development on his side.

- The AI works on the presentation layer: `src/components/`, `src/pages/`,
  `src/hooks/`, `src/utils/`, CSS.
- Ask before editing anything under `src/game/`, including `rooms.js` content.
- When a UI need seems to require an engine change, say so and propose the change
  rather than making it.

`docs/` is the source of truth for product intent and is also Todd's. Read it,
cite it, do not rewrite it.

## Language

- **JavaScript with JSX.** No TypeScript today; a migration is build-plan item 17.
  Do not introduce `.ts`/`.tsx` files or type annotations before then.
- ES modules throughout, with named exports for engine functions and a default
  export per component.
- Double quotes and semicolons in project code. A few untouched Vite template
  files still use single quotes; match the file you are editing.

## React

- Functional components only, declared as `export default function Name({ props })`
  with props destructured in the signature.
- Hooks for state and effects. State lives in the page component
  (`src/pages/TestPage.jsx`) and flows down as props with `onSomething` callbacks
  back up. There is no context, reducer, or state library, and adding one is a
  discussion, not a drive-by.
- Extract reusable stateful logic into `src/hooks/` (see `useVoices.js`).
- Components stay presentational. Rules resolution belongs in the engine, not in a
  component.

## Game engine conventions

These describe the existing engine so UI code can consume it correctly. They are
not permission to edit it.

- Engine modules are **pure functions with no React import**. They take state and
  return a result; they do not hold state.
- Results are plain objects, shaped for the caller to both apply and display:
  `{ success, room, message }` from `move()`, `{ messages, triggeredEvents }` from
  `resolveEvents()`.
- World state is updated by **returning new arrays**, never by mutating the
  passed-in state.
- Anything that identifies a specific thing in world state uses a **composite
  string key** built by a helper, never an ad-hoc template literal at the call
  site: `getLockKey(roomId, featureId, lockId)` produces `roomId:featureId:lockId`.
  `locks.js` and `traps.js` hold these builders.
- Eligibility questions are their own predicates (`isLocked`, `isOpen`,
  `canPickLock`) so the UI can decide what to offer without re-deriving rules.

## Content data

- B1 content lives in `src/game/rooms.js` and `src/game/events.js` as data, kept
  separate from the mechanics that read it.
- Every room, feature, and event carries a `dm:` block with module metadata and a
  `sourceArea` citation back to the B1 key.
- **`dm:` data is never rendered in the player-facing UI.** It is authoring,
  verification, and debugging material. `DebugPanel` is the deliberate exception.
- Do not invent player-facing prose for content B1 already specifies. See
  `docs/00_README.md`.

## File Organization

- Components: `src/components/ComponentName.jsx` (flat, not feature-foldered)
- Pages: `src/pages/PageName.jsx`, with a matching `PageName.css` when it needs one
- Game engine: `src/game/[module].js`
- Hooks: `src/hooks/useThing.js`
- Utilities: `src/utils/[utility].js`
- Map data: `src/map/`
- Static assets served at a URL: `public/`

## Naming

- Components: PascalCase, file matches component name (`RoomPanel.jsx`)
- Engine and utility modules: camelCase (`eventResolver.js`)
- Functions: camelCase; handlers `handleX` in the page, props `onX`
- Factories: `createX` (`createWorldState`, `createPlayer`)
- Predicates: `isX` / `canX` / `hasX`
- Constants: SCREAMING_SNAKE_CASE (`GAME_STATES`, `LABEL_SEPARATOR`)
- Ids in data: camelCase strings (`woodenDoor`, `magicMouthWarning`)

## Styling

- **Plain CSS files**, imported by the component tree. No CSS-in-JS, no Tailwind,
  no UI component library.
- `src/index.css` holds the reset and the design tokens as CSS custom properties
  on `:root`. `src/pages/TestPage.css` holds the app styles.
- **Use the tokens.** The final art direction is undecided, so the tokens exist
  specifically to make choosing one a token swap rather than a rewrite. Do not
  hardcode a color or radius that a token already covers.
- `className` strings, kebab-case (`room-description`, `finding-label`).
- No inline styles except computed geometry that cannot live in a stylesheet, such
  as map pin coordinates and drag position.
- Light UI today. There is no dark mode and no theme toggle; do not add one as a
  side effect of other work.

## Error Handling

- Engine functions return failure as data (`{ success: false, message }`), not by
  throwing. `rollFormula` throwing on a malformed dice formula is the exception,
  because that is an authoring bug, not a game outcome.
- Browser APIs that may be missing are feature-detected and degrade quietly. See
  the `speechSynthesis` guards in `src/narrator.js`.
- There is no toast system, no error boundary, and no logging service.

## Testing

**No test runner is configured, so there is no test gate.** `AGENTS.md` declares no
`test` command, and per the switch below that means the loop verifies logic with
the evidence it already has: running the app, a screenshot, the build.

Adding Vitest is **build-plan item 11**, and it is a deliberate step of its own.
Run `/tests` for it. Never install a runner mid-step in unrelated work.

**The opt-in switch is one signal: a `test` command in the Commands section of
`AGENTS.md`.** Declare one and tests become a gate for logic-bearing steps; leave
it out and they are not.

Once the runner exists:

- **What to test:** pure logic where a wrong answer is possible. In this codebase
  that is `src/utils/parseGameText.js`, and on the engine side `dice.js`,
  `locks.js`, `movement.js`, and `eventResolver.js`, which are pure functions with
  real edge cases (empty input, malformed formula, missing exit, recurring event).
- **What not to test:** components, the map panel, and speech synthesis. Verify
  those in the browser.
- **The gate:** a step that adds in-scope logic ships a passing test in the same
  diff, green before approval, before any checkpoint commit, and before
  `/complete` merges. UI-only steps are exempt.
- An empty suite should fail, not pass, so "no tests ran" never reads as "passed".
- Test files sit next to their source (`parseGameText.test.js`).

## Browser Verification

Playwright is not installed. Do not add it silently in the middle of unrelated
work; add it only if asked or if a spec is explicitly about browser automation.

Until then, verify UI work with `npm run dev`, a screenshot, the browser console,
and `npm run build`. This app is entirely client-side and interaction-driven, so
running it is the real evidence.

## Code Quality

- No commented-out code unless specified. `TestPage.jsx` currently keeps two
  commented `createPlayer()` lines as a test-harness character toggle; that is a
  known exception in the temporary harness, not a pattern to copy.
- No unused imports or variables. `npm run lint` enforces this.
- Keep functions under 50 lines when possible. `TestPage.jsx` is the harness and
  is already long; prefer extracting a component over adding to it.

## Comments

Write code that explains itself; comment only what the code cannot say.
Over-commenting is a common AI tell, so resist it. The existing comments in this
codebase are a good model: they explain why a decision was made, and several cite
`docs/` for product reasoning.

- Comment the **why**, not the **what**. Delete any comment that restates the code.
- No banner/header blocks, section dividers, or step-by-step narration of obvious
  code.
- A comment earns its place only when it captures something the code cannot: a
  non-obvious decision, a gotcha or workaround, why a value is what it is, or a
  link to a spec, doc, or issue.
- Prefer self-documenting names and small functions over explanatory comments.
- Keep doc comments minimal: a one-line purpose on an exported function is plenty.
- When in doubt, leave the comment out.

## Writing

- No em dashes (U+2014) in generated content: docs, comments, commit messages,
  READMEs, specs. They read as AI-generated. Note that the existing `docs/` and
  some game content use them; leave that text alone rather than rewriting it.
- Use a hyphen for `term - description` separators; rephrase prose with commas,
  parentheses, or a colon. Avoid en dashes and the ellipsis character too.
