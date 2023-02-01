import React from 'react'
import { HiExternalLink } from 'react-icons/hi'

interface Record {
  hertz: number
  link: string
  player?: string
  level?: string
}

interface RecordsProps {
  rec: Record[]
}

const Records: React.FC<RecordsProps> = (props: RecordsProps) => {
  const { rec } = props

  return (
    <table className='table-zebra table-compact table w-full'>
      <tbody>
        {rec.map((r) => (
          <tr>
            <td className={`text-center text-lg ${r.hertz === 60 ? 'font-semibold' : ''}`}>{r.player ?? r.level}</td>
            <td className={`text-center text-lg ${r.hertz === 60 ? 'font-semibold' : ''}`}>{r.hertz}hz</td>
            <td>
              <a href={r.link} target={'_blank'} className='btn-ghost btn-square btn-sm btn'>
                <HiExternalLink />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Records
