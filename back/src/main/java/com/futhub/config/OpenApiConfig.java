package com.futhub.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de SpringDoc (OpenAPI/Swagger).
 * Define la información principal que se muestra en la UI de Swagger.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Futhub API")
                        .version("v1.0")
                        .description("API REST para la gestión de partidos, canchas, equipos y usuarios de Futhub.")
                );
    }
}