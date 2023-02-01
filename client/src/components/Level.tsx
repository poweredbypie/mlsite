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
          className='rounded-box cursor-pointer border border-base-300 bg-gradient-to-r from-[#f5f7f9] to-[#d9dfe8] p-12 shadow-lg transition-all hover:shadow-xl'
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
  )
}

export default Level
