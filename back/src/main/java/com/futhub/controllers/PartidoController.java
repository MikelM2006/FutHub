package com.futhub.controllers;

import com.futhub.data.JsonDataStore;
import com.futhub.dto.partido.CreatePartidoRequest;
import com.futhub.dto.partido.PartidoDTO;
import com.futhub.dto.partido.UnirsePartidoRequest;
import com.futhub.models.Partido;
import com.futhub.services.PartidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/partidos")
public class PartidoController {

    private final PartidoService partidoService;

    @Autowired
    public PartidoController(PartidoService partidoService) {
        this.partidoService = partidoService;
    }

    // Post, para crear un nuevo partido
    @PostMapping
    public ResponseEntity<?> crearPartido(@RequestBody CreatePartidoRequest request, @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        if (userId != null && !userId.isEmpty()) {
            request.setId_creador(userId);
        }

        System.out.println("el post recibido es: " + request.getId_equipo_2());

        try {
            Partido partidoCreado = partidoService.CrearPartido(request);

            PartidoDTO partidoDTO = convertirAPartidoDTO(partidoCreado);

            return ResponseEntity.status(HttpStatus.CREATED).body(partidoDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear partido: " + e.getMessage());
        }
    }

    //Get, para obtener todos los partidos
    @GetMapping
    public ResponseEntity<?> getTodosLosPartidos() {
        try {
            List<Partido> partidos = partidoService.getTodosLosPartidos();

            List<PartidoDTO> partidosDTO = partidos.stream()
                    .map(this::convertirAPartidoDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(partidosDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado al obtener los partidos: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/unirse")
    public ResponseEntity<?> unirsePartido(@PathVariable("id") String partidoId,
                                           @RequestBody UnirsePartidoRequest request,
                                           @RequestHeader(value = "X-USER-ID", required = false) String userId) {
        if (request == null || request.getId_equipo_2() == null || request.getId_equipo_2().isEmpty()) {
            return ResponseEntity.badRequest().body("id_equipo_2 es requerido.");
        }

        try {
            Partido actualizado = partidoService.unirseAPartido(partidoId, request.getId_equipo_2());
            PartidoDTO dto = convertirAPartidoDTO(actualizado);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al unir equipo al partido: " + e.getMessage());
        }
    }

    //Metodo privado para convertir Partido a PartidoDTO, se coloca como metodo para mantener el codigo limpio y que se entienda bien
    private PartidoDTO convertirAPartidoDTO(Partido partido) {
        PartidoDTO dto = new PartidoDTO();
        dto.setId(partido.getId());
        dto.setFecha(partido.getFecha());
        dto.setId_creador(partido.getId_creador());
        dto.setId_cancha(partido.getId_cancha());
        dto.setId_equipo_1(partido.getId_equipo_1());
        dto.setId_equipo_2(partido.getId_equipo_2());
        return dto;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPartido(@PathVariable("id") String partidoId) {
        try {
            partidoService.eliminarPartido(partidoId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el partido: " + e.getMessage());
        }
    }
}
