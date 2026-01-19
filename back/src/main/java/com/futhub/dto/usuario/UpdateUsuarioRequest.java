package com.futhub.dto.usuario;

import com.futhub.models.Usuario;

/**
 * DTO para PETICIONES (PUT).
 * Contiene los campos que se pueden actualizar de un usuario.
 * No se permite cambiar email, clave o rol por esta vía.
 */
public class UpdateUsuarioRequest {

    private String nombreCompleto;
    private Integer edad;
    private Usuario.Posicion posicion;
    private Double autoclasificacion;
    private String id_cedula;

    // Getters y Setters

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public Usuario.Posicion getPosicion() {
        return posicion;
    }

    public void setPosicion(Usuario.Posicion posicion) {
        this.posicion = posicion;
    }

    public Double getAutoclasificacion() {
        return autoclasificacion;
    }

    public void setAutoclasificacion(Double autoclasificacion) {
        this.autoclasificacion = autoclasificacion;
    }

    public String getId_cedula() {
        return id_cedula;
    }

    public void setId_cedula(String id_cedula) {
        this.id_cedula = id_cedula;
    }
}