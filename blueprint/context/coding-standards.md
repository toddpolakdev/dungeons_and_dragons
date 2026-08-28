# Coding Standards

> Rewritten by `/adopt` to describe what this codebase actually does, not a
> template's defaults. When a convention changes in the code, change it here too.

## Ownership

`src/game/*` is the **game engine, owned by Todd and ChatGPT**. It is under active
development in that lane.

- Todd and ChatGPT work on the game engine, including `src/game/rooms.js`.
- Claude Code works on the presentation layer: `src/components/`, `src/pages/`,
  `src/hooks/`, `src/utils/`, `src/map/`, and CSS.
- Claude Code asks before editing anything under `src/game/`.
- When presentation work appears to require an engine change, Claude Code should
  describe the required change rather than making it.

`docs/` is the source of truth for product intent. Read it and cite it; do not
rewrite product decisions through implementation.

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

**Vitest is configured and the test gate is on.** `AGENTS.md` declares
`npm run test:run`, and per the switch below that makes a passing test part of any
logic-bearing step.

Run `npm run test:run` for a single pass, or `npm test` to watch. Never use bare
`npm test` in an automated context; it watches and will not exit.

**The switch is one signal: a `test` command in the Commands section of
`AGENTS.md`.** It is declared, so tests are a gate. Removing that line would turn
the gate back off.

- **What to test:** pure logic where a wrong answer is possible. In this codebase
  that is `src/utils/parseGameText.js`, and on the engine side `dice.js`,
  `locks.js`, `movement.js`, and `eventResolver.js`, which are pure functions with
  real edge cases (empty input, malformed formula, missing exit, recurring event).
- **What not to test:** components, the map panel, and speech synthesis. Verify
  those in the browser.
- **The gate:** a step that adds in-scope logic ships a passing test in the same
  diff, green before approval, before any checkpoint commit, and before
  `/complete` merges. UI-only steps are exempt.
- **Not retroactive.** The gate applies to logic added from here on. Existing
  untested code is not a blocker, though a test alongside a change to it is welcome.
- An empty suite fails rather than passes, so "no tests ran" never reads as
  "passed". Vitest exits 1 when it finds no test files; keep it that way.
- Test files sit next to their source (`parseGameText.test.js`).
- Import `describe` / `it` / `expect` from `vitest` explicitly. Globals are off, so
  `eslint.config.js` needs no test-specific configuration.

**Engine tests are Todd and ChatGPT's call.** Tests live next to their source, so
testing `src/game/*` means adding files inside their lane. The four engine modules
above are worth covering, but Claude asks before adding a test file there, the same
as for any other engine change.

## Browser Verification

Running the app is the real evidence. This app is entirely client-side and
interaction-driven, so `npm run dev`, the browser console, and `npm run build`
remain the baseline for verifying UI work.

**A Playwright MCP server is configured** for this project in Claude Code, with
Chromium installed locally, and it **works**. It has driven the test page through
a multi-move route and captured screenshots that proved a map bug and then its
fix. Browser automation counts as real evidence for a UI done-when.

Practical notes:

- MCP servers connect at **session start**. If the tools are missing, that is a
  connection failure to report, not a missing capability, and it needs a session
  restart rather than a workaround. The first connection attempt on a cold `npx`
  download can exceed the timeout; the package is cached now.
- **The floating map panel overlays the action buttons** at small viewports and
  swallows clicks. Resize to roughly 1920x1200, or hide the map while walking a
  route and show it again to screenshot. Page state survives hiding it.
- Save screenshots into `.playwright-mcp/`, which is git-ignored. A stray image
  in the project root shows up in `git status` and should not be committed.
- Driving a long route one click at a time is slow and burns turns. Prefer a
  single scripted run for the movement, then a screenshot at the end.

**Playwright is still not a project dependency, and should not become one.** The
MCP server is Claude Code configuration and touches nothing in `package.json`. Do
not add the npm package in the middle of unrelated work; add it only if asked, or
if a spec is explicitly about browser automation.

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
