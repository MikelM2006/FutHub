package com.futhub.dto.partido;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * DTO para RESPUESTAS (GET).
 * Muestra la información de un partido agendado.
 */
public class PartidoDTO {

    private String id;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fecha;
    private String id_creador;
    private String id_cancha;
    private String id_equipo_1;
    private String id_equipo_2;

    public PartidoDTO() {}

    // Getters y Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getId_creador() {
        return id_creador;
    }

    public void setId_creador(String id_creador) {
        this.id_creador = id_creador;
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