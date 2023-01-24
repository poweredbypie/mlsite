import React, { useState, useEffect } from 'react'
import { getPlayer, APIOnePlayer } from '../util/withApi'

interface InfoBoxProps {
  playerName: string
}

const LeaderboardInfoBox: React.FC<InfoBoxProps> = (props: InfoBoxProps) => {
  let { playerName } = props
  let [player, setPlayer] = useState<APIOnePlayer>(undefined)
  useEffect(() => {
    getPlayer(playerName).then((p) => setPlayer(p))
  }, [playerName])

  return (
    <div className='rounded-box grid max-h-[75vh] w-3/5 place-items-center overflow-y-auto bg-white p-4 shadow-inner'>
      {player === undefined ? (
        <>Select a player to get started</>
      ) : (
        <>
          <p className='text-xl'>{player?.name}</p>
          <p className='text-base'>
            <em>{player?.points}</em>
          </p>
          <ul>
            <ul>
              {player?.records.map((r) => (
                <li>
                  <a href={r.link} target={'_blank'}>
                    {r.level}
                  </a>
                  &nbsp;<i>&#40;{r.hertz}hz&#41;</i>
                </li>
              ))}
            </ul>
          </ul>
        </>
      )}
    </div>
  )
}

export default LeaderboardInfoBox
