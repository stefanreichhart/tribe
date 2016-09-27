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

echo "Checking database instance ..."
COUNT_PROCESS=`ps -Aef | grep mongod | grep dbpath | grep -c "$ROOT_DIR/data"`
if [ $COUNT_PROCESS -gt 0 ]; then
	echo "This database instance is already running ... "
	echo "Processes: $COUNT_PROCESS"
else
	echo "Starting up database ... "
	mongod --dbpath="$ROOT_DIR/data" --logRotate="rename"  --logpath="$ROOT_DIR/log" &
	COUNT_PROCESS=0
	while [ $COUNT_PROCESS -eq 0 ]
	do
		echo "Waiting on database instance to start ..."
		sleep 1
		COUNT_PROCESS=`ps -Aef | grep mongod | grep dbpath | grep -c "$ROOT_DIR/data"`
	done
fi

echo "Checking web-server ..."
COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
if [ $COUNT_PROCESS -gt 0 ]; then
	echo "This web-server is already running ... "
	echo "Processes: $COUNT_PROCESS"
else
	echo "Starting up web-server ... "
	npm start &
	COUNT_PROCESS=0
	while [ $COUNT_PROCESS -eq 0 ]
	do
		echo "Waiting on web-server to start ..."
		sleep 1
		COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
	done
fi

echo "Database instance and web-server are ready"
echo " ---> http://localhost:8888"

cd "$ORIGINAL_DIR"