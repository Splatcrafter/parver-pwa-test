# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy POM files first for dependency caching
COPY pom.xml .
COPY frontend/pom.xml frontend/
COPY backend/pom.xml backend/

# Copy frontend package files for npm caching
COPY frontend/package.json frontend/package-lock.json frontend/

# Download dependencies
RUN mvn dependency:go-offline -B -pl backend || true

# Copy source code
COPY frontend/ frontend/
COPY backend/ backend/

# Build the project
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
