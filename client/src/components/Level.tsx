import React, { useState } from 'react'
import { APIManyLevel } from '../util/withApi'

interface LevelProps extends APIManyLevel {
  show: boolean
  onSelect: () => void
}

const Level: React.FC<LevelProps> = (props: LevelProps) => {
  const { name, creator, position, show, onSelect } = props

  return (
    show && (
      <>
        <div
          tabIndex={0}
          className='rounded-box border-base-300 cursor-pointer border bg-white p-12 shadow-lg transition-all hover:shadow-xl'
          onClick={onSelect}
        >
          <div className='text-xl'>
            <p>
              <strong>
                {position}. &ldquo;{name}&rdquo;
              </strong>
            </p>
            <p className='text-secondary-content text-base'>
              <em>{creator}</em>
            </p>

            {/* &nbsp;<em>&#40;{Math.round(100 * points) / 100} points&#41;</em> */}
          </div>
        </div>
        <br />
      </>
    )
  )
}

export default Level
