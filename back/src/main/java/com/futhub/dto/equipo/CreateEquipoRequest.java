package com.futhub.dto.equipo;

// Esto es lo que React envía al backend para crear un equipo
public class CreateEquipoRequest {
    private String nombre;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}