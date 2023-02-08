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
        <a className='btn-ghost btn text-xl text-white normal-case'>{name}</a>
      </div>
      { window.innerWidth > 640 ? (
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
          <div className='dropdown dropdown-end' onClick={() => setShow(!show)}>
            <label tabIndex={0} className='btn btn-ghost'>
              <HiMenu size={30}/>
            </label>
            <ul tabIndex={0} className='menu dropdown-content rounded-box bg-white z-60' hidden={!show}>
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
