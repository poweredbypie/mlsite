import React, { useState, useEffect } from 'react'
import { getLevel, APIOneLevel } from '../util/withApi'
import Records from './Records'

interface InfoBoxProps {
  levelName: string
}

const ListInfoBox: React.FC<InfoBoxProps> = (props: InfoBoxProps) => {
  let { levelName } = props
  let [level, setLevel] = useState<APIOneLevel>(undefined)
  useEffect(() => {
    levelName && getLevel(levelName).then((l) => setLevel(l))
  }, [levelName])

  return (
    <div className='rounded-box flex max-h-[75vh] w-3/5 flex-col space-y-12 overflow-y-auto bg-white p-4 py-12 shadow-inner'>
      {level && (
        <div className='grid justify-items-center gap-y-16'>
          <p className='text-4xl'>
            <strong>{level.name}</strong>
          </p>
          <div className='flex h-24 w-[85%] place-items-center justify-items-center'>
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Position</p>
              <p className='pt-2 text-center text-xl'>{level.position}</p>
            </div>
            <div className='divider divider-horizontal' />
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Creator</p>
              <p className='pt-2 text-center text-xl'>{level.creator}</p>
            </div>
            <div className='divider divider-horizontal' />
            <div className='grid flex-grow place-items-center'>
              <p className='text-center text-2xl'>Points</p>
              <p className='pt-2 text-center text-xl'>{level.points.toFixed(2)}</p>
            </div>
          </div>
          <div className='grid w-3/4 justify-items-center'>
            <p className='text-3xl'>Records</p>
            <br />
            <Records rec={level.records} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ListInfoBox
