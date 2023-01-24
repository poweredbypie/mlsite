import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  name: string
  mainRoutes: {
    [display: string]: string
  }
  extraRoutes: {
    [display: string]: string
  }
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { name, mainRoutes, extraRoutes } = props
  const mainTabs = ['About', 'Leaderboard', 'Submit Record']
  const extraTabs = ['All Extremes', 'Level Packs', 'Update Log']
  const navigate = useNavigate()

  // bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-blue-300 to-blue-500

  return (
    <div className='navbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-200 pr-12'>
      <div className='flex-1' onClick={() => navigate('/')}>
        <a className='btn-ghost btn text-xl normal-case'>{name}</a>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          {Object.keys(mainRoutes).map((e, i) => (
            <li
              key={`link-${i}`}
              onClick={() => {
                navigate(mainRoutes[e])
              }}
            >
              <a>{mainTabs[i]}</a>
            </li>
          ))}
          <li id='nav-dropdown' tabIndex={0}>
            <a>
              Extras
              <svg
                className='fill-current'
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
              >
                <path d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z' />
              </svg>
            </a>
            <ul className='bg-primary-content p-2'>
              {Object.keys(extraRoutes).map((e, i) => (
                <li
                  key={`link-${i}`}
                  onClick={() => {
                    navigate(extraRoutes[e])
                  }}
                >
                  <a>{extraTabs[i]}</a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header
