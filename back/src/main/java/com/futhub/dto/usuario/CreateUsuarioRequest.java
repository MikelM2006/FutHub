package com.futhub.dto.usuario;

import com.futhub.models.Usuario;

/**
 * DTO para PETICIONES (POST).
 * Contiene los campos necesarios para registrar un nuevo usuario.
 */
public class CreateUsuarioRequest {

    private String nombreCompleto;
    private String email;
    private String clave;
    private String id_cedula;
    private Integer edad;
    private Usuario.Posicion posicion;
    private Double autoclasificacion;

    // Getters y Setters

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

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getId_cedula() {
        return id_cedula;
    }

    public void setId_cedula(String id_cedula) {
        this.id_cedula = id_cedula;
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
}