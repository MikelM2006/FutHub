package com.futhub.services;

import com.futhub.data.JsonDataStore;
import com.futhub.dto.equipo.*;
import com.futhub.dto.usuario.UsuarioDTO;
import com.futhub.models.Equipo;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.futhub.models.Invitacion;
import com.futhub.models.Usuario;
import java.util.Optional;

@Service
public class EquipoService {

    private final JsonDataStore jsonDataStore;
    private final UsuarioService usuarioService;

    public EquipoService(JsonDataStore jsonDataStore, UsuarioService usuarioService) {
        this.jsonDataStore = jsonDataStore;
        this.usuarioService = usuarioService;
    }

    public EquipoDetalleDTO crearEquipo(CreateEquipoRequest request, String usuarioId) {
        try {
            List<Equipo> todosLosEquipos = jsonDataStore.getEquipos();

            boolean nombreExiste = todosLosEquipos.stream()
                    .anyMatch(e -> e.getNombre() != null && e.getNombre().equalsIgnoreCase(request.getNombre()));
            if (nombreExiste) {
                throw new RuntimeException("Ya existe un equipo con ese nombre");
            }

            Equipo equipo = new Equipo();
            equipo.setId(UUID.randomUUID().toString());
            equipo.setNombre(request.getNombre());
            equipo.setId_creador(usuarioId);

            List<String> miembrosIds = new ArrayList<>();
            miembrosIds.add(usuarioId);
            equipo.setMiembrosIds(miembrosIds);

            todosLosEquipos.add(equipo);
            jsonDataStore.saveEquipos(todosLosEquipos);

            return mapToEquipoDetalleDTO(equipo, usuarioId);

        } catch (IOException e) {
            throw new RuntimeException("Error al crear el equipo en equipos.json", e);
        }
    }

    public void unirseAEquipo(String equipoId, String usuarioId) {
        try {
            List<Equipo> todosLosEquipos = jsonDataStore.getEquipos();

            Equipo equipoAUnirse = todosLosEquipos.stream()
                    .filter(e -> e.getId().equals(equipoId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

            if (equipoAUnirse.getMiembrosIds().contains(usuarioId)) {
                throw new RuntimeException("El usuario ya es miembro de este equipo");
            }

            equipoAUnirse.getMiembrosIds().add(usuarioId);
            jsonDataStore.saveEquipos(todosLosEquipos);

        } catch (IOException e) {
            throw new RuntimeException("Error al unirse al equipo en equipos.json", e);
        }
    }

    public List<EquipoDetalleDTO> getMisEquipos(String usuarioId) {
        try {
            List<Equipo> todosLosEquipos = jsonDataStore.getEquipos();

            return todosLosEquipos.stream()
                    .filter(e -> e.getMiembrosIds().contains(usuarioId))
                    .map(e -> mapToEquipoDetalleDTO(e, usuarioId))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Error al leer equipos.json", e);
        }
    }

    public List<EquipoDTO> getEquiposParaBuscar(String usuarioId) {
        try {
            List<Equipo> todosLosEquipos = jsonDataStore.getEquipos();

            return todosLosEquipos.stream()
                    .filter(e -> !e.getMiembrosIds().contains(usuarioId))
                    .map(this::mapToEquipoDTO)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Error al leer equipos.json", e);
        }
    }

    public EquipoDetalleDTO getEquipoDetalle(String equipoId, String usuarioId) {
        try {
            List<Equipo> todosLosEquipos = jsonDataStore.getEquipos();
            Equipo equipo = todosLosEquipos.stream()
                    .filter(e -> e.getId().equals(equipoId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
            return mapToEquipoDetalleDTO(equipo, usuarioId);
        } catch (IOException e) {
            throw new RuntimeException("Error al leer equipos.json", e);
        }
    }


    //Metdos privados de mapeo (traduccin de modelos a DTOs)
    private EquipoDTO mapToEquipoDTO(Equipo equipo) {
        return new EquipoDTO(
                equipo.getId(),
                equipo.getNombre(),
                equipo.getMiembrosIds() == null ? 0 : equipo.getMiembrosIds().size()
        );
    }

    private EquipoDetalleDTO mapToEquipoDetalleDTO(Equipo equipo, String usuarioActualId) {

        List<UsuarioDTO> miembrosDTOs = equipo.getMiembrosIds().stream()
                .map(id -> {
                    UsuarioDTO usuarioDto = usuarioService.getUsuarioById(id);
                    if (usuarioDto != null) {
                        return usuarioDto;
                    } else {
                        UsuarioDTO fallback = new UsuarioDTO();
                        fallback.setId(id);
                        fallback.setNombreCompleto("Miembro (ID: " + id + ")");
                        return fallback;
                    }
                })
                .collect(Collectors.toList());

        boolean isOwner = equipo.getId_creador() != null && equipo.getId_creador().equals(usuarioActualId);

        return new EquipoDetalleDTO(
                equipo.getId(),
                equipo.getNombre(),
                isOwner,
                miembrosDTOs
        );
    }



    // --- LÓGICA DE INVITACIONES ---

    public void invitarUsuario(String equipoId, String emailInvitado, String ownerId) {
        try {
            // 1. Validar Equipo (Tu lógica original)
            List<Equipo> equipos = jsonDataStore.getEquipos();
            Equipo equipo = equipos.stream()
                    .filter(e -> e.getId().equals(equipoId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

            // --- CORRECCIÓN MÍNIMA NECESARIA ---
            // Obtenemos la lista. Si es null (pasa con archivos JSON nuevos), usamos una lista vacía.
            // Esto soluciona el error de que no te reconocía como miembro.
            List<String> miembros = equipo.getMiembrosIds();
            if (miembros == null) {
                miembros = new ArrayList<>();
            }

            String creadorId = equipo.getId_creador();

            // Validamos permisos usando tus variables
            boolean esCreador = ownerId.equals(creadorId);
            boolean esMiembro = miembros.contains(ownerId);

            if (!esCreador || !esMiembro) {
                throw new RuntimeException("Solo los miembros del equipo pueden enviar invitaciones.");
            }
            // -----------------------------------

            // 2. Buscar al usuario por email (Tu lógica original con jsonDataStore)
            List<Usuario> usuarios = jsonDataStore.getUsuarios();
            Usuario usuarioDestino = usuarios.stream()
                    .filter(u -> u.getEmail().equalsIgnoreCase(emailInvitado))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No existe un usuario con el email: " + emailInvitado));

            // 3. Validar que no sea ya miembro
            if (miembros.contains(usuarioDestino.getId())) {
                throw new RuntimeException("El usuario ya es miembro del equipo");
            }

            // 4. Validar que no tenga ya una invitación pendiente (Tu lógica original)
            List<Invitacion> invitaciones = jsonDataStore.getInvitaciones();
            if (invitaciones == null) invitaciones = new ArrayList<>(); // Protección extra por si el archivo está vacío

            boolean yaInvitado = invitaciones.stream()
                    .anyMatch(i -> i.getEquipoId().equals(equipoId) && i.getUsuarioIdDestino().equals(usuarioDestino.getId()));

            if (yaInvitado) {
                throw new RuntimeException("Ya se ha enviado una invitación a este usuario");
            }

            // 5. Crear y guardar invitación
            Invitacion nuevaInvitacion = new Invitacion(
                    UUID.randomUUID().toString(),
                    equipo.getId(),
                    equipo.getNombre(),
                    usuarioDestino.getId(),
                    usuarioDestino.getEmail()
            );

            invitaciones.add(nuevaInvitacion);
            jsonDataStore.saveInvitaciones(invitaciones);

        } catch (IOException e) {
            throw new RuntimeException("Error de datos al invitar usuario", e);
        }
    }

    public List<Invitacion> getMisInvitaciones(String userId) {
        try {
            return jsonDataStore.getInvitaciones().stream()
                    .filter(i -> i.getUsuarioIdDestino().equals(userId))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Error al leer invitaciones", e);
        }
    }

    public void responderInvitacion(String invitacionId, String userId, boolean aceptar) {
        try {
            List<Invitacion> invitaciones = jsonDataStore.getInvitaciones();
            Invitacion invitacion = invitaciones.stream()
                    .filter(i -> i.getId().equals(invitacionId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Invitación no encontrada"));

            if (!invitacion.getUsuarioIdDestino().equals(userId)) {
                throw new RuntimeException("No tienes permiso para responder esta invitación");
            }

            if (aceptar) {
                // Usamos la lógica existente para unirse
                unirseAEquipo(invitacion.getEquipoId(), userId);
            }

            // Ya sea aceptada o rechazada, la borramos de pendientes
            invitaciones.removeIf(i -> i.getId().equals(invitacionId));
            jsonDataStore.saveInvitaciones(invitaciones);

        } catch (IOException e) {
            throw new RuntimeException("Error al procesar invitación", e);
        }
    }

    // --- LÓGICA DE ELIMINAR Y SALIR ---

    public void eliminarEquipo(String equipoId, String userId) {
        try {
            List<Equipo> equipos = jsonDataStore.getEquipos();
            Equipo equipo = equipos.stream()
                    .filter(e -> e.getId().equals(equipoId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

            // Solo el creador puede eliminar
            if (!equipo.getId_creador().equals(userId)) {
                throw new RuntimeException("Solo el capitán puede eliminar el equipo");
            }

            equipos.remove(equipo);
            jsonDataStore.saveEquipos(equipos);

            // Opcional: Limpiar invitaciones asociadas a este equipo
            List<Invitacion> invitaciones = jsonDataStore.getInvitaciones();
            invitaciones.removeIf(i -> i.getEquipoId().equals(equipoId));
            jsonDataStore.saveInvitaciones(invitaciones);

        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar equipo", e);
        }
    }

    public void salirDelEquipo(String equipoId, String userId) {
        try {
            List<Equipo> equipos = jsonDataStore.getEquipos();
            Equipo equipo = equipos.stream()
                    .filter(e -> e.getId().equals(equipoId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

            // El creador NO puede salirse (debe eliminar el equipo o transferir, por ahora obligamos a eliminar)
            if (equipo.getId_creador().equals(userId)) {
                throw new RuntimeException("El capitán no puede salirse. Debe eliminar el equipo.");
            }

            if (!equipo.getMiembrosIds().contains(userId)) {
                throw new RuntimeException("No eres miembro de este equipo");
            }

            equipo.getMiembrosIds().remove(userId);
            jsonDataStore.saveEquipos(equipos);

        } catch (IOException e) {
            throw new RuntimeException("Error al salir del equipo", e);
        }
    }

}
