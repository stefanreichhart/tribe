#!/bin/sh

DIR=`dirname "$0"`
ORIGINAL_DIR=`pwd`

cd $DIR
cd ..
ROOT_DIR=`pwd`

echo "Stopping web-server ..."
COUNT_PROCESS=1
while [ $COUNT_PROCESS -gt 0 ]
do
	COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
	if [ $COUNT_PROCESS -gt 0 ]; then
		PID_PROCESS=`ps -Aef | grep node | grep server.js | awk '{print $2}'`
		if [ ! -z "$PID_PROCESS" ]; then
			echo "Killing web server PID=$PID_PROCESS"
			kill "$PID_PROCESS" 
		fi
	fi
	echo "Waiting on web-server to stop ..."
	sleep 1
done

echo "Stopping database instance ..."
COUNT_PROCESS=1
while [ $COUNT_PROCESS -gt 0 ]
do
	COUNT_PROCESS=`ps -Aef | grep mongod | grep dbpath | grep -c "$ROOT_DIR/data"`
	if [ $COUNT_PROCESS -gt 0 ]; then
		PID_PROCESS=`ps -Aef | grep mongod | grep dbpath | grep "$ROOT_DIR/data" | awk '{print $2}'`
		if [ ! -z "$PID_PROCESS" ]; then
			echo "Killing database instance PID=$PID_PROCESS"
			kill "$PID_PROCESS" 
		fi
	fi
	echo "Waiting on database instance to stop ..."
	sleep 1
done

echo "INFO: web-server and database instance stopped"

cd "$ORIGINAL_DIR"