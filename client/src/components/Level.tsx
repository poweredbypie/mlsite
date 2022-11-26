import React, { useState } from 'react'
import { Row, Col, Collapse, Button } from 'react-bootstrap'

interface LevelProps {
  n: number
  name: string
  creator: string
  points: number
}

const Level: React.FC<LevelProps> = ({ n, name, creator, points }: LevelProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Row>
      <Col
        className='level-card'
        onClick={() => setOpen(!open)}
        aria-controls="level-records"
        aria-expanded={open}
      >
        <strong>{n}. &ldquo;{name}&rdquo; by {creator}</strong> <em>&#40;{points} points&#41;</em>
      </Col>
      <Collapse in={open}>
        <div id="level-records">
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
          terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
          labore wes anderson cred nesciunt sapiente ea proident.
        </div>
      </Collapse>
    </Row>
  )
}

export default Level