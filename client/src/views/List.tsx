import React, { useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import Level from '../components/Level'

interface APILevel {
  name: string,
  creators: string,
  records: [{
    name: string,
    link: string,
    hertz: number
  }]
}

const List: React.FC = () => {

  const [levels, setLevels] = useState<Array<APILevel>>([])
useEffect(() => {
const api = async () => {
    let data = await fetch("/levels")
    let json: APILevel[] = await data.json()
    setLevels(json)
  }
  api()
}, [])

let rows: any = []
for(let i = 0; i < levels.length; i++) {
  let points: number = (2250/((0.37*(i+1))+9)) - 40
  rows.push(<Level
    n={i+1}
    name={levels[i].name}
    creator={levels[i].creators}
    points={Math.round(100*points)/100}
    records={levels[i].records}
  />)
  rows.push(<br></br>)
}


  return (
    <Container>
      <br></br>
      {rows}
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </Container>
  )
}

export default List