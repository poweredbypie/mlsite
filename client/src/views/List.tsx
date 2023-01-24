import React, { useEffect, useRef, useState } from 'react'
import { getLevels, APIManyLevel, APIOneLevel } from '../util/withApi'
import Level from '../components/Level'
import ListInfoBox from '../components/ListInfoBox'

const List: React.FC = () => {
  let [levels, setLevels] = useState<Array<APIManyLevel>>([])
  let [selectedLevelName, setSelectedLevelName] = useState<string>(undefined)
  useEffect(() => {
    getLevels().then((l) => setLevels(l))
  }, [])
  return (
    <div className='fixed -z-50 h-screen w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100 via-blue-300 to-blue-500'>
      <div className='rounded-box flex w-full border-4 bg-[#f2f7ff] p-8 sm:container sm:m-12 sm:mx-auto'>
        <br />
        <div className='rounded-box grid max-h-[75vh] flex-grow overflow-y-auto bg-white p-4 shadow-inner'>
          {levels.map((level) => (
            <Level
              {...level}
              onSelect={() => {
                setSelectedLevelName(level.name)
              }}
            />
          ))}
        </div>
        <div className='divider divider-horizontal' />
        <ListInfoBox {...{ levelName: selectedLevelName }} />
      </div>
    </div>
  )
}

export default List
