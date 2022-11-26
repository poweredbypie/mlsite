import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import './style.css'

import Header from './components/Header'

const App: React.FC = () => {
  return (
    <HashRouter>
      <Header
        name='GD Mobile List'
        routes={{
          List: '/',
          About: '/about',
          AllExtremes: '/extremes',
          LevelPacks: '/packs',
          TopPlayers: '/players',
          UpdateLog: '/updates'
        }}
      />
      <Routes>
        <Route
          path='/'
          element={[]}
        />
      </Routes>
    </HashRouter>
  )
}

const root = createRoot(document.getElementById('root') as HTMLDivElement)
root.render(<App />)
