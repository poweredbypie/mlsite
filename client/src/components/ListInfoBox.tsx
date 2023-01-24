import React, { useState, useEffect } from 'react'
import { getLevel, APIOneLevel } from '../util/withApi'

interface InfoBoxProps {
  levelName: string
}

const ListInfoBox: React.FC<InfoBoxProps> = (props: InfoBoxProps) => {
  let { levelName } = props
  let [level, setLevel] = useState<APIOneLevel>(undefined)
  useEffect(() => {
    getLevel(levelName).then((l) => setLevel(l))
  }, [levelName])

  return (
    <div className='rounded-box flex max-h-[75vh] w-1/2 flex-col space-y-12 overflow-y-auto bg-white p-4 py-12 shadow-inner'>
      {level === undefined ? (
        <>Welcome to the mobile list blah blah blah</>
      ) : (
        <>
          <p className='mx-auto text-center text-4xl'>
            <strong>{level.name}</strong>
          </p>
          <div className='mx-auto flex h-24 w-[85%] place-items-center'>
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Position</p>
              <p className='pt-2 text-center text-xl'>&#35;{level.position}</p>
            </div>
            <div className='divider divider-horizontal' />
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Creator</p>
              <p className='pt-2 text-center text-xl'>{level.creator}</p>
            </div>
            <div className='divider divider-horizontal' />
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Points</p>
              <p className='pt-2 text-center text-xl'>{Math.round(100 * level.points) / 100}</p>
            </div>
          </div>
          <div className='mx-auto'>
            <p className='text-2xl'></p>
            <ul>
              {level.records.map((r) => (
                <li>
                  <a href={r.link} target={'_blank'}>
                    {r.player}
                  </a>
                  &nbsp;<i>&#40;{r.hertz}hz&#41;</i>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default ListInfoBox
