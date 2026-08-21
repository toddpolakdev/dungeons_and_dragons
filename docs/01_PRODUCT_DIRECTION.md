# Product Direction

**Status:** Active project guidance  
**Status snapshot:** 2026-08-20

## 1. Target aesthetic and tone

### Final visual aesthetic: **not yet decided**

Do **not** assume that the final UI has been specified as any of the following:

- faux parchment / sepia / typewriter-heavy 1979 facsimile
- modern dark dungeon-crawler
- polished fantasy RPG HUD
- clean ebook-style reader
- terminal / parser-game interface

None of those has been adopted as the final visual direction yet.

### What *has* been decided

The current interface is a **temporary development and testing UI**, not the target presentation layer.

For the current phase, the interface should optimize for:

- readability;
- clear separation between the room description, available actions, results, and state changes;
- being able to see what happened on each individual step;
- low visual clutter;
- easy inspection while mechanics are still being implemented.

A concrete example already established in the project: when examining the five bodies at the entrance intersection, the results should be visually separated — bullets, distinct blocks, or equivalent — instead of being presented as one dense paragraph.

### Tone of the adventure content

The **content** should feel like B1 because it should be driven by B1.

The project previously contained invented connective prose such as a generic introductory line about the Caverns of Quasqueton. That direction was explicitly rejected. Existing implemented content from the Entrance → Alcoves → Magic Mouths → Intersection sequence was revisited so that the data would be **faithfully B1-driven rather than padded with newly invented narration**.

This does **not** mean the final CSS must imitate a 1979 printed booklet. It means the player-facing fiction and interactive details should come from the module rather than from modern flavor text added by the application.

### Practical UI rule

Until a final art direction is chosen:

> Prefer a clear, restrained reading-and-action interface over a strongly themed visual treatment.

A UI refactor should make the experience easier to read without locking the project into a final aesthetic prematurely.

### References / inspirations actually in play

The primary reference is the original module itself:

- Mike Carr, **D&D Module B1 — _In Search of the Unknown_**
- especially the keyed room descriptions, special events, object details, and module-specific procedures

The project also has Basic D&D rules references available, but no final decision has been documented that the **visual design** must imitate any particular Basic Set edition.

---

## 2. Scope

### Target scope: **the full B1 adventure, not an entrance-only vertical slice**

The currently implemented entrance sequence is incremental development, not the intended final boundary of the product.

The project is expected to expand beyond:

- the entrance;
- the three pairs of alcoves;
- the Magic Mouth event;
- the first intersection and bodies.

The long-term design therefore needs to tolerate the full Quasqueton exploration experience rather than assuming a short linear corridor demo.

### Consequences for UI work

Do not hard-code the UI around the assumption that there will only ever be a handful of rooms or a single branch.

However, **a player-facing full map, room index, or omniscient navigation browser has not been approved**.

B1 is built around exploration and incomplete player knowledge. A UI that exposes every room or the complete dungeon topology could destroy part of the intended play experience.

It is safe to design components that can scale to many locations. It is **not** safe to assume that all locations should be visible to the player at once.

### Content completeness

The goal is to continue bringing in B1's actual content, including systems and details that are easy to omit during a room-by-room implementation. Wandering monsters were explicitly called out as something that must not be forgotten.

---

## 3. Intended audience

### Primary audience: **a solo player**

This is being built as a text adventure that lets a player experience B1 directly. The application is effectively taking on responsibilities that the tabletop Dungeon Master would normally perform.

It is **not currently being designed as a DM dashboard for someone running B1 at a table**.

### `dm:` data and source-area citations

Room data contains `dm:` material and module/source-area references. Treat that information as **internal authoring / verification / rules-resolution data**, not normal player-facing content.

It may be useful for:

- development;
- source verification;
- debugging;
- future internal tooling;
- checking why a result occurred.

It should **not** automatically appear in the normal adventure UI, because it can expose hidden information, spoilers, unrevealed mechanics, or implementation notes.

A future explicit debug/developer inspector could surface it, but that is separate from the player experience.

### Spoiler boundary

The player should receive only information their character has legitimately obtained through:

- entering an area;
- observing it;
- examining/searching;
- triggering an event;
- interacting with an object;
- otherwise satisfying the relevant game condition.

Do not use the presence of data in a room object as a reason to display it.

---

## Product guardrails for UI work

1. **Do not invent final art direction.** The final visual style is open.
2. **Do improve readability now.** The temporary UI should be easy to test.
3. **Do not expose DM/internal source data in the normal player view.**
4. **Do not design as if the project ends at the entrance corridor.**
5. **Do not expose a complete dungeon map or room index unless that feature is explicitly approved.**
6. **Do not rewrite module-driven text into new canonical narrative just to make the screen feel fuller.**
