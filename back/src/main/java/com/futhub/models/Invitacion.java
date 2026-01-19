package com.futhub.models;


public class Invitacion {
    private String id;
    private String equipoId;
    private String equipoNombre; // Guardamos el nombre para mostrarlo rápido en el front
    private String usuarioIdDestino; // A quién invitamos
    private String usuarioEmailDestino; // Por si acaso

    public Invitacion() {}

    public Invitacion(String id, String equipoId, String equipoNombre, String usuarioIdDestino, String usuarioEmailDestino) {
        this.id = id;
        this.equipoId = equipoId;
        this.equipoNombre = equipoNombre;
        this.usuarioIdDestino = usuarioIdDestino;
        this.usuarioEmailDestino = usuarioEmailDestino;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEquipoId() { return equipoId; }
    public void setEquipoId(String equipoId) { this.equipoId = equipoId; }
    public String getEquipoNombre() { return equipoNombre; }
    public void setEquipoNombre(String equipoNombre) { this.equipoNombre = equipoNombre; }
    public String getUsuarioIdDestino() { return usuarioIdDestino; }
    public void setUsuarioIdDestino(String usuarioIdDestino) { this.usuarioIdDestino = usuarioIdDestino; }
    public String getUsuarioEmailDestino() { return usuarioEmailDestino; }
    public void setUsuarioEmailDestino(String usuarioEmailDestino) { this.usuarioEmailDestino = usuarioEmailDestino; }
}
