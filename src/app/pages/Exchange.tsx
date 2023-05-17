import { useState, useEffect } from 'react'
import axios from 'axios'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'

interface IExchange {}

function Exchange({}: IExchange) {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setProfiles(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  return (
    <Navbar profiles={profiles} links={links} />
  )
}

export default Exchange