import React, { useState, useEffect, useTransition, lazy } from 'react'
import { APIManyPlayer } from '../util/withApi'
import PlayerModal from './PlayerModal'

interface PlayerProps extends APIManyPlayer {
  position: number
  onSelect: () => void
}

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { name, points, position, onSelect } = props

  return (
    <>
      <tr className='hover cursor-pointer' onClick={onSelect}>
        <td>
          {position}. {name}
          &nbsp;<em>{Math.round(100 * points) / 100}</em>
        </td>
      </tr>
    </>
  )
}

export default Player
