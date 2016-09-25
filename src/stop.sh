#!/bin/sh

COUNT_PROCESS=1
while [ $COUNT_PROCESS -gt 0 ]
do
	COUNT_PROCESS=`ps -Aef | grep node | grep -c server.js`
	if [ $COUNT_PROCESS -gt 0 ]; then
		PID_PROCESS=`ps -Aef | grep node | grep server.js | awk '{print $2}'`
		if [ ! -z "$PID_PROCESS" ]; then
			echo "Killing server PID=$PID_PROCESS"
			kill "$PID_PROCESS" 
		fi
	fi
	echo "Waiting on server to stop ..."
	sleep 0.25
done

echo "INFO: Server stopped"