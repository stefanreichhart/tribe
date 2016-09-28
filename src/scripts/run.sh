#!/bin/sh

DIR=`dirname "$0"`
ORIGINAL_DIR=`pwd`

echo "Checking project ..."
cd $DIR
cd ..
ROOT_DIR=`pwd`
if [ ! -e "bower.json" -o ! -e "package.json" ]; then
	echo "ERROR: Invalid project"
	cd "$ORIGINAL_DIR"
	exit 1
fi

echo "Checking node.js ..."
VERSION_NPM=`npm --version 2> /dev/null`
if [ -z "$VERSION_NPM" ]; then 
	echo "ERROR: Please install node.js first"
	echo " ---> https://nodejs.org/en/download/)"
	cd "$ORIGINAL_DIR"
	exit 1
else
	npm install	
fi


echo "Checking bower ..."
VERSION_BOWER=`bower --version 2> /dev/null`
if [ -z "$VERSION_BOWER" ]; then 
	echo "ERROR: Please install bower first"
	echo " ---> sudo npm install -g bower"
	cd "$ORIGINAL_DIR"
	exit 1
else
	bower install
fi

echo "Checking database ..."
VERSION_DB=`mongod --version 2> /dev/null`
if [ -z "$VERSION_DB" ]; then
	echo "ERROR: Please install mongodb first"
	cd "$ORIGINAL_DIR"
	exit 1
fi

./scripts/startDatabase.sh
./scripts/startServer.sh

cd "$ORIGINAL_DIR"