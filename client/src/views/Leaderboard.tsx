import React, { useState, useEffect } from 'react'
import { getPlayers, getPlayer, APIManyPlayer, APIOnePlayer } from '../util/withApi'
import Player from '../components/Player'
import LeaderboardInfoBox from '../components/LeaderboardInfoBox'

const Leaderboard: React.FC = () => {
  let [players, setPlayers] = useState<Array<APIManyPlayer>>([])
  let [selectedPlayerName, setSelectedPlayerName] = useState<string>(undefined)
  useEffect(() => {
    getPlayers().then((p) => setPlayers(p))
  }, [])
  return (
    <div className='fixed -z-50 h-screen w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100 via-blue-300 to-blue-500'>
      <div className='rounded-box flex border-4 bg-[#f2f7ff] p-8 sm:container sm:m-12 sm:mx-auto sm:w-3/5'>
        <br />
        <br />
        <div className='rounded-box grid max-h-[75vh] flex-grow overflow-y-auto bg-white p-4 shadow-inner'>
          <table className='table-compact table w-full'>
            <tbody>
              {players.map((player, i) => (
                <Player
                  {...player}
                  position={i + 1}
                  onSelect={() => {
                    setSelectedPlayerName(player.name)
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className='divider divider-horizontal' />
        <LeaderboardInfoBox {...{ playerName: selectedPlayerName }} />
      </div>
    </div>
  )
}

export default Leaderboard
