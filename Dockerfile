FROM openjdk:11

COPY target/database-transfer-tool-0.0.1-SNAPSHOT.jar /usr/lee/dbt.jar
WORKDIR /usr/lee

CMD ["java","-jar","dbt.jar"]

EXPOSE 9090

# healthcheck
HEALTHCHECK --start-period=10s --interval=10s --timeout=10s --retries=10 \
CMD curl -f 'http://localhost:9090' || exit 1
