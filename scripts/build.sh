#!/bin/bash

set -e

rm -rf dist
npm run tsc-check
npm run before-build

DIST_DIR="dist"
MAX_JOBS=4
JOBS=()

# Parallel loop with job control
for file in $(find examples -name 'example.html'); do
  (
    out_dir="$DIST_DIR/$(dirname "$file")"
    mkdir -p "$out_dir"
    parcel build "$file" --no-scope-hoist --dist-dir "$out_dir" --public-url ./
  ) &

  JOBS+=($!)
  if [ "${#JOBS[@]}" -ge "$MAX_JOBS" ]; then
    wait -n  # Wait for any job to finish
    # Remove finished jobs
    JOBS=($(jobs -rp))
  fi
done

# Wait for remaining jobs
wait

parcel build index.html --public-url ./
npm run after-build
