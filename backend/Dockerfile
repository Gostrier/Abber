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

# Accept either Render-style DATABASE_URL or the app's DB_URL env vars.
ENTRYPOINT ["/bin/sh", "-c", "DB_SOURCE=${DB_URL:-${DATABASE_URL:-}}; if [ -n \"$DB_SOURCE\" ]; then JAVA_DB_URL=$(printf '%s' \"$DB_SOURCE\" | sed -E 's|^postgres(ql)?://|jdbc:postgresql://|'); else JAVA_DB_URL=jdbc:postgresql://localhost:5432/abber; fi; exec java -Dspring.datasource.url=\"$JAVA_DB_URL\" -jar app.jar"]