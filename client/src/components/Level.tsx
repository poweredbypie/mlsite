import React, { useState } from 'react'
import { APIManyLevel } from '../util/withApi'

interface LevelProps extends APIManyLevel {
  onSelect: () => void
}

const Level: React.FC<LevelProps> = (props: LevelProps) => {
  const { name, creator, position, onSelect } = props

  return (
    <>
      <div
        tabIndex={0}
        className='rounded-box grid cursor-pointer border border-base-300 bg-gradient-to-r from-[#f5f7f9] to-[#d9dfe8] p-12 shadow-lg hover:shadow-2xl'
        onClick={onSelect}
      >
        <div className='text-xl'>
          <p>
            <strong>
              {position}. &ldquo;{name}&rdquo;
            </strong>
          </p>
          <p className='text-base text-secondary-content'>
            <em>{creator}</em>
          </p>

          {/* &nbsp;<em>&#40;{Math.round(100 * points) / 100} points&#41;</em> */}
        </div>
      </div>
      <br />
    </>
  )
}

export default Level
