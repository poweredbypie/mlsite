import React, { useState } from 'react'
import { Row, Col, Accordion, Button } from 'react-bootstrap'

interface LevelProps {
  n: number
  name: string
  creator: string
  points: number,
  records: [Record<any, any>]
}

const Level: React.FC<LevelProps> = ({ n, name, creator, points, records }: LevelProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Accordion>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>
          <strong>{n}. &ldquo;{name}&rdquo; by {creator}</strong>&nbsp;<em>&#40;{points} points&#41;</em>
        </Accordion.Header>
        <Accordion.Body>
        <div id="level-records">
          <ul>
          {records.map(e => (<li>{e.name} - <a href={e.link} target={"_blank"}>{e.link}</a>&nbsp;<i>({e.hertz}hz)</i></li>))}
          </ul>
        </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default Level