@echo off
setlocal EnableDelayedExpansion

if "%UIOHOOK_NODE_EXE%"=="" (
  echo UIOHOOK_NODE_EXE is not set.
  exit /b 1
)

if "%UIOHOOK_VCVARS64%"=="" (
  echo UIOHOOK_VCVARS64 is not set.
  exit /b 1
)

if "%UIOHOOK_CMAKE_BIN%"=="" (
  echo UIOHOOK_CMAKE_BIN is not set.
  exit /b 1
)

if "%UIOHOOK_NINJA_DIR%"=="" (
  echo UIOHOOK_NINJA_DIR is not set.
  exit /b 1
)

call "%UIOHOOK_VCVARS64%" >nul
if errorlevel 1 exit /b 1

set "PATH=%UIOHOOK_CMAKE_BIN%;%UIOHOOK_NINJA_DIR%;!PATH!"
"%UIOHOOK_NODE_EXE%" "%~dp0..\node_modules\cmake-js\bin\cmake-js" %*
