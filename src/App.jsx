import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { Button } from './Button'
import { Circle } from './Circle'



function App() {

  const [showStart, setShowStart] = useState(true);

  return (
    <section className='bg-main w-[100vw] h-[100vh] flex justify-center items-center'>
      {
        showStart && <Button setShowStart={setShowStart} />
      }

      {
        !showStart && <Circle setShowStart={setShowStart} />
      }

    </section>
  )
}

export default App
