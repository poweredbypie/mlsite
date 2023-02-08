import React, { useState, useEffect } from 'react'
import { getLogs, APILog } from '../util/withApi'

const UpdateLog: React.FC = () => {
  let [logs, setLogs] = useState<Array<APILog>>([])
  useEffect(() => {
    getLogs().then((l) => setLogs(l))
  }, [])

  return (
    <div>
      {logs.map((log) => (
        <p>
          {log.date} - {log.content} - {log.type}
        </p>
      ))}
    </div>
  )
}

export default UpdateLog
