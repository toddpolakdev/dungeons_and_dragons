# Findings

> **Generated file.** The findings ledger: review findings raised by `/audit`
> against the work in progress, each with a durable ID, severity (P0-P3), and
> status. `/implement` marks repaired findings `fixed`, a later `/audit` pass
> moves them to `closed`, and `/complete` refuses to merge while any P0 or P1
> finding is `open` or `fixed`, then archives resolved findings with the work
> and resets this file.

## F-01 - Local Node major does not match CI, and is past end of life

- **Severity:** P3
- **Status:** open
- **Found:** recorded by hand at Todd's request while setting up CI, not raised by
  `/audit`. Noted here because P3 entries stay in the ledger rather than being
  archived, so it survives a context clear.
- **Where:** the developer machine, plus `.nvmrc`

**What.** CI runs Node 24, pinned in `.nvmrc`. Local development runs Node
25.1.0. Node 25 is an odd-numbered release and is already past end of life, so it
receives no further security or bug fixes.

Nothing is broken today: `npm run verify` passes on both, and CI has proven the
project lints, tests, and builds clean on 24. The risk is the ordinary one of a
version split, that something passes locally and fails in CI or the reverse, plus
running an unsupported runtime day to day.

**Fix.** Install Node 24 and switch to it in this project, so local matches the
pinned version and CI:

```
nvm install 24
nvm use          # reads .nvmrc
node --version   # expect v24.x
npm ci           # rebuild node_modules against the new major
npm run verify   # confirm still green
```

`nvm use` is per-shell. `nvm alias default 24` makes it the default for new
shells. If nvm is not installed on this machine, the equivalent is installing
Node 24 LTS directly and confirming `node --version`.

**Not urgent, but do not leave it indefinitely.** The end-of-life part is the
half that gets worse with time.

**Why it is P3.** No user-visible defect, no failing check, and a documented
workaround exists in that CI is already authoritative. It blocks nothing, and P3
entries never block `/complete`.
