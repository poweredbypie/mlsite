import React, { useState, useEffect } from 'react'
import { HiInformationCircle } from 'react-icons/hi'
import { getLevels, getPlayers, APIManyLevel, APIManyPlayer } from '../util/withApi'

const SubmitRecord: React.FC = () => {
  let [levels, setLevels] = useState<Array<APIManyLevel>>([])
  let [players, setPlayers] = useState<Array<APIManyPlayer>>([])
  let [level, setLevel] = useState<string>('')
  let [player, setPlayer] = useState<string>('')
  let [hertz, setHertz] = useState<number>(60)
  let [link, setLink] = useState<string>('')

  useEffect(() => {
    getLevels().then((l) => setLevels(l))
    getPlayers().then((p) => setPlayers(p))
  }, [])

  return (
    <div className='fixed -z-50 h-screen w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100 via-blue-300 to-blue-500'>
      <div className='rounded-box place-content-center border-4 bg-[#f2f7ff] p-8 sm:container sm:mx-auto sm:mt-36 sm:w-1/3'>
        <div className='form-control self-center'>
          <HiInformationCircle className='place-self-end' />
          <h3 className='text-center text-2xl'>Submit a Record</h3>
          <br />
          <label className='input-group place-content-center'>
            <span>Player</span>
            <input
              type='text'
              className='input-bordered input focus:outline-0'
              onChange={(e) => setPlayer(e.target.value)}
              placeholder='. . .'
            />
          </label>
          <br />
          <label className='input-group place-content-center'>
            <span>Level</span>
            <input
              type='text'
              className='input-bordered input focus:outline-0'
              onChange={(e) => setLevel(e.target.value)}
              placeholder='. . .'
            />
          </label>
          <br />
          <label className='input-group place-content-center'>
            <span>Refresh Rate</span>
            <input
              type='number'
              className='input-bordered input w-48 focus:outline-0'
              onChange={(e) => setHertz(Number(e.target.value))}
              placeholder='. . .'
            />
            <span>Hz</span>
          </label>
          <br />
          <label className='input-group place-content-center'>
            <span>Link</span>
            <input
              type='text'
              className='input-bordered input focus:outline-0'
              onChange={(e) => setLink(e.target.value)}
              placeholder='. . .'
            />
          </label>
          <br />
          <button className='btn '>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default SubmitRecord
