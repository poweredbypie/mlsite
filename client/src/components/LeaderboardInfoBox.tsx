import React, { useState, useEffect } from 'react'
import { getPlayer, APIOnePlayer } from '../util/withApi'
import Records from './Records'

interface InfoBoxProps {
  playerName: string
}

const LeaderboardInfoBox: React.FC<InfoBoxProps> = (props: InfoBoxProps) => {
  let { playerName } = props
  let [player, setPlayer] = useState<APIOnePlayer>(undefined)
  // let [breakdownRR, setBreakdownRR] = useState<Array<JSX.Element>>([])
  useEffect(() => {
    playerName && getPlayer(playerName).then((p) => setPlayer(p))
    // .then(() => {
    // let rrs: JSX.Element[] = []
    // for (const rr of Object.keys(player.hertz)) {
    //   rrs.push(
    //     <tr>
    //       <td className={`text-center ${rr === '60' ? 'font-semibold' : ''}`}>{rr}</td>
    //       <td className={`text-center ${rr === '60' ? 'font-semibold' : ''}`}>{player.hertz[Number(rr)].toString()}</td>
    //     </tr>,
    //   )
    //   setBreakdownRR(rrs)
    // }
    // })
  }, [playerName])

  return (
    <div className='rounded-box flex max-h-[75vh] w-3/5 flex-col space-y-12 overflow-y-auto bg-white p-4 py-12 shadow-inner'>
      {player && (
        <div className='grid justify-items-center gap-y-16'>
          <p className='text-4xl'>
            <strong>{player.name}</strong>
          </p>
          <div className='flex h-24 w-[85%] place-items-center justify-items-center'>
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Class</p>
              <p className='pt-2 text-center text-xl'>{player.mclass}</p>
            </div>
            {/* <div className='divider divider-horizontal' />
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Hertz</p>
              <table className='table-compact table'>
                <tbody>{breakdownRR}</tbody>
              </table>
            </div> */}
            <div className='divider divider-horizontal' />
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Points</p>
              <p className='pt-2 text-center text-xl'>{player.points.toFixed(2)}</p>
            </div>
          </div>
          <div className='grid w-3/4 justify-items-center'>
            <p className='text-3xl'>Records</p>
            <br />
            <Records rec={player.records.sort((a, b) => a.level.localeCompare(b.level))} />
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaderboardInfoBox
