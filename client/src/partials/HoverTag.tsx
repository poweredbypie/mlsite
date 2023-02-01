import React, { useState } from 'react'

interface HoverTagProps {
  username: string
  discriminator: number
}

const HoverTag: React.FC<HoverTagProps> = (props: HoverTagProps) => {
  const { username, discriminator } = props
  let [hover, setHover] = useState<boolean>(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        navigator.clipboard.writeText(`${username}#${discriminator}`)
      }}
    ></div>
  )
}

export default HoverTag
