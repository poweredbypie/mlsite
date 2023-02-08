interface APIRecordBase {
  hertz: number
  link: string
  id?: any
}

export interface APILevelRecord extends APIRecordBase {
  player: string
}

export interface APIPlayerRecord extends APIRecordBase {
  level: string
}

export interface APIManyLevel {
  name: string
  creator: string
  position: number
  points: number
  id?: any
}

export interface APIOneLevel extends APIManyLevel {
  records: APILevelRecord[]
}

export interface APIManyPlayer {
  name: string
  points: number
}

export interface APIOnePlayer extends APIManyPlayer {
  hertz: {
    [rr: number]: number
  }
  mclass: string
  records: APIPlayerRecord[]
}

export interface APILog {
  date: string
  content: string
  type: number
}

interface RecordSubmission {
  player: string
  level: string
  hertz: number
  link: string
}

export const getLevels = async (): Promise<APIManyLevel[]> => {
  return fetch(`/levels`).then((data) => data.json())
}

export const getLevel = async (name: string): Promise<APIOneLevel> => {
  return fetch(`/levels/${name}`).then((data) => data.json())
}

export const getPlayers = async (): Promise<APIManyPlayer[]> => {
  return fetch(`/players`).then((data) => data.json())
}

export const getPlayer = async (name: string): Promise<APIOnePlayer> => {
  return fetch(`/players/${name}`).then((data) => data.json())
}

export const getLogs = async (): Promise<APILog[]> => {
  return fetch(`/logs`).then((data) => data.json())
}

export const submitRecord = async (record: RecordSubmission): Promise<Response> => {
  return fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  })
}
