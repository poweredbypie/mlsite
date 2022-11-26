import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  name: string
  routes: {
    [display: string]: string
  }
}

const Header: React.FC<HeaderProps> = ({ name, routes }: HeaderProps) => {
  const tabs = ['List', 'About', 'All Extremes', 'Level Packs', 'Top Players', 'Update Log']
  const navigate = useNavigate()

  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <strong>{name}</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
          <Nav>
            {Object.keys(routes).map((e, i) => (
              <Nav.Link
                key={`link-${i}`}
                onClick={() => {
                  navigate(routes[e])
                }}
              >
                {tabs[i]}
              </Nav.Link>
            ))}
            {/* <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header