#!/bin/sh
apk add --no-cache git nginx
cd /opt
git clone https://github.com/djmuted/PTL_Proj
cd PTL_Proj
cd signal
npm install
cd ..
cd client-logic
npm install
cd ..
cd client-frontend
npm install
npm run build
