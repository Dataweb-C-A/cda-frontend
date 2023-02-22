import React from 'react'
import '../../assets/scss/cards.scss'
import { Card, Text } from '@mantine/core'

type CardProps = {
  color: string
  number: string | number
  label: string
  right: string | number | 0
  left: string | number | 0
}

function Cards({color, number, label, right, left}: CardProps) {
  return (
    <>
      <div className='card-container' style={{ marginLeft: left, marginRight: right }}>
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
            <Text fz="sm" fw={400} c="rgb(108, 117, 125)">
              {label}
            </Text>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cards