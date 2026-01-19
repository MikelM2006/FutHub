package com.futhub.dto.usuario;

import com.futhub.models.Usuario;

/**
 * DTO para RESPUESTAS (GET).
 * Representa un usuario público, sin campos sensibles como la contraseña.
 */
@SuppressWarnings("unused")
public class UsuarioDTO {

    private String id;
    private String nombreCompleto;
    private String email;
    private Integer edad;
    private Usuario.Posicion posicion;
    private Double autoclasificacion;
    private Usuario.Rol rol;
    private String id_cedula; // campo para la cédula

    // Getters y Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Usuario.Rol getRol() {
        return rol;
    }

    public void setRol(Usuario.Rol rol) {
        this.rol = rol;
    }

    public String getId_cedula() {
        return id_cedula;
    }

    public void setId_cedula(String id_cedula) {
        this.id_cedula = id_cedula;
    }
}