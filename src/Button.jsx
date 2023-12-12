
import React from 'react'

const Button = ({ setShowStart }) => {
  return (
    <button className='w-28 h-10 flex justify-center items-center bg-secondary text-light text-xl rounded-xl' onClick={() => setShowStart(false)}>
      Start
    </button>
  )
}

export { Button }
