# Fix: lint fails on two unused variables

**Type:** Fix
**Status:** in progress

## Problem

`npm run lint` exits 1 on two `no-unused-vars` errors in
`src/pages/TestPage.jsx`, so the project has no clean lint baseline and lint
cannot be folded into a Verify command.

```
5:3   error  'createPlayer' is defined but never used
58:9  error  'latestNarration' is assigned a value but never used
```

They are not the same kind of problem.

**`latestNarration` is dead.** Nothing reads it. `NarrationPanel` takes no props
and manages its own settings, and `latestStep` is used separately for
`<LatestStep>`. Leftover from the narration refactor.

**`createPlayer` is a working feature expressed badly.** It is referenced only
from two commented-out lines, the harness character toggle:

```js
// const [player, setPlayer] = useState(createPlayer());
const [player, setPlayer] = useState(createTestThief());
```

`coding-standards.md` currently sanctions this as "a known exception in the
temporary harness". Deleting the toggle would satisfy the linter by removing a
documented capability, which is the wrong trade. Making the toggle real code
keeps the capability, removes the commented-out code, and clears the error.

## Scope

- `src/pages/TestPage.jsx` - delete the dead variable, convert the toggle
- `blueprint/context/coding-standards.md` - drop the now-obsolete commented-code
  exception from Code Quality

Out of scope:

- No behavior change. The harness still starts as the test thief.
- No engine change. `src/game/characters.js` is untouched; this only changes how
  `TestPage` chooses between the factories it already imports.
- Not turning lint into a Verify command. That is `/ci`'s job, and a clean
  baseline is only the precondition.
- The `nanoid` advisory, which is unrelated and pre-existing.

## Build steps

- [ ] **Step 1 - Clear both errors** - delete the unused `latestNarration`, and
  replace the commented toggle with a `CHARACTERS` map plus an `ACTIVE_CHARACTER`
  constant so both factories are genuinely referenced and switching is a
  one-word edit. Update the Code Quality section of `coding-standards.md` to drop
  the exception it no longer needs. *Done when:* `npm run lint` exits 0 with no
  errors, `npm run test:run` and `npm run build` still pass, and the app still
  loads as the test thief with lock-picking available.

## Testing

No new logic, so the test gate adds nothing here: this deletes a dead binding and
changes how an existing value is selected. The existing 23 tests must stay green.

Evidence: `npm run lint` exiting 0 is the headline. Plus build and tests, and a
browser check that the player is still the thief, since the toggle change touches
character construction and a mistake there would silently swap the class.

## Notes for the AI

- Branch `fix/lint-unused-vars` off `working-branch`, land through a pull request.
- `src/pages/TestPage.jsx` is a hot file. Keep the diff to the two errors.
- Preserve the ability to play the fighter. That is the point of the toggle.
- Double quotes, semicolons, no em dashes.
