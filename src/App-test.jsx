import { useState, useEffect } from 'react'

function AppTest() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>✅ Todo App is Working! </h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Click me!
      </button>
    </div>
  )
}

export default AppTest