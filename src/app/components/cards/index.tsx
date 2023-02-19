import React from 'react'
import '../../assets/scss/cards.scss'
import { Text } from '@mantine/core'

type CardProps = {
  color: string
  number: string | number
  label: string
}

function Cards({color, number, label}: CardProps) {
  return (
      <div className='card-container'>
        <div className='card-body'>
          <div className='dot-color' style={{backgroundColor: color}}>
            <p style={{color: color}}>
              .
            </p>
          </div>
          <div className='card-number'>
            <Text fw={450}>
              {number}
            </Text>
            <Text fz="sm" fw={400}>
              {label}
            </Text>
          </div>
        </div>
      </div>
  )
}

export default Cards