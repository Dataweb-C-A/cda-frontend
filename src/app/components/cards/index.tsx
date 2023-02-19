import React from 'react'

type CardProps = {
  color: string
  number: string | number
  label: string
}

function Cards({color, number, label}: CardProps) {
  return (
    <div className='card-container'>
      <div className='card-body'>
        <p>
          .
          <div className='dot-color'>{color}</div>
        </p>
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