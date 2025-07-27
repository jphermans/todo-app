import { useState, useEffect } from 'react'

export default function AppDebug() {
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    const info = [
      '🎯 APP DEBUG INFO',
      `Window location: ${window.location.href}`,
      `Base path: ${import.meta.env.BASE_URL}`,
      `User agent: ${navigator.userAgent.substring(0, 100)}...`,
      `LocalStorage available: ${typeof localStorage !== 'undefined'}`,
      `React version: ${React.version || 'unknown'}`,
      `Script loaded at: ${new Date().toLocaleString()}`,
      `Environment: ${import.meta.env.MODE}`,
      `Firebase API key: ${import.meta.env.VITE_FIREBASE_API_KEY ? '✅ exists' : '❌ missing'}`
    ].join('\n')
    
    setDebugInfo(info)
    console.log(info)
  }, [])

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      background: '#f5f5f5',
      minHeight: '100vh',
      whiteSpace: 'pre-wrap'
    }}>
      <h1>🔍 Debug Information</h1>
      <pre>{debugInfo}</pre>
      
      <h2>Test Links:</h2>
      <ul>
        <li><a href="/todo-app/assets/index-DjIvjxwf.js">Check JS file</a></li>
        <li><a href="/todo-app/assets/index-DSENumfy.css">Check CSS file</a></li>
        <li><a href="/todo-app/debug.html">Debug page</a></li>
      </ul>
    </div>
  )
}