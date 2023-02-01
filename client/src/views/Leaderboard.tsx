import React, { useState, useEffect } from 'react'
import { getPlayers, APIManyPlayer } from '../util/withApi'
import Player from '../components/Player'
import LeaderboardInfoBox from '../components/LeaderboardInfoBox'

const Leaderboard: React.FC = () => {
  let [players, setPlayers] = useState<Array<APIManyPlayer>>([])
  let [selectedPlayerName, setSelectedPlayerName] = useState<string>(undefined)
  let [search, setSearch] = useState<string>('')
  useEffect(() => {
    getPlayers().then((p) => {
      setPlayers(p)
      setSelectedPlayerName(p[0].name)
    })
  }, [])
  return (
    <div className='rounded-box flex border-4 bg-[#f2f7ff] p-8 sm:container sm:m-12 sm:mx-auto sm:w-3/5'>
      <br />
      <div className='rounded-box max-h-[75vh] flex-grow bg-white p-4 shadow-inner'>
        <div className='flex'>
          <input
            type='text'
            placeholder='Search...'
            className='input-bordered input m-4 grow'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='h-[60vh] overflow-y-auto'>
          <table className='table-compact table w-full'>
            <tbody>
              {players.map((player, i) => (
                <Player
                  {...player}
                  show={search.length > 0 ? player.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 : true}
                  position={i + 1}
                  onSelect={() => {
                    setSelectedPlayerName(player.name)
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='divider divider-horizontal' />
      <LeaderboardInfoBox playerName={selectedPlayerName} />
    </div>
  )
}

export default Leaderboard
