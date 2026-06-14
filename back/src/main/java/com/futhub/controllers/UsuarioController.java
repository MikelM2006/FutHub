package com.futhub.controllers;

import com.futhub.dto.usuario.CreateUsuarioRequest;
import com.futhub.dto.usuario.LoginRequest;
import com.futhub.dto.usuario.UsuarioDTO;
import com.futhub.dto.usuario.UsuarioPerfilUpdateDto;
import com.futhub.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080", "https://fut-hub-beta.vercel.app"})
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() {
        List<UsuarioDTO> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getById(@PathVariable String id) {
        UsuarioDTO dto = usuarioService.getUsuarioById(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateUsuarioRequest req) {
        try {
            UsuarioDTO created = usuarioService.createUsuario(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (Exception ex) {
            String msg = ex.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg != null ? msg : "Error creando usuario");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            UsuarioDTO dto = usuarioService.login(req.getEmail(), req.getClave());
            if (dto == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
            }
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en login: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            boolean deleted = usuarioService.deleteUsuario(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            String msg = ex.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg != null ? msg : "Error eliminando usuario");
        }
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<?> updatePerfil(@PathVariable String id, @RequestBody UsuarioPerfilUpdateDto dto) {
        try {
            UsuarioDTO updated = usuarioService.updatePerfil(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            String msg = ex.getMessage();
            if (msg != null && msg.contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
        } catch (Exception ex) {
            String msg = ex.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg != null ? msg : "Error actualizando perfil");
        }
    }
}
