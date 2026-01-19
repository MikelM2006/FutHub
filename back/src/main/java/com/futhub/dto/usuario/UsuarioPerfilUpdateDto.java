package com.futhub.dto.usuario;

/**
 * DTO para actualizar campos del perfil: clave y posicion.
 * Se acepta `posicion` como String para permitir flexibilidad en el front (ej. "DEFENSA" o "Defensa").
 */
public class UsuarioPerfilUpdateDto {

    private String clave; // nueva contraseña (opcional)
    private String posicion; // nueva posicion (opcional) - será parseada en el servicio

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getPosicion() {
        return posicion;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }
}
