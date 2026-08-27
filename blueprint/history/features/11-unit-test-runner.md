# Feature: Unit test runner

**From build-plan:** feature 11
**Status:** built, awaiting /complete

## Goal

Add Vitest, wire the scripts, ship one real test, and turn the test gate on.

Three contributors are about to work in parallel across an engine and a UI layer
with no automated safety net. This feature is the net. It is deliberately small
and touches no hot file, so it can land before item 12 gets going.

The gate itself is the deliverable: per `coding-standards.md`, declaring a `test`
command in `AGENTS.md` is the single signal that turns tests into a requirement
for logic-bearing steps. Today that line says there is no test command.

## In scope

- Vitest as a devDependency, with whatever config the project actually needs
- `test` (watch) and `test:run` (single pass) npm scripts
- One real test file: `src/utils/parseGameText.test.js`
- `AGENTS.md` Commands updated with the real test command
- The Testing section of `coding-standards.md` updated to say the runner exists

## Out of scope

- **Tests for anything under `src/game/`.** Test files sit next to their source,
  so an engine test means a new file inside Todd and ChatGPT's directory. The
  candidates named in `coding-standards.md` (`dice.js`, `locks.js`, `movement.js`,
  `eventResolver.js`) are all genuinely worth testing, but adding those files is
  their call, not this feature's. Raise it with them after this lands.
- Component tests, React Testing Library, and jsdom. `coding-standards.md`
  explicitly says components, the map panel, and speech synthesis get verified in
  the browser, not in unit tests.
- Coverage reporting, CI wiring, and git hooks. CI is `/ci`'s job.
- Backfilling tests for existing untested logic. The gate applies to new logic
  from here on, not retroactively.

## Build loop

Build one step at a time, never the whole feature at once.

1. Plan mode lays out the step before any code.
2. The AI implements just that step.
3. It shows the diff (not full files); you read it and understand it.
4. You approve, then choose whether to commit a checkpoint or roll straight on.
   Checkpoints are optional; `/complete` makes the real feature-level commit at the end.

Never accept a step you haven't read. If a diff is too big to review, the step was too big, so split it.

## Build steps

- [x] **Step 1 - Install Vitest and add the scripts** - add `vitest` as a
  devDependency and add `"test": "vitest"` and `"test:run": "vitest run"` to
  `package.json`. Confirm Vitest picks up the existing `vite.config.js` without a
  separate config file; add a `test` block there only if it turns out to be
  required. *Done when:* `npm run test:run` executes, and with no test files
  present it **exits non-zero**, so an empty suite reads as a failure rather than
  a pass (`coding-standards.md` requires this). Also confirm the installed Vitest
  version actually supports Vite 8; if it does not, stop and report rather than
  downgrading Vite.

- [x] **Step 2 - Test `parseGameText`** - write `src/utils/parseGameText.test.js`
  covering the real edge cases in that function: `null` and `undefined` input,
  empty string, a plain paragraph, multi-line prose joining into one paragraph,
  a bullet list, blank lines between bullets keeping one list open (the room data
  relies on this), prose after a list closing that list, and a trailing list
  flushing at the end. Import `describe` / `it` / `expect` explicitly from
  `vitest` rather than enabling globals, so `eslint.config.js` needs no change.
  *Done when:* `npm run test:run` passes, the suite reports more than zero tests,
  and `npm run lint` is clean.

- [x] **Step 3 - Turn the gate on** - in `AGENTS.md`, replace the "No test
  command" paragraph with the real command, using `npm run test:run` as the
  declared one since bare `npm test` watches and would hang an agent. Update the
  Testing section of `coding-standards.md` so it says the runner exists and the
  gate is on, keeping the existing what-to-test and what-not-to-test guidance.
  *Done when:* `AGENTS.md` Commands lists a test command, `coding-standards.md` no
  longer says "no test runner is configured", and `npm run build` plus
  `npm run test:run` both pass.

## Files / areas

- `package.json` - devDependency and two scripts
- `src/utils/parseGameText.test.js` - new, the only test file this feature adds
- `AGENTS.md` - Commands section
- `blueprint/context/coding-standards.md` - Testing section
- `vite.config.js` - only if Vitest needs an explicit `test` block

## Data / contracts

No data shapes change. The one contract this feature locks is the **declared test
command**, which `coding-standards.md` treats as the on/off switch for the test
gate and which `/implement` and `/complete` read from `AGENTS.md`. Once it is
declared, every later logic-bearing step must ship a passing test in the same
diff.

The function under test returns blocks of either `{ type: "paragraph", text }` or
`{ type: "list", items }`. `GameText.jsx` renders against that shape, so the tests
pin it down.

## Testing

This feature is the testing setup, so the test is the deliverable rather than
supporting evidence.

- **In-scope logic needing a test:** `parseGameText` (step 2). It is a pure
  function with real branching and is in Claude's lane.
- **Evidence per step:** step 1 is proven by the non-zero exit on an empty suite,
  step 2 by a passing run plus clean lint, step 3 by build and tests both passing.
- **No browser verification needed.** This feature changes no UI. Playwright stays
  uninstalled.
- There is no Verify command in this project, so `npm run build` plus
  `npm run test:run` are the fallback gate.

## Notes for the AI

- **Do not touch `src/game/`.** Not the source, and not by adding test files
  beside it. See Out of scope.
- **Branch from `working-branch`**, name it `feature/unit-test-runner`, and land
  it through a pull request into `working-branch`. Do not merge locally and do not
  push to `main`. Ask before opening the PR.
- Match the file you are editing: double quotes and semicolons in `src/`.
- Test files sit next to their source, named `<source>.test.js`.
- No em dashes in anything generated here, including the spec updates and the
  commit message.
- Installing a dependency is a real change to `package.json` and
  `package-lock.json`. Show both in the step 1 diff.
- If Vitest and Vite 8 turn out to be incompatible, stop and report. Do not
  downgrade Vite, and do not reach for a different runner without asking.
