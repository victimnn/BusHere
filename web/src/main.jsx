import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Importar Bootstrap JavaScript para funcionalidades como offcanvas
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function Main() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Remove existing theme stylesheets
    const existingStyles = document.querySelectorAll('style[data-vite-dev-id*="Style.scss"], style[data-vite-dev-id*="Dark.scss"]')
    existingStyles.forEach(style => style.remove())

    // Also remove any link tags for these styles
    const existingLinks = document.querySelectorAll('link[href*="Style.scss"], link[href*="Dark.scss"]')
    existingLinks.forEach(link => link.remove())

    // Dynamically import the appropriate style
    if (isDark) {
      import('@web/Dark.scss')
    } else {
      import('@web/Style.scss')
    }
  }, [isDark])

  return (
    <StrictMode>
      <App isDark={isDark} setIsDark={setIsDark} />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Main />)