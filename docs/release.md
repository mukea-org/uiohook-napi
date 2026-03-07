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
- publishes to npm using `NPM_TOKEN`

Configure the repository secret `NPM_TOKEN` before first release.

## Manual dispatch

The `Release` workflow also supports `workflow_dispatch` with:

- `npm_tag`: npm dist-tag, default `latest`
- `dry_run`: run `npm publish --dry-run` without publishing

Use this to test the publish path before pushing a release tag.

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
- Confirm `UPSTREAM.md` reflects the current vendored `libuiohook` base.
- Review the diff under `libuiohook/`.
- Verify `README.md` and `docs/development.md` match the supported toolchain.
