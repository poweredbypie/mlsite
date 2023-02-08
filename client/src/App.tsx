import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import './style.css'

import Header from './components/Header'
import List from './views/List'
import Leaderboard from './views/Leaderboard'
import SubmitRecord from './views/SubmitRecord'
import About from './views/About'
import UpdateLog from './views/UpdateLog'

const App: React.FC = () => {
  return (
    <>
      <div className='fixed -z-50 h-screen w-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-gray-400 via-gray-600 to-blue-800' />
      <HashRouter>
        <Header
          name='GD Mobile List'
          routes={{
            about: '/about',
            leaderboard: '/leaderboard',
            log: '/log',
            submit: '/submit',
          }}
        />
        <Routes>
          <Route path='/' element={<List />} />
          <Route path='/about' element={<About />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/submit' element={<SubmitRecord />} />
        </Routes>
      </HashRouter>
    </>
  )
}

const root = createRoot(document.getElementById('root') as HTMLDivElement)
root.render(<App />)
