package com.futhub.controllers;

import com.futhub.dto.equipo.CreateEquipoRequest;
import com.futhub.dto.equipo.EquipoDTO;
import com.futhub.dto.equipo.EquipoDetalleDTO;
import com.futhub.services.EquipoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import com.futhub.dto.equipo.InviteUserRequest;
import com.futhub.dto.equipo.ResponderInvitacionRequest;
import com.futhub.models.Invitacion;

@RestController //esta clase maneja particiones web
@RequestMapping("/api/v1/equipos") //define url base para todas las particiones en este controlador
@CrossOrigin(origins = {"http://localhost:5173", "https://fut-hub-beta.vercel.app"})
public class EquipoController {

    private final EquipoService equipoService;

    //Constructor para inyectar la dependencia del servicio de equipo
    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }


    private void ensureUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-USER-ID header");
        }
    }


    @PostMapping
    public ResponseEntity<EquipoDetalleDTO> crearEquipo(
            @RequestBody CreateEquipoRequest request,
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        EquipoDetalleDTO equipoCreado = equipoService.crearEquipo(request, userId);
        return new ResponseEntity<>(equipoCreado, HttpStatus.CREATED);
    }

    @PostMapping("/{equipoId}/unirse")
    public ResponseEntity<Void> unirseAEquipo(
            @PathVariable String equipoId,
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        equipoService.unirseAEquipo(equipoId, userId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/mis-equipos")
    public ResponseEntity<List<EquipoDetalleDTO>> getMisEquipos(
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        return ResponseEntity.ok(equipoService.getMisEquipos(userId));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<EquipoDTO>> getEquiposParaBuscar(
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        return ResponseEntity.ok(equipoService.getEquiposParaBuscar(userId));
    }

    @GetMapping("/{equipoId}")
    public ResponseEntity<EquipoDetalleDTO> getEquipoDetalle(
            @PathVariable String equipoId,
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        return ResponseEntity.ok(equipoService.getEquipoDetalle(equipoId, userId));
    }

    // 1. Endpoint para INVITAR (Solo Capitán)
    @PostMapping("/{equipoId}/invitar")
    public ResponseEntity<?> invitarUsuario(
            @PathVariable String equipoId,
            @RequestBody InviteUserRequest request,
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);

        try {
            // Intentamos realizar la invitación
            equipoService.invitarUsuario(equipoId, request.getEmail(), userId);
            // Si funciona, devolvemos OK (200)
            return ResponseEntity.ok().build();

        } catch (RuntimeException e) {
            // ¡AQUÍ ESTÁ LA SOLUCIÓN!
            // Si falla, capturamos el mensaje exacto ("Usuario no encontrado...", etc.)
            // Y devolvemos un 400 Bad Request con un JSON explícito: { "message": "..." }
            return ResponseEntity
                    .badRequest()
                    .body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 2. Endpoint para obtener MIS INVITACIONES (Para mostrarlas debajo de "Mis Equipos")
    @GetMapping("/invitaciones")
    public ResponseEntity<List<Invitacion>> getMisInvitaciones(
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        return ResponseEntity.ok(equipoService.getMisInvitaciones(userId));
    }

    // 3. Endpoint para RESPONDER INVITACIÓN (Aceptar/Rechazar)
    @PostMapping("/invitaciones/{invitacionId}/responder")
    public ResponseEntity<Void> responderInvitacion(
            @PathVariable String invitacionId,
            @RequestBody ResponderInvitacionRequest request,
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        equipoService.responderInvitacion(invitacionId, userId, request.isAceptar());
        return ResponseEntity.ok().build();
    }

    // 4. Endpoint para ELIMINAR EQUIPO (Solo Capitán)
    @DeleteMapping("/{equipoId}")
    public ResponseEntity<Void> eliminarEquipo(
            @PathVariable String equipoId,
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        equipoService.eliminarEquipo(equipoId, userId);
        return ResponseEntity.noContent().build();
    }

    // 5. Endpoint para SALIRSE DEL EQUIPO (Cualquier miembro excepto Capitán)
    @PostMapping("/{equipoId}/salir")
    public ResponseEntity<Void> salirDelEquipo(
            @PathVariable String equipoId,
            @RequestHeader(value = "X-USER-ID", required = false) String userId) {

        ensureUserId(userId);
        equipoService.salirDelEquipo(equipoId, userId);
        return ResponseEntity.ok().build();
    }
}
