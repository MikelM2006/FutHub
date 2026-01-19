package com.futhub.dto.equipo;

import com.futhub.dto.usuario.UsuarioDTO;
import java.util.List;

public class EquipoDetalleDTO {
    private String id;
    private String nombre;
    private boolean isOwner;
    private List<UsuarioDTO> miembros;

    public EquipoDetalleDTO(String id, String nombre, boolean isOwner, List<UsuarioDTO> miembros) {
        this.id = id;
        this.nombre = nombre;
        this.isOwner = isOwner;
        this.miembros = miembros;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public boolean getIsOwner() { return isOwner; }
    public void setIsOwner(boolean isOwner) { this.isOwner = isOwner; }
    public List<UsuarioDTO> getMiembros() { return miembros; }
    public void setMiembros(List<UsuarioDTO> miembros) { this.miembros = miembros; }
}
