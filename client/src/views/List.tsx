import React, { useEffect, useRef, useState } from 'react'
import { getLevels, APIManyLevel, APIOneLevel } from '../util/withApi'
import Level from '../components/Level'
import ListInfoBox from '../components/ListInfoBox'

const List: React.FC = () => {
  let [levels, setLevels] = useState<Array<APIManyLevel>>([])
  let [selectedLevelName, setSelectedLevelName] = useState<string>(undefined)
  let [search, setSearch] = useState<string>('')
  useEffect(() => {
    getLevels().then((l) => {
      setLevels(l)
      setSelectedLevelName(l[0].name)
    })
  }, [])
  return (
    <div className='rounded-box flex w-full border-4 bg-[#f2f7ff] p-8 sm:container sm:m-12 sm:mx-auto'>
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
          {levels.map((level) => (
            <Level
              {...level}
              show={search.length > 0 ? level.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 : true}
              onSelect={() => {
                setSelectedLevelName(level.name)
              }}
            />
          ))}
        </div>
      </div>
      <div className='divider divider-horizontal' />
      <ListInfoBox {...{ levelName: selectedLevelName }} />
    </div>
  )
}

export default List
