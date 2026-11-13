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

# Render provides a postgres:// URL; normalize it for the PostgreSQL JDBC driver.
ENTRYPOINT ["/bin/sh", "-c", "DATABASE_URL=${DATABASE_URL:?DATABASE_URL is required}; JAVA_DB_URL=$(printf '%s' \"$DATABASE_URL\" | sed -E 's|^postgres(ql)?://|jdbc:postgresql://|'); exec java -Dspring.datasource.url=\"$JAVA_DB_URL\" -jar app.jar"]