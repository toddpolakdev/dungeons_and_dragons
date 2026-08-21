# B1 Digital Adventure — Developer Documentation

**Status snapshot:** 2026-08-20

These notes capture product decisions, project intent, and current implementation status that are **not safe to infer from the source code alone**.

They are written for a developer joining the project, especially someone working on the UI.

## Read these first

1. [`01_PRODUCT_DIRECTION.md`](./01_PRODUCT_DIRECTION.md) — target experience, scope, audience, and UI guardrails.
2. [`02_GAMEPLAY_STATUS.md`](./02_GAMEPLAY_STATUS.md) — mechanics that are settled, mechanics still in flux, and systems intentionally not wired yet.
3. [`03_OPEN_QUESTIONS.md`](./03_OPEN_QUESTIONS.md) — decisions that have **not** been made and should not be guessed at.

## Governing principle

The project is a digital adaptation of **D&D Module B1, _In Search of the Unknown_**. Content fidelity to B1 is a core requirement.

When the module already specifies a room feature, event, object, clue, or behavior, use the module as the authority. Do not improve gaps by quietly inventing new canonical prose or mechanics. If the digital format requires a decision that B1 does not make for us, record that as a product/design decision rather than disguising it as source fidelity.

This documentation intentionally does **not** describe the codebase structure. The code is the source of truth for implementation details; these files are the source of truth for product intent.
