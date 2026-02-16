import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { YearProvider } from './DSO_ADMIN_CONNECT/Layout/YearContext.tsx'
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from './ThemeProvider/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">  <YearProvider><App /></YearProvider></ThemeProvider>
  </StrictMode>,
)
