# Paso 1: Compilar la aplicación usando el JDK 25 de Temurin
FROM eclipse-temurin:25-jdk-jammy AS build
WORKDIR /app
COPY . .
# Le damos permisos al wrapper de Maven por si acaso
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Paso 2: Correr la aplicación con el JRE 25 (versión ligera)
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
