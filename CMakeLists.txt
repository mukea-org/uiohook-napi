cmake_minimum_required(VERSION 3.15...3.31)

project(uiohook_napi C)

if(NOT CMAKE_JS_INC)
  message(FATAL_ERROR "This project is intended to be configured by cmake-js.")
endif()

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/build/Release)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/build/Release)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/build)

foreach(CONFIG Debug Release RelWithDebInfo MinSizeRel)
  string(TOUPPER ${CONFIG} CONFIG_UPPER)
  set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_${CONFIG_UPPER} ${CMAKE_SOURCE_DIR}/build/Release)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_${CONFIG_UPPER} ${CMAKE_SOURCE_DIR}/build/Release)
  set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY_${CONFIG_UPPER} ${CMAKE_SOURCE_DIR}/build)
endforeach()

set(UIOHOOK_SOURCES
  uiohook/src/logger.c
)

set(UIOHOOK_INCLUDE_DIRS
  ${CMAKE_SOURCE_DIR}/uiohook/include
  ${CMAKE_SOURCE_DIR}/uiohook/src
)

add_library(uiohook STATIC)
target_sources(uiohook PRIVATE ${UIOHOOK_SOURCES})
target_include_directories(uiohook PRIVATE ${UIOHOOK_INCLUDE_DIRS})

if(MSVC)
  target_compile_options(uiohook PRIVATE /W3)
else()
  target_compile_options(uiohook PRIVATE -Wall -Wextra -Wpedantic)
endif()

if(WIN32)
  target_sources(uiohook PRIVATE
    uiohook/src/windows/input_helper.c
    uiohook/src/windows/input_hook.c
    uiohook/src/windows/post_event.c
    uiohook/src/windows/system_properties.c
  )
  target_include_directories(uiohook PRIVATE ${CMAKE_SOURCE_DIR}/uiohook/src/windows)
  target_link_libraries(uiohook PRIVATE user32)
elseif(APPLE)
  target_sources(uiohook PRIVATE
    uiohook/src/darwin/input_helper.c
    uiohook/src/darwin/input_hook.c
    uiohook/src/darwin/post_event.c
    uiohook/src/darwin/system_properties.c
  )
  target_include_directories(uiohook PRIVATE ${CMAKE_SOURCE_DIR}/uiohook/src/darwin)
  target_compile_definitions(uiohook PRIVATE __MACOSX_CORE__ USE_IOKIT USE_APPLICATION_SERVICES USE_OBJC)
  target_link_libraries(uiohook PRIVATE
    "-framework IOKit"
    "-framework Carbon"
    "-framework ApplicationServices"
    "-framework AppKit"
    "-framework CoreFoundation"
  )
else()
  find_package(PkgConfig REQUIRED)
  find_package(Threads REQUIRED)

  pkg_check_modules(X11 REQUIRED x11)
  pkg_check_modules(X11_XCB REQUIRED x11-xcb)
  pkg_check_modules(XRANDR REQUIRED xrandr)
  pkg_check_modules(XTST REQUIRED xtst)
  pkg_check_modules(XT REQUIRED xt)
  pkg_check_modules(XCB REQUIRED xcb)
  pkg_check_modules(XCB_XKB REQUIRED xcb-xkb)
  pkg_check_modules(XKBCOMMON REQUIRED xkbcommon)
  pkg_check_modules(XKBCOMMON_X11 REQUIRED xkbcommon-x11)

  target_sources(uiohook PRIVATE
    uiohook/src/x11/input_helper.c
    uiohook/src/x11/input_hook.c
    uiohook/src/x11/post_event.c
    uiohook/src/x11/system_properties.c
  )
  target_include_directories(uiohook PRIVATE
    ${CMAKE_SOURCE_DIR}/uiohook/src/x11
    ${X11_INCLUDE_DIRS}
    ${X11_XCB_INCLUDE_DIRS}
    ${XRANDR_INCLUDE_DIRS}
    ${XTST_INCLUDE_DIRS}
    ${XT_INCLUDE_DIRS}
    ${XCB_INCLUDE_DIRS}
    ${XCB_XKB_INCLUDE_DIRS}
    ${XKBCOMMON_INCLUDE_DIRS}
    ${XKBCOMMON_X11_INCLUDE_DIRS}
  )
  target_compile_definitions(
    uiohook
    PRIVATE
      USE_XKB
      USE_XKBCOMMON
      USE_XKBFILE
      USE_XRANDR
      USE_EVDEV
      USE_XT
  )
  target_compile_options(uiohook PRIVATE -pthread)
  target_link_libraries(uiohook PRIVATE
    Threads::Threads
    ${X11_LIBRARIES}
    ${X11_XCB_LIBRARIES}
    ${XRANDR_LIBRARIES}
    ${XTST_LIBRARIES}
    ${XT_LIBRARIES}
    ${XCB_LIBRARIES}
    ${XCB_XKB_LIBRARIES}
    ${XKBCOMMON_LIBRARIES}
    ${XKBCOMMON_X11_LIBRARIES}
  )
endif()

add_library(${PROJECT_NAME} SHARED
  src/lib/addon.c
  src/lib/napi_helpers.c
  src/lib/uiohook_worker.c
  ${CMAKE_JS_SRC}
)

target_compile_definitions(${PROJECT_NAME} PRIVATE NAPI_VERSION=8)
target_include_directories(${PROJECT_NAME} PRIVATE
  ${CMAKE_JS_INC}
  ${CMAKE_SOURCE_DIR}/uiohook/include
  ${CMAKE_SOURCE_DIR}/src/lib
)
target_link_libraries(${PROJECT_NAME} PRIVATE uiohook ${CMAKE_JS_LIB})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

if(WIN32)
  target_link_libraries(${PROJECT_NAME} PRIVATE delayimp)
endif()

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  execute_process(
    COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS}
  )
endif()
