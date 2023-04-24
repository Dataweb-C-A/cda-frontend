import { useState, useEffect } from 'react'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'

type Props = {}

function Reports({}: Props) {
  const [users, setUsers] = useState<any>([])
  
  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  return (
    <section className='home' style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Navbar
          profiles={users}
          links={links}
          expandScreen={true}
        />
      </div>
    </section>
  )
}

export default Reports