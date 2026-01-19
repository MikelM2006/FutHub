package com.futhub.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Este método atrapa CUALQUIER error de tipo RuntimeException que lances en tus Servicios
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        // Devolvemos un código 400 (Bad Request) en lugar de 500
        // Y enviamos el mensaje exacto que escribiste en tu EquipoService
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("message", e.getMessage()));
    }
}
