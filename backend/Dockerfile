# Stage 1: Build the application using Maven
FROM eclipse-temurin:25-jdk-jammy AS build
WORKDIR /app
COPY . .

RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081

# Safely replace postgresql:// or postgres:// with jdbc:postgresql:// for the JVM driver
ENTRYPOINT ["/bin/sh", "-c", "java -Dspring.datasource.url=$(echo $DATABASE_URL | sed 's|^postgres[ql]*://|jdbc:postgresql://|') -jar app.jar"]