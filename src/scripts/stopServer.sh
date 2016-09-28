#!/bin/sh

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

echo "This web-server is stopped"

exit 0