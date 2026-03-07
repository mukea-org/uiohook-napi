param(
  [string]$Ref = "master",
  [string]$RepoUrl = "https://github.com/kwhat/libuiohook.git"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$vendorDir = Join-Path $root "libuiohook"
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("libuiohook-sync-" + [System.Guid]::NewGuid().ToString("N"))

Write-Host "Cloning $RepoUrl@$Ref into $tempDir"
git clone --depth 1 --branch $Ref $RepoUrl $tempDir | Out-Host

if (Test-Path $vendorDir) {
  Write-Host "Removing existing vendored source at $vendorDir"
  Remove-Item $vendorDir -Recurse -Force
}

New-Item -ItemType Directory -Path $vendorDir | Out-Null

Write-Host "Copying upstream files into $vendorDir"
robocopy $tempDir $vendorDir /E /XD .git | Out-Host
if ($LASTEXITCODE -gt 7) {
  throw "robocopy failed with exit code $LASTEXITCODE"
}

Remove-Item $tempDir -Recurse -Force

Write-Host "Vendored libuiohook updated. Review the diff and update UPSTREAM.md before committing."
