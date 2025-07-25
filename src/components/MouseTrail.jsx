import { useState, useEffect } from 'react'

function MouseTrail() {
  const [trails, setTrails] = useState([])

  useEffect(() => {
    const handleMove = (e) => {
      const id = Math.random().toString(36).slice(2)
      const newTrail = { x: e.clientX, y: e.clientY, id }
      setTrails((trails) => [...trails, newTrail])
      setTimeout(() => {
        setTrails((trails) => trails.filter((t) => t.id !== id))
      }, 600)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className="mouse-trail-container">
      {trails.map((trail) => (
        <span
          key={trail.id}
          className="mouse-trail-dot"
          style={{ left: trail.x, top: trail.y }}
        />
      ))}
    </div>
  )
}

export default MouseTrail
