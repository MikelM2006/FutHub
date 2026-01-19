package com.futhub.services;

import com.futhub.data.JsonDataStore;
import com.futhub.dto.cancha.CreateCanchaRequest;
import com.futhub.dto.cancha.UpdateCanchaRequest;
import com.futhub.models.Cancha;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Service
public class CanchaService {

    private final JsonDataStore jsonDataStore;
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();

    @Autowired
    public CanchaService(JsonDataStore jsonDataStore) {
        this.jsonDataStore = jsonDataStore;
    }

    /** Devuelve una copia de todas las canchas */
    public List<Cancha> getAll() throws IOException {
        rwLock.readLock().lock();
        try {
            return new ArrayList<>(jsonDataStore.getCanchas());
        } finally {
            rwLock.readLock().unlock();
        }
    }

    /** Devuelve sólo las canchas disponibles */
    public List<Cancha> getAvailable() throws IOException {
        rwLock.readLock().lock();
        try {
            List<Cancha> all = jsonDataStore.getCanchas();
            List<Cancha> result = new ArrayList<>();
            for (Cancha c : all) {
                if (Boolean.TRUE.equals(c.getDisponible())) {
                    result.add(c);
                }
            }
            return result;
        } finally {
            rwLock.readLock().unlock();
        }
    }

    /** Crea una nueva cancha */
    public Cancha create(CreateCanchaRequest request) throws IOException {
        rwLock.writeLock().lock();
        try {
            List<Cancha> canchas = jsonDataStore.getCanchas();
            Cancha nueva = new Cancha();
            nueva.setId(UUID.randomUUID().toString());
            nueva.setNombre(request.getNombre());
            nueva.setUbicacion(request.getUbicacion());
            nueva.setPrecio(request.getPrecio());
            nueva.setDisponible(Boolean.TRUE);
            // Copiar imagenUrl si se proporcionó
            nueva.setImagenUrl(request.getImagenUrl());

            canchas.add(nueva);
            jsonDataStore.saveCanchas(canchas);
            return nueva;
        } finally {
            rwLock.writeLock().unlock();
        }
    }

    /** Busca una cancha por id */
    public Optional<Cancha> findById(String id) throws IOException {
        rwLock.readLock().lock();
        try {
            List<Cancha> canchas = jsonDataStore.getCanchas();
            for (Cancha c : canchas) {
                if (c.getId() != null && c.getId().equals(id)) {
                    return Optional.of(c);
                }
            }
            return Optional.empty();
        } finally {
            rwLock.readLock().unlock();
        }
    }

    /** Actualización parcial. Devuelve Optional.empty si no existe */
    public Optional<Cancha> updatePartial(String id, UpdateCanchaRequest request) throws IOException {
        rwLock.writeLock().lock();
        try {
            List<Cancha> canchas = jsonDataStore.getCanchas();
            Cancha encontrada = null;
            for (Cancha c : canchas) {
                if (c.getId() != null && c.getId().equals(id)) {
                    encontrada = c;
                    break;
                }
            }

            if (encontrada == null) {
                return Optional.empty();
            }

            if (request.getNombre() != null) {
                encontrada.setNombre(request.getNombre());
            }
            if (request.getUbicacion() != null) {
                encontrada.setUbicacion(request.getUbicacion());
            }
            if (request.getPrecio() != null) {
                encontrada.setPrecio(request.getPrecio());
            }
            if (request.getDisponible() != null) {
                encontrada.setDisponible(request.getDisponible());
            }
            if (request.getImagenUrl() != null) {
                encontrada.setImagenUrl(request.getImagenUrl());
            }

            jsonDataStore.saveCanchas(canchas);
            return Optional.of(encontrada);

        } finally {
            rwLock.writeLock().unlock();
        }
    }

    /** Elimina una cancha por ID; lanza IllegalArgumentException si no existe */
    public void delete(String id) throws IOException {
        rwLock.writeLock().lock();
        try {
            List<Cancha> canchas = jsonDataStore.getCanchas();
            boolean eliminado = canchas.removeIf(c -> c.getId() != null && c.getId().equals(id));
            if (!eliminado) {
                throw new IllegalArgumentException("Cancha no encontrada.");
            }
            jsonDataStore.saveCanchas(canchas);
        } finally {
            rwLock.writeLock().unlock();
        }
    }
}
