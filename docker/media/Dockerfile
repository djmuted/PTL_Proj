FROM kurento/kurento-media-server:latest
COPY files/install.sh /opt/install.sh
RUN chmod +x /opt/install.sh && \
    /opt/install.sh
ENTRYPOINT ["/entrypoint.sh"]