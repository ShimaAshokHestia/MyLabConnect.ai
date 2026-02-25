// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { YearProvider } from './DSO_ADMIN_CONNECT/Layout/YearContext.tsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ThemeProvider } from './ThemeProvider/ThemeProvider.tsx';
import Swal from 'sweetalert2';
import AuthService from './Services/AuthServices/Auth.services.ts';

Swal.mixin({
  customClass: { container: 'swal-container' },
});

// ── Decrypt localStorage into memory BEFORE React renders ─────────────────────
// This ensures AuthService.getUser() / getToken() are populated synchronously
// when config files and layout components access them on first render.
AuthService.init().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <YearProvider>
          <App />
        </YearProvider>
      </ThemeProvider>
    </StrictMode>
  );
});