package com.futhub.dto.partido;

import java.time.LocalDateTime;

/**
 * DTO para PETICIONES (PUT).
 * Campos que se pueden modificar de un partido ya creado,
 * como reprogramar la fecha o cambiar la cancha.
 */
public class UpdatePartidoRequest {

    private LocalDateTime fecha;
    private String id_cancha;
    private String id_equipo_1; // Opcional
    private String id_equipo_2; // Opcional

    // Campos que NO se pueden cambiar:
    // - id (identificador)
    // - id_creador (el creador es permanente)

    // Getters y Setters

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getId_cancha() {
        return id_cancha;
    }

    public void setId_cancha(String id_cancha) {
        this.id_cancha = id_cancha;
    }

    public String getId_equipo_1() {
        return id_equipo_1;
    }

    public void setId_equipo_1(String id_equipo_1) {
        this.id_equipo_1 = id_equipo_1;
    }

    public String getId_equipo_2() {
        return id_equipo_2;
    }

    public void setId_equipo_2(String id_equipo_2) {
        this.id_equipo_2 = id_equipo_2;
    }
}