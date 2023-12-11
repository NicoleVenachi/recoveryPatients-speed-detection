import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { Button } from './Button'
import { Circle } from './Circle'



function App() {

  return (
    <section className='bg-main w-[100vw] h-[100vh] flex justify-center items-center'>
      {/* <Button /> */}
      <Circle />
    </section>
  )
}

export default App
