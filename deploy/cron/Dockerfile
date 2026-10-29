FROM alpine:3.22

RUN apk add --no-cache curl

COPY crontab /etc/crontabs/root
COPY run-photo-retention.sh /usr/local/bin/run-photo-retention
RUN chmod 0755 /usr/local/bin/run-photo-retention

HEALTHCHECK --interval=1m --timeout=5s --retries=3 \
  CMD pgrep crond >/dev/null || exit 1

CMD ["crond", "-f", "-l", "2"]
