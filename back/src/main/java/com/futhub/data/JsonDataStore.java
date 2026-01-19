package com.futhub.data;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // Para LocalDateTime
import com.futhub.models.Cancha;
import com.futhub.models.Equipo;
import com.futhub.models.Partido;
import com.futhub.models.Usuario;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

import com.futhub.models.Invitacion;

/**
 * Componente de Spring que maneja la persistencia (lectura y escritura)
 * de los modelos de datos en archivos JSON.
 * Reemplaza la necesidad de un Repositorio de base de datos.
 */

@Component
public class JsonDataStore {

    private final ObjectMapper objectMapper;

    // Variables que 'apuntan' a nuestros archivos JSON en 'resources'
    private final File archivoUsuarios;
    private final File archivoCanchas;
    private final File archivoEquipos;
    private final File archivoPartidos;
    private final File archivoInvitaciones;

    /**
     * Constructor que se ejecuta cuando Spring crea esta clase.
     * Carga las rutas a los archivos JSON.
     */

    public JsonDataStore() {
        // Creamos el ObjectMapper y le registramos el módulo para que entienda
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());

        try {
            this.archivoUsuarios = resolveDataFile("usuarios.json");
            this.archivoCanchas = resolveDataFile("canchas.json");
            this.archivoEquipos = resolveDataFile("equipos.json");
            this.archivoPartidos = resolveDataFile("partidos.json");
            this.archivoInvitaciones = resolveDataFile("invitaciones.json");

        } catch (IOException e) {
            throw new RuntimeException("Error fatal: No se pudieron cargar los archivos JSON de la base de datos.", e);
        }
    }

    /**
     * Resuelve el archivo JSON a usar para lectura/escritura.
     * Busca en varias rutas posibles (módulo 'back' o raíz del repo) y si no existe
     * crea el archivo copiando el recurso desde classpath.
     */
    private File resolveDataFile(String filename) throws IOException {
        String[] candidatePrefixes = new String[] {
                "back/src/main/resources/data/",
                "src/main/resources/data/",
                "../src/main/resources/data/",
                "./src/main/resources/data/"
        };

        for (String prefix : candidatePrefixes) {
            File f = new File(prefix + filename);
            if (f.exists()) {
                return f;
            }
        }

        File preferredDir;
        if (new File("back").exists()) {
            preferredDir = new File("back/src/main/resources/data");
        } else {
            preferredDir = new File("src/main/resources/data");
        }
        Files.createDirectories(preferredDir.toPath());
        File target = new File(preferredDir, filename);

        ClassPathResource resource = new ClassPathResource("data/" + filename);
        if (resource.exists()) {
            try (InputStream is = resource.getInputStream()) {
                Files.copy(is, target.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }
            return target;
        }

        Files.createDirectories(target.getParentFile().toPath());
        Files.write(target.toPath(), "[]".getBytes());
        return target;
    }

    // --- Métodos para USUARIOS ---

    /**
     * Lee el archivo usuarios.json y lo convierte en una Lista de objetos Usuario.
     * @return La lista de todos los usuarios.
     * @throws IOException Si hay un error al leer el archivo.
     */

    public List<Usuario> getUsuarios() throws IOException {
        // TypeReference es necesario para decirle a Jackson que es una *Lista* de Usuarios
        return objectMapper.readValue(archivoUsuarios, new TypeReference<List<Usuario>>() {});
    }

    /**
     * Sobrescribe el archivo usuarios.json con la lista de usuarios proporcionada.
     * @param usuarios La lista completa de usuarios que se va a guardar.
     * @throws IOException Si hay un error al escribir el archivo.
     */
    public void saveUsuarios(List<Usuario> usuarios) throws IOException {
        // writerWithDefaultPrettyPrinter() hace que el JSON se guarde formateado y legible
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(archivoUsuarios, usuarios);
    }

    /**
     * Elimina un usuario por su id. Si el usuario existía, guarda la lista actualizada
     * y devuelve true. Si no existía, no modifica el archivo y devuelve false.
     * @param id Identificador del usuario a eliminar.
     * @return true si se eliminó al menos un usuario, false si no se encontró.
     * @throws IOException Si ocurre un error de lectura o escritura.
     */
    public boolean deleteUsuarioById(String id) throws IOException {
        List<Usuario> usuarios = getUsuarios();
        int originalSize = usuarios.size();
        List<Usuario> filtered = usuarios.stream()
                .filter(u -> u.getId() == null || !u.getId().equals(id))
                .collect(Collectors.toList());
        if (filtered.size() == originalSize) {
            return false;
        }
        saveUsuarios(filtered);
        return true;
    }

    // --- Métodos para CANCHAS ---

    public List<Cancha> getCanchas() throws IOException {
        return objectMapper.readValue(archivoCanchas, new TypeReference<List<Cancha>>() {});
    }

    public void saveCanchas(List<Cancha> canchas) throws IOException {
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(archivoCanchas, canchas);
    }

    // --- Métodos para EQUIPOS ---

    public List<Equipo> getEquipos() throws IOException {
        return objectMapper.readValue(archivoEquipos, new TypeReference<List<Equipo>>() {});
    }

    public void saveEquipos(List<Equipo> equipos) throws IOException {
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(archivoEquipos, equipos);
    }

    // --- Métodos para PARTIDOS ---

    public List<Partido> getPartidos() throws IOException {
        return objectMapper.readValue(archivoPartidos, new TypeReference<List<Partido>>() {});
    }

    public void savePartidos(List<Partido> partidos) throws IOException {
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(archivoPartidos, partidos);
    }

    public String getCanchasPath() {
        return archivoCanchas.getAbsolutePath();
    }

    public List<Invitacion> getInvitaciones() throws IOException {
        return objectMapper.readValue(archivoInvitaciones, new TypeReference<List<Invitacion>>() {});
    }

    public void saveInvitaciones(List<Invitacion> invitaciones) throws IOException {
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(archivoInvitaciones, invitaciones);
    }
}


