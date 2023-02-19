import React from 'react'
import '../../assets/scss/cards.scss'

type CardProps = {
  color: string
  number: string | number
  label: string
}

function Cards({color, number, label}: CardProps) {
  return (
    <div className='card-container'>
      <div className='card-body'>
          <div className='dot-color' style={{backgroundColor: color}} >
            <p style={{color: color}} >
              .
            </p>
          </div>
        <h5>
          <div className='card-number'>{number}</div>
        </h5>
        <p>
          <div className='card-label'>{label}</div>
        </p>
      </div>
    </div>
  )
}

export default Cards