#!/bin/sh
cd /opt/PTL_Proj/signal
nginx -g 'pid /tmp/nginx.pid;'
PORT=5000 REDIS_IP="ptl-db" KURENTO_WS="ws://ptl-media:8888/kurento" npm start
