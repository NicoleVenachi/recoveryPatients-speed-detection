import React, { useEffect, useRef } from 'react'
import Hammer from 'react-hammerjs'
import $ from 'jquery';



const Circle = () => {

  const mouseRef = useRef(null);

  const startMove = (ev) => {
    // console.log(ev);

    const { x, y } = ev.center;

    console.log(x, y);

    let clientX = 10
    let clientY = 10

    console.log(mouseRef);
    // mouseRef.current.style.setProperty("--x", `${clientX}px`);
    // mouseRef.current.style.setProperty("--y", `${clientY + window.scrollY}px`); //le agrego el valor que se ha scroleado
  }


  const stopMove = (ev) => {
    console.log(ev);
  }

  useEffect(() => {


  }, [])
  return (
    <div className='w-[250px] h-[250px] flex items-center justify-center'>
      <div
        className='w-[200px] h-[200px] rounded-[50%] border-2 border-dashed border-light border-opacity-5 shadow-[0_0_100px_rgba(30,144,255,0.2)]  relative'

      // shadow-[0_0_50px_rgba(30,144,255,0.5)] shadow-secondary/50 shadow-2xl'
      >
        <div className='absolute bottom-[calc(0px-15px)] left-[calc(50%-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'>
          <p> 1 </p>
        </div>

        <div className='absolute bottom-[calc(50%-15px)] left-[calc(0px-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'>
          <p> 2 </p>
        </div>

        <div className='absolute bottom-[calc(100%-15px)] left-[calc(50%-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'>
          <p> 3 </p>
        </div>

        <div className='absolute bottom-[calc(50%-15px)] left-[calc(100%-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'>
          <p> 4 </p>
        </div>

        <Hammer onPan={startMove} onPanEnd={stopMove}>
          <div
            className='absolute bottom-[calc(0px-15px)] left-[calc(50%-15px)] w-[30px] h-[30px] rounded-[50%] layout'

            ref={mouseRef}
          // bg-secondary/80 flex items-center justify-center text-light box-shadow layout'
          >
          </div>
        </Hammer>

      </div>
    </div>

  )
}

export { Circle }
