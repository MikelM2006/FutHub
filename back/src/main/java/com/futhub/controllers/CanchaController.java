package com.futhub.controllers;

import com.futhub.dto.cancha.CanchaDTO;
import com.futhub.dto.cancha.CreateCanchaRequest;
import com.futhub.dto.cancha.UpdateCanchaRequest;
import com.futhub.models.Cancha;
import com.futhub.services.CanchaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/canchas")
public class CanchaController {

    @Autowired
    private CanchaService canchaService;

    @PostMapping("/")
    public ResponseEntity<CanchaDTO> crearCancha(@Valid @RequestBody CreateCanchaRequest request) {
        try {

            Cancha creada = canchaService.create(request);
            CanchaDTO dto = toDTO(creada);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<CanchaDTO>> obtenerCanchasDisponibles() {
        try {
            List<Cancha> canchas = canchaService.getAvailable();
            List<CanchaDTO> disponibles = new ArrayList<>();
            for (Cancha c : canchas) {
                disponibles.add(toDTO(c));
            }
            return ResponseEntity.ok(disponibles);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<CanchaDTO>> obtenerTodasCanchas() {
        try {
            List<Cancha> canchas = canchaService.getAll();
            List<CanchaDTO> result = new ArrayList<>();
            for (Cancha c : canchas) {
                result.add(toDTO(c));
            }
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PATCH /{id} - Actualización parcial de una cancha
     */
    @PatchMapping("/{id}")
    public ResponseEntity<CanchaDTO> actualizarParcialmenteCancha(@PathVariable String id, @RequestBody UpdateCanchaRequest request) {
        try {
            Optional<Cancha> updated = canchaService.updatePartial(id, request);
            if (updated.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(toDTO(updated.get()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /{id} - Elimina una cancha por ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCancha(@PathVariable String id) {
        try {
            canchaService.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la cancha: " + e.getMessage());
        }
    }

    // --- Helpers ---
    private CanchaDTO toDTO(Cancha cancha) {
        CanchaDTO dto = new CanchaDTO();
        dto.setId(cancha.getId());
        dto.setNombre(cancha.getNombre());
        dto.setUbicacion(cancha.getUbicacion());
        dto.setPrecio(cancha.getPrecio());
        dto.setDisponible(cancha.getDisponible());
        dto.setImagenUrl(cancha.getImagenUrl());
        return dto;
    }
}
