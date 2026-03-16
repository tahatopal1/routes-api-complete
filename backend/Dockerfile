FROM maven:3.9.6-eclipse-temurin-21
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B


COPY src ./src
RUN mvn clean package -DskipTests

EXPOSE 9011

VOLUME ["/src/main/resources/feedbacks"]

CMD ["java", "-jar", "target/project-0.0.1-SNAPSHOT.jar"]

