# Velclaw documentation

This static documentation site is driven by [`data.json`](./data.json). Its purpose is to publish only facts that can be traced to the application repository, [`Velclaw/Velclaw`](https://github.com/Velclaw/Velclaw).

## Source verification

On 2026-08-31, the documentation environment could not access or clone the source repository. Consequently, this site deliberately does **not** publish unverified values for:

- Node.js version or package manager;
- install, development, type-check, build, and test scripts;
- local environment variables and configuration;
- `app/`, `components/`, `lib/`, `server/`, or `drizzle/` structure;
- routes, modules, released capabilities, CI workflow, or the current release.

All product capabilities are labelled **Planned / unverified** until the source tree and release metadata are inspected. `data.json` records the check date, verification state, `sourceVersion`, and `sourceCommit` so a later documentation update has an auditable starting point.

## Updating the documentation after source access is restored

1. Inspect the source repository's `package.json`, lockfile, README, `.github/workflows/`, and current release/tag.
2. Inspect `app/`, `components/`, `lib/`, `server/`, and `drizzle/`; list only routes and modules present in the source tree.
3. Replace the unverified values in `data.json` with the exact Node.js/package-manager requirements, scripts, environment variables, confirmed capabilities, and release version.
4. Set `sourceCommit` to the inspected commit SHA (or set an exact `sourceVersion` for a tagged release), then update `sourceVerification` with the check date and successful status.

## License

This documentation repository is licensed under the [MIT License](./LICENSE).
