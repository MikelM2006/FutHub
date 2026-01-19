package com.futhub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración Web Global.
 * Se usa aquí para configurar CORS (Cross-Origin Resource Sharing).
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**") // Permite CORS para todos tus endpoints bajo /api/
                .allowedOrigins("http://localhost:5173")

                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Métodos HTTP permitidos
                .allowedHeaders("*") // Permite todas las cabeceras
                .allowCredentials(true);
    }
}