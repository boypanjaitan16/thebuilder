import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter
        basename={import.meta.env.VITE_BASE_PATH || '/'}
      >
        <App />
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
)
