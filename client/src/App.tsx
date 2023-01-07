import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import './style.css'

import Header from './components/Header'
import List from './views/List'

const App: React.FC = () => {
  return (
    <HashRouter>
      <Header
        name='GD Mobile List'
        mainRoutes={{
          about: '/about',
          leaderboard: '/leaderboard',
          submit: '/submit',
        }}
        extraRoutes={{
          allExtremes: '/extremes',
          levelPacks: '/packs',
          updateLog: '/updates',
        }}
      />
      <Routes>
        <Route path='/' element={<List />} />
      </Routes>
    </HashRouter>
  )
}

const root = createRoot(document.getElementById('root') as HTMLDivElement)
root.render(<App />)
