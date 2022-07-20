import * as React from 'react'

export const Video = ({ color = '#1F1F1F' }) => (
  <svg width='24' className='fill-stroke' height='24' viewBox='0 0 24 24' fill='none'
       xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M18.3201 13.2829L17.5 12.5995V13.667V17C17.5 17.8269 16.8269 18.5 16 18.5H4C3.17314 18.5 2.5 17.8269 2.5 17V7C2.5 6.17314 3.17314 5.5 4 5.5H16C16.8269 5.5 17.5 6.17314 17.5 7V10.333V11.4005L18.3201 10.7171L21.5 8.06745V15.9325L18.3201 13.2829ZM16.002 17.5H16.5021L16.502 16.9999L16.501 12.2059L16.501 12.0009V11.9989L16.501 11.794L16.5 6.9999L16.4999 6.5H16H4H3.5V7V17V17.5H4H16.002Z'
      fill={color} stroke={color} />
  </svg>)
