# GitHub Packages Sample

This sample is for consuming the GitHub Packages variant of this project:

- npmjs package: `@mukea/uiohook-napi`
- GitHub Packages package: `@mukea-org/uiohook-napi`

## Live registry install

Create `.npmrc` from `.npmrc.example`, provide `NODE_AUTH_TOKEN`, then install:

```powershell
npm install @mukea-org/uiohook-napi@2.0.0-alpha3
npm test
```

## Local equivalent package test

This reproduces the GitHub Packages payload from the current workspace without requiring registry auth:

```powershell
cd ../..
node ./scripts/stage-github-package.mjs
cd ./build/github-package-2.0.0-alpha3
npm pack --ignore-scripts --json
cd ../../sample/github
npm install ../../build/github-package-2.0.0-alpha3/mukea-org-uiohook-napi-2.0.0-alpha3.tgz
npm test
```
