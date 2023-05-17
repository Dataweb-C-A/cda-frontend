import { useState, useEffect } from 'react'
import axios from 'axios'
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import { Card, Grid } from '@mantine/core'

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
    <>
      <Navbar profiles={profiles} links={links} />
      <Grid mx={3} mt={5}>
        <Grid.Col xs={12} md={6} lg={4}>
          <Card shadow="sm" radius="sm">
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} md={6} lg={4}>
          <Card shadow="sm" radius="sm">
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} md={6} lg={4}>
          <Card shadow="sm" radius="sm">
          </Card>
        </Grid.Col>
      </Grid>
      <Card shadow="sm" radius="sm" mx={10} mt={15} h="100vh">
      </Card>
    </>
  )
}

export default Exchange