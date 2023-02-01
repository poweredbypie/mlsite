import React, { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import { HiInformationCircle } from 'react-icons/hi'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { getLevels, getPlayers, APIManyLevel, APIManyPlayer, submitRecord } from '../util/withApi'
import RenderTime from '../partials/RenderTime'

const SubmitRecord: React.FC = () => {
  let [levels, setLevels] = useState<Array<APIManyLevel>>([])
  let [players, setPlayers] = useState<Array<APIManyPlayer>>([])
  let [level, setLevel] = useState<string>('')
  let [player, setPlayer] = useState<string>('')
  let [hertz, setHertz] = useState<number>(60)
  let [link, setLink] = useState<string>('')
  let [submitStatus, setSubmitStatus] = useState<number>(undefined)
  let [disabled, setDisabled] = useState<boolean>(false)

  useEffect(() => {
    getLevels().then((l) => setLevels(l))
    getPlayers().then((p) => setPlayers(p))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setSubmitStatus(undefined)
    }, 5000)
  }, [submitStatus])

  useEffect(() => {
    setTimeout(() => {
      setDisabled(false)
    }, 62000)
  }, [disabled])

  return (
    <div className='rounded-box place-content-center border-4 bg-[#f2f7ff] p-8 sm:container sm:mx-auto sm:mt-36 sm:w-1/3'>
      <div className='form-control self-center'>
        <div className='grid justify-items-center text-2xl'>
          <p>Submit a Record</p>
        </div>
        <br />
        <label className='input-group place-content-center'>
          <span>Player</span>
          <CreatableSelect
            className='z-50 w-48'
            name='playerSelect'
            options={players.map((p) => ({ value: p.name, label: p.name }))}
            onChange={(e) => setPlayer(e.value)}
            isSearchable
            openMenuOnClick={false}
            placeholder='. . .'
            styles={{
              indicatorSeparator: (baseStyles, state) => ({
                visibility: 'hidden',
              }),
            }}
          />
        </label>
        <br />
        <label className='input-group place-content-center'>
          <span>Level</span>
          <CreatableSelect
            className='z-40 w-48'
            name='levelSelect'
            options={levels.map((l) => ({ value: l.name, label: l.name }))}
            onChange={(e) => setLevel(e.value)}
            isSearchable
            openMenuOnClick={false}
            placeholder='. . .'
            styles={{
              indicatorSeparator: (baseStyles, state) => ({
                visibility: 'hidden',
              }),
            }}
          />
        </label>
        <br />
        <label className='input-group place-content-center'>
          <input
            type='text'
            className='input-bordered input h-9 w-24 focus:outline-0'
            onChange={(e) => setHertz(Number(e.target.value))}
            placeholder='. . .'
          />
          <span>hz</span>
        </label>
        <br />
        <label className='input-group place-content-center'>
          <span>Video Link</span>
          <input
            type='text'
            className='input-bordered input h-9 w-72 focus:outline-0'
            onChange={(e) => setLink(e.target.value)}
            placeholder='. . .'
          />
        </label>
        <br />
        <div className='flex justify-center'>
          <button
            className='btn-outline btn w-36 disabled:btn-disabled'
            disabled={disabled}
            onClick={() => {
              submitRecord({ player, level, hertz, link })
                .then((data) => setSubmitStatus(data.status))
                .then(() => setDisabled(true))
            }}
          >
            Submit
          </button>
          <div className={`w-0 transition-all duration-1000 ${disabled ? 'w-4' : ''}`} />
          <div className={`opacity-0 transition-opacity duration-1000 ${disabled ? 'opacity-100' : ''}`}>
            {disabled && (
              <CountdownCircleTimer
                isPlaying
                duration={60}
                colors={['#000000', '##000000', '#000000', '#000000']}
                colorsTime={[60, 30, 10, 0]}
                size={50}
                strokeWidth={4}
              >
                {RenderTime}
              </CountdownCircleTimer>
            )}
          </div>
        </div>
        <br />
        {submitStatus === 201 && (
          <div className='alert alert-success shadow-lg'>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 flex-shrink-0 stroke-current'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>Record was submitted</span>
            </div>
          </div>
        )}
        {submitStatus === 409 && (
          <div className='alert alert-warning shadow-lg'>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 flex-shrink-0 stroke-current'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
              <span>Record already added</span>
            </div>
          </div>
        )}
        {(submitStatus === 500 || submitStatus === 503) && (
          <div className='alert alert-error shadow-lg'>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 flex-shrink-0 stroke-current'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>Server unavailable, try again later</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubmitRecord
