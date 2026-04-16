#!/bin/bash

set -e

npm dedupe
rm -rf dist
npm run tsc-check
npm run before-build

# Collect all example entry points plus the main index
ENTRIES=$(find examples -name 'example.html')

# Build all entries in a single Parcel invocation so shared packages
# (e.g. @shapediver/viewer, three) are bundled only once into shared chunks.
# --public-url / is required because Parcel places all JS chunks at the dist
# root; example HTMLs in subdirectories need absolute paths to reach them.
# MSYS_NO_PATHCONV=1 prevents Git Bash from converting '/' to a Windows path.
# DEPLOY_ENV controls the subdirectory: 'staging' (default) or 'prod'.
# PUBLIC_URL can also be set directly to override (e.g. PUBLIC_URL=/ for local builds).
DEPLOY_ENV=${DEPLOY_ENV:-staging}
if [ "$DEPLOY_ENV" = "prod" ]; then
  PUBLIC_URL=${PUBLIC_URL:-/v3/examples/}
else
  PUBLIC_URL=${PUBLIC_URL:-/v3/examples-staging/}
fi
MSYS_NO_PATHCONV=1 parcel build $ENTRIES index.html --no-scope-hoist --dist-dir dist --public-url $PUBLIC_URL

npm run after-build
