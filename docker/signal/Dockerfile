FROM node:current-alpine
COPY files/*.sh /opt/
COPY files/nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /opt/install.sh && \
    chmod +x /opt/run.sh && \
    /opt/install.sh

ENTRYPOINT ["/opt/run.sh"]
