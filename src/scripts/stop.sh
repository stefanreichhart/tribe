#!/bin/sh

DIR=`dirname "$0"`
ORIGINAL_DIR=`pwd`
cd $DIR

./stopServer.sh
./stopDatabase.sh

cd "$ORIGINAL_DIR"