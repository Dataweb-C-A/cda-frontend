import { useState, useEffect } from 'react'
import Navbar from "../components/navbar"
import { links } from "../assets/data/links"
import axios from 'axios'

type Props = {}

function Riferos({}: Props) {
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
  }, [setUsers])

  return (
    <section className="riferos">
      <Navbar
        profiles={users}
        links={links}
      />
    </section>
  )
}

export default Riferos