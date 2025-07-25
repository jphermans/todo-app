import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import MouseTrail from './components/MouseTrail'

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'system'
  })

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
    localStorage.setItem('theme', theme)
  }, [theme])

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

  return (
    <div 
      className="app" 
      style={{ 
        '--mouse-x': `${mousePosition.x}px`, 
        '--mouse-y': `${mousePosition.y}px` 
      }}
    >
      <button
        onClick={() => setTheme(getNextTheme())}
        className="theme-toggle"
        aria-label={`Current theme: ${theme}. Click to change.`}
      >
        {getThemeIcon()}
      </button>
      <MouseTrail />
      <TodoList />
    </div>
  )
}

export default App
