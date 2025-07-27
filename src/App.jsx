import { useState, useEffect } from 'react'

function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('🎯 App component mounted')
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>✅ Todo App is Working!</h1>
      <p>If you see this, React is loaded correctly.</p>
      <p>Next: Enter a username to continue.</p>
    </div>
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <h1>🎯 Todo App Debug Mode</h1>
      <form onSubmit={(e) => {
        e.preventDefault()
        const username = e.target.username.value.trim()
        if (username) {
          localStorage.setItem('username', username)
          alert(`Welcome ${username}! Redirecting...`)
          window.location.reload()
        }
      }}>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
          autoFocus
        />
        <button type="submit" style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Start
        </button>
      </form>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: '#fff', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Debug Info:</strong><br/>
        URL: {window.location.href}<br/>
        Base: {import.meta.env.BASE_URL}<br/>
        Firebase API: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌'}
      </div>
    </div>
  )
}

export default App
