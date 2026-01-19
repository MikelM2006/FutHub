package com.futhub.models;
import java.util.Objects;

public class Usuario {

    public enum Rol {
        USUARIO,
        ADMINISTRADOR
    }

    public enum Posicion {
        PORTERO,
        DEFENSA,
        MEDIO,
        DELANTERO
    }

    private String id;
    private String nombreCompleto;
    private String email;
    private String clave;
    private String id_cedula;
    private Integer edad;
    private Posicion posicion;
    private Double autoclasificacion;
    private Rol rol;

    public Usuario() {
    }

    // --- Getters y Setters ---

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

    public Posicion getPosicion() {
        return posicion;
    }

    public void setPosicion(Posicion posicion) {
        this.posicion = posicion;
    }

    public Double getAutoclasificacion() {
        return autoclasificacion;
    }

    public void setAutoclasificacion(Double autoclasificacion) {
        this.autoclasificacion = autoclasificacion;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}