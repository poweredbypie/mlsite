import React, { ReactNode } from 'react'
import { TimeProps } from 'react-countdown-circle-timer'

const RenderTime = (props: TimeProps): ReactNode => {
  let { remainingTime } = props

  return (
    <div className='relative text-lg'>
      <div className='absolute flex h-full w-full items-center justify-center'>{remainingTime}</div>
    </div>
  )
}

export default RenderTime
