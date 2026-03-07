# Release

## Automated release flow

```powershell
1. Update `package.json` version.
2. Commit the release changes.
3. Push a git tag like `v1.7.2`.
```

The `Release` GitHub Actions workflow then:

- builds platform prebuilds on Windows, Linux, and macOS
- merges all `prebuilds/` artifacts into one package workspace
- verifies the package loads with `PREBUILDS_ONLY=1`
- runs `npm pack`
- publishes to GitHub Packages first
- publishes to npmjs second
- keeps the two publish jobs independent: npmjs publish still runs even if GitHub Packages publish fails

Configure the repository secret `NPM_TOKEN` before first release.

## Manual fallback

```powershell
pnpm install --ignore-scripts
pnpm build
node ./scripts/build-prebuild.mjs
node ./scripts/verify-prebuilds.mjs
npm pack
npm publish --access public
```

## CI expectations

- Build prebuilt binaries for supported platforms and architectures.
- Verify the packed tarball contains `dist/` and `prebuilds/`.
- Verify the package loads without running install-time native compilation.
- Verify the package can load with `PREBUILDS_ONLY=1`.

## Before publishing

- Ensure the repository secret `NPM_TOKEN` is configured.
- Ensure GitHub Actions has permission to write packages.
- Confirm `UPSTREAM.md` reflects the current vendored `uiohook` base.
- Review the diff under `uiohook/`.
- Verify `README.md` and `docs/development.md` match the supported toolchain.

## Package names by registry

- npmjs keeps the public package name: `@mukea/uiohook-napi`
- GitHub Packages is published as: `@mukea-org/uiohook-napi`

This split exists because GitHub Packages uses the GitHub owner namespace.
