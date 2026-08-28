# Fix: Tooling docs out of date

**Type:** Fix
**Status:** built, awaiting /complete

## Problem

Two tools were added to the local environment today, and the Blueprint context
files still describe the world as it was before.

The stale claim that matters: `coding-standards.md` says "Playwright is not
installed" under Browser Verification, and tells agents to verify UI work with a
manual dev server and screenshots. A Playwright MCP server is now configured for
this project, with Chromium installed, so that instruction is wrong and an agent
following it would skip a capability it has.

The GitHub CLI is also installed and authenticated now, which is what let PR #2
be opened from the terminal. Nothing records that, so the next session has no way
to know whether opening a pull request is possible without asking.

Neither is a code bug. Both are context files telling agents something false,
which is its own kind of defect in a workflow that loads them every session.

## Scope

- `blueprint/context/coding-standards.md` - Browser Verification section
- `AGENTS.md` - a short note on local tooling under Commands

Out of scope:

- Adding Playwright to `package.json`. The MCP server is Claude Code
  configuration, not a project dependency. The existing rule against silently
  adding it as a dev dependency still stands.
- Writing any browser test. This fix documents the capability; it does not use it.
- The `nanoid` advisory and the `TestPage.jsx` lint errors. Both are real, both
  are separate.

## Accuracy constraint

Do not claim Playwright browser verification is working. As of this fix it is
**configured but unproven**: the MCP server failed to connect this session
(`CONNECT_TIMEOUT`, cold npx download, since warmed), and MCP servers only
connect at session start. The docs must say configured and pending verification,
not available. Tighten the wording after it has actually driven the app once.

## Build steps

- [x] **Step 1 - Correct both files** - rewrite the Browser Verification section
  of `coding-standards.md` to describe the MCP server, its prerequisites, and its
  unproven status, keeping the rule against adding Playwright to `package.json`.
  Add a short local-tooling note to `AGENTS.md` covering the GitHub CLI and the
  Playwright MCP server. *Done when:* neither file says Playwright is not
  installed, neither claims browser verification is proven working, and
  `npm run test:run` plus `npm run build` still pass.

## Testing

Documentation only, no logic, so the test gate does not apply. Evidence is the
diff plus a clean build and test run, confirming nothing was broken in passing.

## Notes for the AI

- Branch `fix/tooling-docs` off `working-branch`, land through a pull request.
- No em dashes.
- `coding-standards.md` was just modified by feature 11, which is merged. Base
  the edit on the current file, not on memory of the pre-merge version.
