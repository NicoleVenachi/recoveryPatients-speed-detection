
import React from 'react'

const Button = ({ setShowStart }) => {
  return (
    <button className='w-36 h-12 flex justify-center items-center bg-secondary text-light text-2xl font-bold tracking-wider rounded-xl box-shadow ' onClick={() => setShowStart(false)}>
      Start
    </button>
  )
}

export { Button }
