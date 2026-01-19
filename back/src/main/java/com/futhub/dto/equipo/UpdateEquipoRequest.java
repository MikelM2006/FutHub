package com.futhub.dto.equipo;

import java.util.List;

/**
 * DTO para PETICIONES (PUT).
 * Contiene los campos que se pueden actualizar de un equipo.
 * Permite cambiar el nombre y/o reemplazar la lista de miembros.
 */
public class UpdateEquipoRequest {

    private String nombre;
    // Incluimos la lista de miembros para que la pueda actualizar con una sola petición PUT.
    private List<String> miembrosIds;


    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<String> getMiembrosIds() {
        return miembrosIds;
    }

    public void setMiembrosIds(List<String> miembrosIds) {
        this.miembrosIds = miembrosIds;
    }
}