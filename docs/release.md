# Release

## Automated release flow

```powershell
1. Update `package.json` version.
2. Commit the release changes.
3. Push a git tag like `v1.7.2`.
```

The `Release` GitHub Actions workflow then:

- builds platform prebuilds on Windows, Linux, and macOS
- builds `dist/` once in the package job
- merges all `prebuilds/` artifacts into one package workspace
- verifies the packaged workspace can load the native binding and be packed
- publishes to GitHub Packages first
- publishes to npmjs second
- skips npmjs publish automatically when `NPM_TOKEN` is not configured

Configure the repository secret `NPM_TOKEN` before first release.

## Manual fallback

```powershell
pnpm install --ignore-scripts
node ./scripts/build.mjs
node ./scripts/prebuild.mjs
npm pack --ignore-scripts
```

For GitHub Packages, publish from a workspace whose package name has been rewritten to `@mukea-org/uiohook-napi`, matching the CI workflow's `npm pkg set` step.
For prerelease versions such as `2.0.0-alpha4`, publish with a non-`latest` dist-tag such as `--tag alpha`.

## CI expectations

- Build prebuilt binaries for supported platforms and architectures.
- Verify the package workspace can load the native binding.
- Verify the package can be packed with `dist/` and `prebuilds/`.

## Before publishing

- Ensure the repository secret `NPM_TOKEN` is configured if npmjs publish should run.
- Ensure GitHub Actions has permission to write packages.
- Confirm `UPSTREAM.md` reflects the current vendored `uiohook` base.
- Review the diff under `uiohook/`.
- Verify `README.md` and `docs/development.md` match the supported toolchain.

## Package names by registry

- npmjs keeps the public package name: `@mukea/uiohook-napi`
- GitHub Packages is published as: `@mukea-org/uiohook-napi`

This split exists because GitHub Packages uses the GitHub owner namespace.

Do not use `github:mukea-org/uiohook-napi#<tag>` as a consumer install path. Git URL installs fetch the repository snapshot, not the published package tarball.
