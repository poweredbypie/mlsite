import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, ListGroup } from 'react-bootstrap'
import { getPlayer, APIOnePlayer } from '../util/withApi'

interface PlayerModalProps extends APIOnePlayer {
  show: boolean
  onClose: () => void
}

const PlayerModal: React.FC<PlayerModalProps> = (props: PlayerModalProps) => {
  const { name, points, hertz, records, mclass, show, onClose } = props
  let rrBreakdown: JSX.Element[] = []
  for (const rr of Object.keys(hertz ?? {})) {
    rrBreakdown.push(
      <ListGroup.Item as='li' key={`${name}:${rr}hz`}>
        {rr}hz: {hertz[Number(rr)]}
      </ListGroup.Item>,
    )
  }
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <h6>List Points</h6>
              <br />
              {points}
            </Col>
            <Col md={{ offset: 2 }}>
              <h6>Refresh Rate</h6>
              <br />
              <ListGroup as='ul'>{rrBreakdown}</ListGroup>
            </Col>
            <Col md={{ offset: 2 }}>
              <h6>Player Class</h6>
              <br />
              {mclass}
            </Col>
          </Row>
          <Row>
            <h5>Records</h5>
            <br />
            <ListGroup as='ul'>
              {(records ?? []).map((r) => (
                <ListGroup.Item as='li' key={`${name}:${r.level}`}>
                  <a href={r.link}>{r.level}</a>
                  &nbsp;&#40;{r.hertz}hz&#41;
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}

export default PlayerModal
