#!/bin/sh

DIR=`dirname "$0"`
ORIGINAL_DIR=`pwd`
cd $DIR
cd ..
ROOT_DIR=`pwd`

echo "Starting database instance ..."
COUNT_PROCESS=`ps -Aef | grep mongod | grep dbpath | grep -c "$ROOT_DIR/data"`
if [ $COUNT_PROCESS -gt 0 ]; then
	echo "This database instance is already running ... "
	echo "Processes: $COUNT_PROCESS"
else
	mongod --dbpath="$ROOT_DIR/data" --logpath="$ROOT_DIR/log" > $ROOT_DIR/log 2>&1 &
	COUNT_PROCESS=0
	while [ $COUNT_PROCESS -eq 0 ]
	do
		echo "Waiting on database instance to start ..."
		sleep 1
		COUNT_PROCESS=`ps -Aef | grep mongod | grep dbpath | grep -c "$ROOT_DIR/data"`
	done
fi

echo "This database instance is ready"
echo "  ==> http://localhost:27017"
echo ""
echo "-------------------------------------------------------------------------------"
echo "If you haven't initialized any database yet, you might want to use some demo data first:"
echo "  ==> node $ROOT_DIR/scripts/initDemoDatabase.js"

cd "$ORIGINAL_DIR"