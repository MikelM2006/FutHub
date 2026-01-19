package com.futhub.models;

import java.util.ArrayList;
import java.util.List;

public class Equipo {

    private String id;
    private String nombre;
    private String id_creador;
    private List<String> miembrosIds = new ArrayList<>();

    public Equipo() {
    }
    //sonctructor puede estar vacio, ya se inicializó la lista arriba

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getId_creador() { return id_creador; }
    public void setId_creador(String id_creador) { this.id_creador = id_creador; }

    public List<String> getMiembrosIds() { return miembrosIds; }
    public void setMiembrosIds(List<String> miembrosIds) { this.miembrosIds = miembrosIds; }
}