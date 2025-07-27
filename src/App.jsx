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

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
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
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Load user preferences from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('username')
    if (savedUser) {
      setUser(savedUser)
    }
  }, [])

  // Load user preferences from Firebase
  useEffect(() => {
    if (!user) return

    const prefsRef = ref(database, `preferences/${user}`)
    
    const handlePrefsChange = (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setTheme(data.theme || 'system')
        setColorScheme(data.colorScheme || 'blue')
      }
    }

    onValue(prefsRef, handlePrefsChange)

    return () => {
      const prefsRef = ref(database, `preferences/${user}`)
      off(prefsRef, 'value', handlePrefsChange)
    }
  }, [user])

  // Save user preferences to Firebase
  useEffect(() => {
    if (!user) return

    const prefsRef = ref(database, `preferences/${user}`)
    set(prefsRef, { theme, colorScheme })
  }, [theme, colorScheme, user])

  // Apply theme and color scheme to document
  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
    document.documentElement.setAttribute('data-color-scheme', colorScheme)
  }, [theme, colorScheme])

  const getNextTheme = () => {
    const themes = ['system', 'light', 'dark']
    const currentIndex = themes.indexOf(theme)
    return themes[(currentIndex + 1) % themes.length]
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      default:
        return '🖥️'
    }
  }

  const colorSchemes = ['blue', 'green', 'purple', 'orange', 'pink', 'red', 'teal', 'indigo']

  const getNextColorScheme = () => {
    const currentIndex = colorSchemes.indexOf(colorScheme)
    return colorSchemes[(currentIndex + 1) % colorSchemes.length]
  }

  return (
    <div
      className="app"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`
      }}
    >
      {!isOnline && (
        <div className="offline-banner">
          Offline - changes will sync when connection is restored
        </div>
      )}
      <div className="settings-bar">
        <button
          onClick={() => setTheme(getNextTheme())}
          className="theme-toggle"
          aria-label={`Current theme: ${theme}. Click to change.`}
        >
          {getThemeIcon()}
        </button>
        <button
          onClick={() => setColorScheme(getNextColorScheme())}
          className="color-toggle"
          aria-label={`Current color: ${colorScheme}. Click to change.`}
          style={{
            backgroundColor: `var(--primary-color)`,
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🎨
        </button>
      </div>
      <MouseTrail />
      <TodoList />
    </div>
  )
}

export default App
