import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { YearProvider } from './DSO_ADMIN_CONNECT/Layout/YearContext.tsx'
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from './ThemeProvider/ThemeProvider.tsx'
import Swal from 'sweetalert2';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>  <YearProvider><App /></YearProvider></ThemeProvider>
  </StrictMode>,
)
Swal.mixin({
  customClass: { container: 'swal-container' }
});