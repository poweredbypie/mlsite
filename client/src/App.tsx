import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import './style.css'

const App: React.FC = () => {
  const [allowed, setAllowed] = useState(false)

  return (
    <HashRouter>
      <p>Allah</p>
      {/* <Header
        name='n • t'
        // name='NoT'
        routes={{
          home: '/',
        }}
      />
      <Routes>
        <Route
          path='/'
          element={
            <>{allowed ? <Home /> : <DumbGate onAllowed={(e: boolean) => setAllowed(e)} />}</>
          }
        />
      </Routes> */}
    </HashRouter>
  )
}

const root = createRoot(document.getElementById('root') as HTMLDivElement)
root.render(<App />)
