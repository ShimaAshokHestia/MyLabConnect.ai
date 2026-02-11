import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { YearProvider } from './ADMIN-PORTAL/Layout/YearContext.tsx'
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <YearProvider><App /></YearProvider>
  </StrictMode>,
)
