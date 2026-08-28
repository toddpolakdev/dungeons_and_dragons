# Fix: Map trail draws discovery order, not the walked path

**Type:** Fix
**Status:** built, awaiting /complete

## Problem

The dev map's trail connects rooms in the order they were **first discovered**,
not the order they were **walked**. Backtracking is invisible, so the polyline
draws a straight line between two rooms the player never travelled between
directly.

Reproduced in the browser. Route: north x4 to the intersection, east to the
dining room, west back to the intersection, west to the kitchen. The trail cuts
straight from the east pin to the west pin, skipping the intersection it passed
through. Screenshot: `map-trail-bug.png` (untracked, not committed).

Cause, in two places:

- `TestPage.jsx` appends to `visitedRoomIds` only when the room is new, so it is
  a deduplicated set, correct for pins but wrong for a path.
- `DungeonMap.jsx` builds `trail` from that set and renders it as a single
  `<polyline>`, treating discovery order as travel order.

Second, latent bug in the same code: the `.filter()` for level and missing
coordinates runs after the `.map()`, so a dropped room silently bridges the gap
with a false straight line. Invisible today because every room has coordinates on
one level; it surfaces the moment the lower level is reachable, or when a room
lands before its pin.

Coordinates are not at fault. Every pin is placed correctly.

## Scope

- `src/utils/mapTrail.js` - new. Pure segment-building logic.
- `src/utils/mapTrail.test.js` - new. Its tests.
- `src/pages/TestPage.jsx` - track the walked path alongside the visited set.
- `src/components/DungeonMap.jsx` - render segments from the path.
- `.gitignore` - Playwright screenshot artifacts.

Out of scope:

- `visitedRoomIds` stays exactly as it is. A deduplicated set is the right shape
  for pins, and other code reads it.
- No engine change. `src/game/*` is untouched.
- No change to pin placement, coordinates, or the calibration picker.
- The player-facing mapping model stays open. This is the dev inspection tool
  only, and `docs/03_OPEN_QUESTIONS.md` still owns that decision.

## Decision recorded

The trail shows the **raw walked path**, including repeated corridor segments.
This is a development inspection tool, so honesty beats tidiness: collapsing
back-and-forth movement would hide the very thing the trail exists to show. Todd
approved proceeding on this basis.

## Build steps

- [x] **Step 1 - Pure trail segmentation** - add `buildTrailSegments(pathRoomIds,
  coords, activeLevel)` to `src/utils/mapTrail.js`, returning an array of
  segments, each an array of `{ x, y }`. A room that is missing coordinates or
  sits on another level **ends** the current segment rather than being skipped
  over. Ship tests in the same diff. *Done when:* `npm run test:run` passes with
  new tests covering an empty path, a single room, a straight run, a room with no
  coordinates splitting one segment into two, a room on another level doing the
  same, and a revisited room appearing twice in one segment.

- [x] **Step 2 - Track and render the walked path** - add `pathRoomIds` state to
  `TestPage.jsx`, appending on every successful move including revisits, reset
  with New Game, and pass it to `DungeonMap`. `DungeonMap` renders one polyline
  per segment from `buildTrailSegments`. *Done when:* walking the repro route
  draws the trail back through the intersection instead of cutting across, proven
  by a Playwright screenshot.

- [x] **Step 3 - Ignore Playwright artifacts** - add the screenshot output and
  `.playwright-mcp/` to `.gitignore`, and remove the stray `map-trail-bug.png`
  from the working tree. *Done when:* `git status` is clean after a Playwright
  run.

## Testing

The test gate is on, and step 1 adds real branching logic, so it ships tests in
the same diff. `src/utils/` is Claude's lane, so no permission question arises.

Step 2 is UI wiring and rides on browser evidence: a before-and-after screenshot
of the same route. Step 3 is verified by `git status`.

`npm run build` and `npm run test:run` are the fallback gate; this project
declares no Verify command.

## Notes for the AI

- Branch `fix/map-trail-path` off `working-branch`, land through a pull request.
- `src/pages/TestPage.jsx` is a hot file. Keep the diff minimal and confined to
  the path state, the move handler, the reset, and the new prop.
- Keep `buildTrailSegments` pure and free of React, so it stays testable.
- Double quotes, semicolons, no em dashes.
- The dev server is already running on port 5174 for browser verification.
