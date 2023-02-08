import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiMenu } from 'react-icons/hi'

interface HeaderProps {
  name: string
  routes: {
    [display: string]: string
  }
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { name, routes } = props
  const tabs = ['About', 'Leaderboard', 'Submit Record']
  let [show, setShow] = useState<boolean>(false)
  const navigate = useNavigate()

  // bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-blue-300 to-blue-500

  return (
    <div className='navbar bg-slate-700 pr-12' id='nav'>
      <div className='flex-1' onClick={() => navigate('/')}>
        <a className='btn-ghost btn text-xl normal-case text-white'>{name}</a>
      </div>
      {window.innerWidth > 640 ? (
        <div className='flex-none'>
          <ul className='menu menu-horizontal px-1'>
            {Object.keys(routes).map((r, i) => (
              <li
                key={`link-${i}`}
                onClick={() => {
                  navigate(routes[r])
                }}
              >
                <a className='text-white'>{tabs[i]}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='flex-none'>
          <div className='dropdown-end dropdown' onClick={() => setShow(!show)}>
            <label tabIndex={0} className='btn-ghost btn'>
              <HiMenu size={30} />
            </label>
            <ul tabIndex={0} className='z-60 dropdown-content menu rounded-box bg-white' hidden={!show}>
              {Object.keys(routes).map((r, i) => (
                <li
                  key={`link-${i}`}
                  onClick={() => {
                    navigate(routes[r])
                    setShow(false)
                  }}
                >
                  <a className='text-white'>{tabs[i]}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
