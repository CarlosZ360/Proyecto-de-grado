FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM eclipse-temurin:17-jdk-alpine

#RUN mkdir -p /opt/arquitectura/logs
#VOLUME /opt/arquitectura/logs

VOLUME C:/logs/tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

#ENV SERVER_URI "http://localhost:8080"
#ENV SPRING_PROFILE "test"

ENV USERNAME_DB "postgres"
ENV PASSWORD_DB "test"
ENV URL_DB "jdbc:postgresql://172.21.160.1:5432/postgres"

ENTRYPOINT ["java","-cp","app:app/lib/*","com.example.PwnCrack.PwnCrackApplicationKt"]
