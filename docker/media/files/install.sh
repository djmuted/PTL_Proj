#!/bin/sh
sed -i "s|;externalAddress=10.20.30.40|externalAddress="`curl ipv4.icanhazip.com`"|g" /etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini