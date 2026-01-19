import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Se eliminó la extensión .tsx
import './index.css';

const container = document.getElementById('root');

// Es una buena práctica en JavaScript verificar que el elemento existe
if (container) {
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Error: No se pudo encontrar el elemento 'root'. La app de React no se puede montar.");
}