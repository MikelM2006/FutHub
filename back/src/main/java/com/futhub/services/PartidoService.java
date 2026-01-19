package com.futhub.services;

import com.futhub.data.JsonDataStore;
import com.futhub.dto.partido.CreatePartidoRequest;
import com.futhub.models.Partido;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;


@Service
public class PartidoService {
    private final JsonDataStore jsonDataStore;

    @Autowired
    public PartidoService(JsonDataStore jsonDataStore) {
        this.jsonDataStore = jsonDataStore;
    }

    public Partido CrearPartido(CreatePartidoRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Request de partido nulo");
        }

        if (request.getFecha() == null) {
            throw new IllegalArgumentException("Fecha inválida o no proporcionada para el partido.");
        }

        List<Partido> partidosActuales;
        try {
            partidosActuales = jsonDataStore.getPartidos();
        } catch (IOException e) {
            throw new RuntimeException("Error al obtener los partidos actuales del archivo JSON", e);
        }

        LocalDateTime fechaPartido = request.getFecha();
        LocalDate fechaRequest = fechaPartido.toLocalDate();

        for (Partido p : partidosActuales) {
            LocalDateTime fechaExistente = p.getFecha();
            boolean mismaCancha = Objects.equals(p.getId_cancha(), request.getId_cancha());

            LocalDate diaexistente = fechaExistente.toLocalDate();
            boolean mismoDia = diaexistente.isEqual(fechaRequest);

            if (fechaRequest.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("No se pueden crear partidos en fechas pasadas.");
            }

            if (mismaCancha && mismoDia) {
                throw new IllegalArgumentException("La cancha ya esta reservada en la fecha seleccionada.");
            }
        }


        // Si la cancha esta disponible, crea el partido
        Partido nuevoPartido = new Partido();
        nuevoPartido.setId(UUID.randomUUID().toString());
        nuevoPartido.setFecha(request.getFecha());
        nuevoPartido.setId_cancha(request.getId_cancha());
        nuevoPartido.setId_creador(request.getId_creador());
        nuevoPartido.setId_equipo_1(request.getId_equipo_1());
        nuevoPartido.setId_equipo_2(request.getId_equipo_2());

        partidosActuales.add(nuevoPartido);

        try {
            jsonDataStore.savePartidos(partidosActuales);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el nuevo partido en el archivo JSON", e);
        }

        return nuevoPartido;
    }

    public List<Partido> getTodosLosPartidos() {
        try {
            return jsonDataStore.getPartidos();
        } catch (IOException e) {
            throw new IllegalStateException("Error al acceder al archivo json: " + e.getMessage(), e);
        }
    }

    public Partido unirseAPartido(String partidoId, String idEquipo) {
        try {
            List<Partido> partidos = jsonDataStore.getPartidos();
            Partido encontrado = null;
            for (Partido p : partidos) {
                if (Objects.equals(p.getId(), partidoId)) {
                    encontrado = p;
                    break;
                }
            }
            if (encontrado == null) {
                throw new IllegalArgumentException("Partido no encontrado.");
            }
            if (encontrado.getId_equipo_2() != null && !encontrado.getId_equipo_2().isEmpty()) {
                throw new IllegalArgumentException("El partido ya tiene un segundo equipo inscrito.");
            }

            encontrado.setId_equipo_2(idEquipo);

            jsonDataStore.savePartidos(partidos);
            return encontrado;
        } catch (IOException e) {
            throw new RuntimeException("Error al acceder/guardar partidos en el archivo JSON", e);
        }
    }

    public void eliminarPartido(String partidoId) {
        try {
            List<Partido> partidos = jsonDataStore.getPartidos();
            boolean eliminado = partidos.removeIf(p -> Objects.equals(p.getId(), partidoId));
            if (!eliminado) {
                throw new IllegalArgumentException("Partido no encontrado.");
            }
            jsonDataStore.savePartidos(partidos);
        } catch (IOException e) {
            throw new RuntimeException("Error al acceder/guardar partidos en el archivo JSON", e);
        }
    }
}
