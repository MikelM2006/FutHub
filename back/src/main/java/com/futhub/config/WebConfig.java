package com.futhub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración Web Global.
 * Configuración de CORS infalible para producción en Vercel y local.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica para absolutamente todos los endpoints del backend
                .allowedOriginPatterns("*") // Permite cualquier URL (incluyendo Vercel dinámico) de forma segura con credentials
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Agregamos OPTIONS que es vital para el preflight
                .allowedHeaders("*") // Permite todas las cabeceras
                .exposedHeaders("Authorization") // Por si usas tokens JWT en el futuro
                .allowCredentials(true); // Mantiene activo el uso de cookies/sesiones si lo necesitas
    }
}
