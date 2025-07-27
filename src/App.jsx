import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import MouseTrail from './components/MouseTrail'
import { database, ref, set, onValue, off } from './firebase.js'

function App() {
  const [theme, setTheme] = useState('system')
  const [colorScheme, setColorScheme] = useState('blue')
  const [user, setUser] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load username from localStorage immediately
    const savedUser = localStorage.getItem('username')
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        document.documentElement.setAttribute(
          'data-theme',
          mediaQuery.matches ? 'dark' : 'light'
        )
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    handleChange() // Initial call
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, isLoading])

  useEffect(() => {
    if (isLoading) return
    document.documentElement.setAttribute('data-color-scheme', colorScheme)
  }, [colorScheme, isLoading])

  const handleUsernameSubmit = (e) => {
    e.preventDefault()
    const username = e.target.username.value.trim()
    if (username) {
      setUser(username)
      localStorage.setItem('username', username)
    }
  }

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  if (!user) {
    return (
      <div className="app" style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1>🎯 Welcome to Todo App</h1>
        <p>Enter a username to get started:</p>
        <form onSubmit={handleUsernameSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            maxLength={20}
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
      </div>
    )
  }

  return (
    <div className="app">
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>✅ Todo App is Working!</h1>
        <p>Welcome, {user}! Your app is now loaded.</p>
        <TodoList />
      </div>
    </div>
  )
}

export default App
