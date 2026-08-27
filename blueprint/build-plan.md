# Build Plan

> One of the two planning docs you provide. Write it directly, develop it through
> any AI conversation, or optionally run `/discovery`. Keep the items high-level
> even when `project-plan.md` is detailed; later `/feature` specs hold the depth
> for each build item.

> Seeded by `/adopt`. Items 1 to 10 are already shipped and were reconstructed
> from the git history and the code, so the checked list reflects reality rather
> than Blueprint-managed work. None of them has an archived spec under
> `blueprint/history/`, because they predate adoption.

Run `/feature` with no number to spec the **next unchecked item under Next**,
skipping the On hold section, or `/feature 16` / `/feature "router"` to pick a
specific one. Completed
features get checked off here, so the build plan doubles as your progress tracker.
A big item gets split into sub-items (12a, 12b, etc.) when you spec it.

## Working agreement

Three contributors work on this project: **Todd**, **ChatGPT** (engine), and
**Claude Code** (presentation layer and tooling). Every item below carries an
owner in parentheses. One owner per item, and the owner is the only one who edits
that item's files while it is in progress.

`src/game/*` is the game engine. Todd and ChatGPT own it. Claude works in
`src/components/`, `src/pages/`, `src/hooks/`, `src/utils/`, `src/map/`, and CSS,
and asks before touching engine files. See the Ownership section of
`blueprint/context/coding-standards.md`.

### Hot files

Two files absorb most changes and are where collisions will happen. Do not have
two contributors in either one at the same time; say which you are taking first.

- `src/game/rooms.js` - all B1 content
- `src/pages/TestPage.jsx` - the action loop and nearly all handlers

`src/game/worldState.js` is a third watch item: it is small, but its shape is a
contract every other module reads, so changing it affects everyone.

### What this file tracks, and what it does not

`blueprint/context/current-feature.md` has **one slot** and holds only the item
being built through the Blueprint loop, which in practice means Claude's current
item. Work Todd or ChatGPT does outside that loop is real but is not represented
there, so `/status` describes Claude's lane only. Check off completed items here
by hand when they land outside the loop.

### Branching

Everyone branches from `working-branch` and lands through a pull request into it.
Keep pull requests small so conflicts in the hot files surface early. See the
Branching section of `blueprint/context/ai-interaction.md`.

### Known gap worth an owner

Conditions roll a duration in turns (`durationTurns` in `TestPage.jsx`) and store
it on active effects, but nothing ever decrements it, because the project has no
turn or time model. Effects therefore last forever. This is shipped behavior, not
a missing feature, and it is the same clock that item 14 needs.

## Continuing after the initial build

This is a living roadmap, not a plan that freezes when the first release is done.
Keep completed items checked, then append new unchecked features as the project
grows.

Do not renumber completed features because their archived specs refer back to
those numbers. Continue with the next unused number. If a new feature materially
changes the product direction, users, data, stack, monetization, UI/UX, or
deployment, update the relevant part of `project-plan.md` too. Then re-run
`/overview` before spec'ing the feature.

If `/feature "some new thing"` does not match an existing item, it will propose
the new build-plan line and any necessary project-plan changes, wait for approval,
refresh the overview, and then write the feature spec.

## Shipped before adoption

- [x] 1. **Game engine foundation** - dice and formula rolling, characters,
     attack resolution, game states
- [x] 2. **Room model and movement** - rooms with descriptions, examine text,
     exits, and features; directional movement between them
- [x] 3. **B1 entrance through the intersection** - entrance, three pairs of
     alcoves, the recurring Magic Mouth event, the intersection and its five bodies
- [x] 4. **Persistent world state** - examined, searched, triggered, discovered,
     and collected outcomes that change how a room presents on a revisit
- [x] 5. **Readable findings presentation** - one action returning several
     observations renders as discrete blocks rather than one dense paragraph
- [x] 6. **Kitchen interactions** - B1 kitchen features, searches, and discoveries
- [x] 7. **Test UI componentization** - the harness split into components and
     moved onto its own page
- [x] 8. **Dining room and lounge interactions** - B1 room features, nested
     interactions, and discoveries for both rooms
- [x] 9. **Wizard chamber, locks and traps** - locked container, thief
     lock-picking gated on class, tools, skill and a single attempt, trap keys
- [x] 10. **Narration and developer map panel** - Web Speech API read-aloud, plus
      a floating panel pinning rooms onto the module map scans

## Next

- [x] 11. **Unit test runner** (Claude) - add Vitest, wire the scripts, one
      example test, and turn on the test gate. Run `/tests`. Touches no hot file, and
      it gives all three contributors a net before parallel engine work.
- [ ] 12. **B1 upper level, continued** (ChatGPT / Todd) - keep working outward
      from the wizard chamber through the remaining keyed rooms. Areas 1 to 5 are
      done; this is area 6 onward. Room data is **engine**; each new room also needs
      a map pin in `src/map/roomCoords.js`, which is Claude's.
- [ ] 15. **Router** (Claude) - routing so a player-facing page can live beside
      the test page rather than replacing it.
- [ ] 16. **Player-facing UI** (Claude) - the real presentation layer. Blocked on
      choosing an art direction; `docs/03_OPEN_QUESTIONS.md` leaves that open, and it
      is a product decision, not a styling one.
- [ ] 17. **TypeScript migration** (unassigned) - convert the codebase to
      TypeScript. Touches every file, so it needs the other two lanes quiet.

## On hold

Deferred by Todd, not cancelled and not deprioritized on merit. These are the
**engine**-heavy items, and Todd and ChatGPT own the engine.

`/feature` should skip this section and take the first unchecked item under Next.
Move an item back up to Next when it is ready to be worked, keeping its number.

- [ ] 13. **Combat integration** (ChatGPT / Todd) - make the `COMBAT` state
      actually reachable from B1 encounters instead of a manual toggle, and hand
      control back to exploration when the encounter ends. **engine**, with a UI
      surface for the encounter.
- [ ] 14. **Wandering monsters** (unassigned) - B1's upper-level check cadence and
      table, plus the turn and time model it depends on. **engine**. Blocked twice
      over: it hands into item 13, and "how turns advance for each action" is still
      open in `docs/03_OPEN_QUESTIONS.md`. Claude can take an isolated slice (the
      table as data, a pure check function, both in new files) once the turn model is
      decided. UI implication: unsolicited results can arrive because time passed,
      not only because the player clicked.
- [ ] 18. **B1 lower level** (ChatGPT / Todd) - the second half of Quasqueton.
      **engine** for the room data.

- [ ] 19. **Backend and persistence foundation** (Todd / ChatGPT) - introduce
      the server/API boundary, environment-variable configuration, database
      integration, and persistence model needed for authored content, saved game
      state, and later AI integration. Exact backend and database technologies are
      still to be selected.

- [ ] 20. **AI Dungeon Master / narrator** (ChatGPT / Todd + Claude UI) -
      introduce an AI-mediated narration and interaction layer over the deterministic
      game engine. The engine remains authoritative for B1 content, rules, state, and
      legal actions. Initial scope should define a safe structured context/result
      boundary before adding conversational input or generated narration. Depends on
      a sufficiently stable exploration engine and player-facing UI.

> TODO (confirm): the order of 11, 15, and 17 is inferred. Item 16 keeps the
> priority you gave it; the runner, router, and TypeScript items were slotted
> around it.

> TODO (confirm): several open design questions gate this roadmap and are not
> features themselves. Dungeon stocking policy, the rules-edition baseline, the
> character and party model, and the mapping model are all listed in
> `docs/03_OPEN_QUESTIONS.md`. Decide them there rather than settling them
> through implementation.
