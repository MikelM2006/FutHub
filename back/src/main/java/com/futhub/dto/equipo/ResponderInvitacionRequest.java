package com.futhub.dto.equipo;

public class ResponderInvitacionRequest {
    private boolean aceptar; // true = unirse, false = rechazar

    public boolean isAceptar() { return aceptar; }
    public void setAceptar(boolean aceptar) { this.aceptar = aceptar; }
}