#!/bin/bash

BUILD_DIR='./build';
if [ ! -d "$BUILD_DIR" ]; then
  mkdir "$BUILD_DIR";
fi

FILENAME="$BUILD_DIR/build.zip";
echo "Committing changes..."
git add --all && git commit -m "$1";

echo "Building zip package...";
git archive -v --format=zip HEAD -o $FILENAME;

echo "File created at $FILENAME";

