package com.futhub.dto.equipo;

// DTO "simple" para la pestaña "Buscar Equipos"
public class EquipoDTO {
    private String id;
    private String nombre;
    private int miembros; // Solo el conteo
    private boolean isOwner = false;

    // Constructor
    public EquipoDTO(String id, String nombre, int miembros) {
        this.id = id;
        this.nombre = nombre;
        this.miembros = miembros;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public int getMiembros() { return miembros; }
    public void setMiembros(int miembros) { this.miembros = miembros; }
    public boolean getIsOwner() { return isOwner; }
    public void setIsOwner(boolean isOwner) { this.isOwner = isOwner; }
}