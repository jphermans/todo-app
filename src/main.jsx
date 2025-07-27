import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debug mount point
try {
  console.log('🎯 Starting Todo App...')
  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  
  console.log('✅ App mounted successfully')
} catch (error) {
  console.error('❌ App failed to mount:', error)
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: Arial; background: #ffebee; color: #c62828">
      <h2>🐛 App Error</h2>
      <p>${error.message}</p>
      <p>Check browser console for full details</p>
    </div>
  `
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/todo-app/service-worker.js')
      .then(() => console.log('✅ Service worker registered'))
      .catch((err) => {
        console.error('❌ Service worker registration failed', err)
      })
  })
}
