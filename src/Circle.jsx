import React, { useEffect, useReducer, useRef, useState } from 'react'
import Hammer from 'react-hammerjs'
import $ from 'jquery';
import Swal from 'sweetalert2';


const initialPath = {
  first: false,
  second: false,
  third: false,
  fourth: false,

  restarted: false,
}
const Circle = ({ setShowStart }) => {

  // const mouseRef = useRef(null);
  // al pasar ref a un element connected component, será null, pr eso con jquery modificamos el DOM

  const [windowSize, setWindowSize] = useState(getWindowSize()); //to get size even on resize

  const [initialPoints, setInitialPoints] = useState({
    top: 0,
    left: 0,
  })

  const [pathState, dispatch] = useReducer(reducer, initialPath);

  const errorDetected = () => {

    dispatch({ type: 'error' })

    $("#pointRef").removeClass("layout")
    $("#pointRef").offset({ top: initialPoints.top, left: initialPoints.left });

    Swal.fire('Error!', 'Invalid path', 'error')

  }

  const pathFinished = () => {

    $("#pointRef").removeClass("layout")
    $("#pointRef").offset({ top: initialPoints.top, left: initialPoints.left });

    Swal.fire('Finished!', 'Valid data', 'success');
    setShowStart(true);

  }


  const moving = (ev) => {
    // console.log(ev);

    const { x, y } = ev.center;

    if (pathState.restart) {
      return void 0; // salir si hubo error
    }
    if (x == 0 || y == 0) { // fixing bugss
      stopMove(ev);
      return void 0;
    }


    //logica para detectar cuando entra a los botones y cambiar ele stado en consecuencia
    if ((x > ((windowSize.innerWidth / 2) - 15 - 100) && x < ((windowSize.innerWidth / 2) + 15 - 100)) && (y > ((windowSize.innerHeight / 2) - 15) && y < ((windowSize.innerHeight / 2) + 15))) {

      if (!pathState.second) {
        dispatch({ 'type': 'second' })
      }
      // console.log(pathState);
      if (pathState.third || pathState.fourth) {
        errorDetected();

      }
    }

    if ((x > ((windowSize.innerWidth / 2) - 15) && x < ((windowSize.innerWidth / 2) + 15)) && (y > ((windowSize.innerHeight / 2) - 15 - 100) && y < ((windowSize.innerHeight / 2) + 15 - 100))) {

      if (pathState.second && !pathState.third) {
        dispatch({ 'type': 'third' })
      }

      if (pathState.fourth || (!pathState.first && !pathState.second && !pathState.third && !pathState.fourth)) {
        errorDetected();
      }
    }


    if ((x > ((windowSize.innerWidth / 2) - 15 + 100) && x < ((windowSize.innerWidth / 2) + 15 + 100)) && (y > ((windowSize.innerHeight / 2) - 15) && y < ((windowSize.innerHeight / 2) + 15))) {

      if (pathState.second && pathState.third && !pathState.fourth) {
        dispatch({ 'type': 'fourth' })
      }

      if ((pathState.second && !pathState.third) || (!pathState.first && !pathState.second && !pathState.third && !pathState.fourth)) {
        errorDetected();
      }
    }


    if ((x > ((windowSize.innerWidth / 2) - 15) && x < ((windowSize.innerWidth / 2) + 15)) && (y > ((windowSize.innerHeight / 2) - 15 + 100) && y < ((windowSize.innerHeight / 2) + 15) + 100)) {

      if (pathState.second && pathState.third && pathState.fourth && !pathState.first) {
        dispatch({ 'type': 'first' });
        pathFinished();
      }
      else if ((pathState.second && (!pathState.third || !pathState.fourth)) || (pathState.third && !pathState.fourth)) {
        errorDetected();
      }
    }

    $("#pointRef").offset({ top: y - 15, left: x - 15 });
  }

  const startMove = (ev) => {
    $("#pointRef").addClass("layout")
    console.log(ev.center);

    $("#pointRef").offset({ top: initialPoints.top, left: initialPoints.left });


    dispatch({ type: 'restart' }) // set restart again on false, to allow movement

  }
  const stopMove = (ev) => {

    // console.log(windowSize);

    $("#pointRef").removeClass("layout");
    $("#pointRef").offset({ top: initialPoints.top, left: initialPoints.left });

  }

  useEffect(() => {
    // console.log('mounted', pathState);

    setInitialPoints({ top: (windowSize.innerHeight / 2) - 16.5 + 100, left: (windowSize.innerWidth / 2) - 15.2 });
    function handleWindowResize() {
      setWindowSize(getWindowSize());

      setInitialPoints({ top: (windowSize.innerHeight / 2) - 16.5 + 100, left: (windowSize.innerWidth / 2) - 15.2 });
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      // console.log('unmounted', pathState);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className='w-[100vw] h-[100vh] flex items-center justify-center'>
      <div
        className='w-[200px] h-[200px] rounded-[50%] border-2 border-dashed border-light border-opacity-5 shadow-[0_0_100px_rgba(30,144,255,0.2)]  relative'

      // shadow-[0_0_50px_rgba(30,144,255,0.5)] shadow-secondary/50 shadow-2xl'
      >
        <div className='absolute bottom-[calc(0px-15px)] left-[calc(50%-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'
        >
          <p> 1 </p>
        </div>

        <div className='absolute bottom-[calc(50%-15px)] left-[calc(0px-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'>
          <p> 2 </p>
        </div>

        <div className='absolute bottom-[calc(100%-15px)] left-[calc(50%-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'>
          <p> 3 </p>
        </div>

        <div className='absolute bottom-[calc(50%-15px)] left-[calc(100%-15px)] w-[30px] h-[30px] rounded-[50%] bg-secondary/80 flex items-center justify-center text-light box-shadow'

        >
          <p> 4 </p>
        </div>

        <Hammer onPan={moving} onPanEnd={stopMove} onPanStart={startMove}>
          <div
            id='pointRef'
            // ref={mouseRef}
            className='absolute bottom-[calc(0px-15px)] left-[calc(50%-15px)] w-[30px] h-[30px] rounded-[50%] '
          >
          </div>
        </Hammer>

      </div>
    </div>

  )
}

export { Circle }


function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

function reducer(state, action) {
  switch (action.type) {
    case 'first': {
      return {
        ...state,
        first: true
      };
    }
    case 'second': {
      return {
        ...state,
        second: true
      };
    }
    case 'third': {
      return {
        ...state,
        third: true
      };
    }
    case 'fourth': {
      return {
        ...state,
        fourth: true
      };
    }

    case 'error': {
      return {
        ...initialPath,
        restart: true
      }
    }

    case 'restart': {
      return {
        ...initialPath,
        restart: false
      }
    }

  }
  throw Error('Unknown action: ' + action.type);
}

// cositas de Jquery
// $("#pointRef").removeClass("layout");
// $("#pointRef").css('--color', 'blue')
// console.log($("#pointRef").css('--color'));
// $("#pointRef").css('background-color', 'red');
// $("#pointRef").getAttribute("--color")