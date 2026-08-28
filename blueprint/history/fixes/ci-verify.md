# Setup: Verify command and automatic GitHub checks

**Type:** Setup (`/ci`)
**Status:** complete

> `/ci` stands outside the feature loop and writes no spec to
> `current-feature.md`, so this archive was written at `/complete` time rather
> than being an archived spec. It exists so the history records why CI appeared.

## Why

Lint, tests, and build only ran when someone remembered to run them. Nothing
checked a pull request, so a change that broke the suite still presented a green
merge button. With three contributors working in two lanes, and `rooms.js` and
`TestPage.jsx` flagged as collision-prone, the gap that mattered was a merge that
resolves cleanly but breaks behavior. Git will merge that happily; only tests
catch it.

This was deliberately left until last: `npm run lint` failed on pre-existing
errors until the preceding fix cleared them, and `AGENTS.md` recorded that as the
reason not to define a gate yet.

## What was set up

- **`npm run verify`** in `package.json`: `lint && test:run && build`. One command
  answering "is this project OK", shared by local work and CI so the two cannot
  drift.
- **`.github/workflows/verify.yml`**: runs `npm run verify` on every pull request
  and on pushes to `main` and `working-branch`. Permissions limited to
  `contents: read`. Installs with `npm ci` so the lockfile is authoritative.
- **`AGENTS.md`**: declares the Verify command, which the Blueprint skills read,
  so `/implement` and `/complete` now use it as their gate automatically.

## Decisions

- **Lint is in the gate**, which the `/ci` skill excludes by default. Included
  because `AGENTS.md` had already recorded the intent to wrap lint in once the
  baseline was clean, and it now is. A project decision beat a generic default.
- **`working-branch` is checked on push**, not just the default branch. Every
  feature lands there first; without it a squash-merge into `working-branch`
  would go unchecked.
- **CI pins Node 24 while the developer runs Node 25.1.0.** No `.nvmrc` or
  `engines` field exists, so the LTS line was chosen over matching a local
  version that is already past end of life. Both build the project. Adding an
  `.nvmrc` would lock them together and is a reasonable follow-up.

## Not included

No typecheck, because the project is JavaScript. No coverage thresholds, browser
tests, security scans, dependency audits, version matrices, or local git hooks.
The workflow runs the checks that already exist and invents none.

## Evidence

`npm run verify` exit 0: lint clean, 23 tests passed, build succeeded.

## Follow-up

Branch protection, which decides whether a failing check actually blocks a merge,
is a repository setting rather than part of the workflow file. It can only be
configured after the workflow has run once and GitHub knows the check by name.
