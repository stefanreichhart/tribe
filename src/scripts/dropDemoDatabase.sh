#!/bin/sh

DIR=`dirname "$0"`
ORIGINAL_DIR=`pwd`

cd $DIR
cd ..
ROOT_DIR=`pwd`

$ROOT_DIR/scripts/stop.sh

if [ $? -ne 0 ]; then
	"ERROR: web-server and database still running"
	exit 1
fi

echo "Dropping Demo database ..."

# backup old files
mv "$ROOT_DIR/data/demo.json" "$ROOT_DIR/demo.json"

# remove all files
rm -rdf "$ROOT_DIR/data"

# restore old files
mkdir -p "$ROOT_DIR/data"
mv "$ROOT_DIR/demo.json" "$ROOT_DIR/data/demo.json"

echo "Demo database dropped"