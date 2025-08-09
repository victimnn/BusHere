import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Importar Bootstrap JavaScript para funcionalidades como offcanvas
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './index.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
