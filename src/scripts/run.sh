#!/bin/sh

DIR=`dirname "$0"`
ORIGINAL_DIR=`pwd`

echo "Checking project ..."
cd $DIR
cd ..
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

echo "Checking server ..."
COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
if [ $COUNT_PROCESS -gt 0 ]; then
	echo "INFO: This project is already running ... "
	echo "Processes: $COUNT_PROCESS"
	cd "$ORIGINAL_DIR"
	exit 0
else
	echo "Starting up ... "
	npm start &
fi

COUNT_PROCESS=0
while [ $COUNT_PROCESS -eq 0 ]
do
	echo "Waiting on server to start ..."
	sleep 0.25
	COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
done

echo "INFO: Server started"
echo " ---> http://localhost:8888"

cd "$ORIGINAL_DIR"