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
    registry.addMapping("/**") 
            .allowedOrigins(
                "https://fut-m2ovgiw64-mikelmunozlandi-1112s-projects.vercel.app", // Tu URL actual de Vercel
                "http://localhost:5173" // Para que te siga funcionando en local (Vite)
            ) 
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") 
            .allowedHeaders("*") 
            .exposedHeaders("Authorization") 
            .allowCredentials(true); 
}
}
