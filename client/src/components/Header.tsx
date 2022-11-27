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

const Header: React.FC<HeaderProps> = ({ name, mainRoutes, extraRoutes }: HeaderProps) => {
  const mainTabs = ['About', 'Players', 'Submit Record']
  const extraTabs = ['All Extremes', 'Level Packs', 'Update Log']
  const navigate = useNavigate()

  return (
    <Navbar bg='light' expand='lg'>
      <Container fluid>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <strong>{name}</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
          <Nav>
            {Object.keys(mainRoutes).map((e, i) => (
              <Nav.Link
                key={`link-${i}`}
                onClick={() => {
                  navigate(mainRoutes[e])
                }}
              >
                {mainTabs[i]}
              </Nav.Link>
            ))}  
            <NavDropdown
              title='Extras'
              id='nav-dropdown'
            >
              {Object.keys(extraRoutes).map((e, i) => (
                <NavDropdown.Item
                  key={`link-${i}`}
                  onClick={() => {
                    navigate(extraRoutes[e])
                  }}
                >
                  {extraTabs[i]}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <input placeholder='search here'/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header