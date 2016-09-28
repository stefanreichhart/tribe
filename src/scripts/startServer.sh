#!/bin/sh

DIR=`dirname "$0"`
ORIGINAL_DIR=`pwd`
cd $DIR
cd ..
ROOT_DIR=`pwd`

echo "Starting web-server ..."
COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
if [ $COUNT_PROCESS -gt 0 ]; then
	echo "This web-server is already running ... "
	echo "Processes: $COUNT_PROCESS"
else
	npm start > $ROOT_DIR/log 2>&1 &
	COUNT_PROCESS=0
	while [ $COUNT_PROCESS -eq 0 ]
	do
		echo "Waiting on web-server to start ..."
		sleep 1
		COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
	done
fi

echo "This web-server is ready"
echo "  => http://localhost:8888"

cd "$ORIGINAL_DIR"