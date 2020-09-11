#!/bin/sh
cd /opt/PTL_Proj/signal
nginx -g 'pid /tmp/nginx.pid;'
PORT=5000 REDIS_IP="ptl-db" KURENTO_WS="ws://"`route -n | grep 'UG[ \t]' | awk '{print $2}'`":8888/kurento" npm start
