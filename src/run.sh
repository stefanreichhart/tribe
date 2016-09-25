#!/bin/sh

echo "Checking node.js ..."
VERSION_NPM=`npm --version 2> /dev/null`
if [ -z "$VERSION_NPM" ]; then 
	echo "Please install node.js first"
	echo " ---> https://nodejs.org/en/download/)"
	exit 1
else
	npm install	
fi


echo "Checking bower ..."
VERSION_BOWER=`bower --version 2> /dev/null`
if [ -z "$VERSION_BOWER" ]; then 
	echo "Please install bower first"
	echo " ---> sudo npm install -g bower"
	exit 1
else
	bower install
fi

COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
if [ $COUNT_PROCESS -gt 0 ]; then
	echo "This project is already running ... "
	echo "Processes: $COUNT_PROCESS"
	exit 0
else
	echo "Starting up ... "
	npm start
fi


