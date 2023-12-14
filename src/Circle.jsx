import { useEffect, useReducer, useRef, useState } from 'react'
// import Hammer from 'react-hammerjs'
import $ from 'jquery';
import Swal from 'sweetalert2';
import moment from 'moment';

import { useGesture } from '@use-gesture/react'



const initialPath = {
  first: {
    status: false,
    startTime: null,
    endTime: null
  },
  second: {
    status: false,
    startTime: null,
    endTime: null
  },
  third: {
    status: false,
    startTime: null,
    endTime: null
  },
  fourth: {
    status: false,
    startTime: null,
    endTime: null
  },

  restarted: false,
}
const Circle = ({ setShowStart }) => {


  const mouseRef = useRef(null);
  useGesture(
    {
      onDrag: (ev) => {

        moving(ev);
        // console.log(ev);
        // $("#pointRef").addClass("layout")
        // // console.log(ev.center);

        // $("#pointRef").offset({ top: ev.values[1], left: ev.values[0] });
      },

      onDragStart: (ev) => {
        // console.log(ev.initial);
        startMove();
      },
      onDragEnd: (ev) => {
        stopMove();
      }

    },
    {
      target: mouseRef,
      // eventOptions: { passive: false },
    }
  );


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


  const moving = ({ values: [x, y] }) => {
    // console.log(ev);

    // console.log(x, y);
    // return void 0;

    if (pathState.restart) {
      return void 0; // salir si hubo error
    }
    if (x == 0 || y == 0) { // fixing bugss
      stopMove(ev);
      return void 0;
    }

    // logica para error si se sale del recuadro

    if ((x < ((windowSize.innerWidth / 2) - 170) || x > ((windowSize.innerWidth / 2) + 170)) || (y < ((windowSize.innerHeight / 2) - 170) || y > ((windowSize.innerHeight / 2) + 170))) {
      // console.log(x, y);
      errorDetected();
    }


    //logica para detectar cuando entra a los botones y cambiar ele stado en consecuencia
    if ((x > ((windowSize.innerWidth / 2) - 15 - 100) && x < ((windowSize.innerWidth / 2) + 15 - 100)) && (y > ((windowSize.innerHeight / 2) - 15) && y < ((windowSize.innerHeight / 2) + 15))) {

      if (!pathState.second.status) {
        dispatch({ 'type': 'second' })
      }
      // console.log(pathState);
      if (pathState.third.status || pathState.fourth.status) {
        errorDetected();

      }
    }

    if ((x > ((windowSize.innerWidth / 2) - 15) && x < ((windowSize.innerWidth / 2) + 15)) && (y > ((windowSize.innerHeight / 2) - 15 - 100) && y < ((windowSize.innerHeight / 2) + 15 - 100))) {

      if (pathState.second.status && !pathState.third.status) {
        dispatch({ 'type': 'third' })
      }

      if (pathState.fourth.status || (!pathState.first.status && !pathState.second.status && !pathState.third.status && !pathState.fourth.status)) {
        errorDetected();
      }
    }


    if ((x > ((windowSize.innerWidth / 2) - 15 + 100) && x < ((windowSize.innerWidth / 2) + 15 + 100)) && (y > ((windowSize.innerHeight / 2) - 15) && y < ((windowSize.innerHeight / 2) + 15))) {

      if (pathState.second.status && pathState.third.status && !pathState.fourth.status) {
        dispatch({ 'type': 'fourth' })
      }

      if ((pathState.second.status && !pathState.third.status) || (!pathState.first.status && !pathState.second.status && !pathState.third.status && !pathState.fourth.status)) {
        errorDetected();
      }
    }


    if ((x > ((windowSize.innerWidth / 2) - 15) && x < ((windowSize.innerWidth / 2) + 15)) && (y > ((windowSize.innerHeight / 2) - 15 + 100) && y < ((windowSize.innerHeight / 2) + 15) + 100)) {

      if (pathState.second.status && pathState.third.status && pathState.fourth.status && !pathState.first.status) {
        dispatch({ 'type': 'first' });
        // pathFinished();
      }
      else if ((pathState.second.status && (!pathState.third.status || !pathState.fourth.status)) || (pathState.third.status && !pathState.fourth.status)) {
        errorDetected();
      }
    }

    $("#pointRef").offset({ top: y - 15, left: x - 15 });
  }

  const startMove = (ev) => {
    $("#pointRef").addClass("layout")
    // console.log(ev.center);

    $("#pointRef").offset({ top: initialPoints.top, left: initialPoints.left });


    dispatch({ type: 'restart' }) // set restart again on false, to allow movement

  }
  const stopMove = (ev) => {

    // console.log(windowSize);

    errorDetected();

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

  useEffect(() => { // to run once the game finishes
    if (pathState.first.endTime != null) {
      // console.log(pathState);

      $("#pointRef").removeClass("layout")
      $("#pointRef").offset({ top: initialPoints.top, left: initialPoints.left });


      let time1 = (pathState.second.endTime - pathState.second.startTime) / 1000;
      let time2 = (pathState.third.endTime - pathState.third.startTime) / 1000;
      let time3 = (pathState.fourth.endTime - pathState.fourth.startTime) / 1000;
      let time4 = (pathState.first.endTime - pathState.first.startTime) / 1000;

      let arcLength = (2 * Math.PI * 100) / 4; // longitud de arco de cada recorrido es el perimetro dividido 4. 100 es el radio del circulo, que son 100px

      Swal.fire('Summary:',
        `
          <b> Path 1->2 </b>: <br />
          Elapsed Time: ${time1} seg; <br />
          Speed: ${(arcLength / time1).toFixed(2)} px/seg, <br /> <br />

          <b> Path 2->3 </b>: <br />
          Elapsed Time: ${time2} seg; <br />
          Speed: ${(arcLength / time2).toFixed(2)} px/seg, <br /> <br />

          <b> Path 3->4 </b>: <br />
          Elapsed Time: ${time3} seg; <br />
          Speed: ${(arcLength / time3).toFixed(2)} px/seg, <br /> <br />

          <b> Path 4->1 </b>: <br />
          Elapsed Time: ${time4} seg; <br />
          Speed: ${(arcLength / time4).toFixed(2)} px/seg, <br /> <br />

          <b> Overall stats </b>: <br />
          Total time elapsed: ${(time1 + time2 + time3 + time4).toFixed(2)} seg; <br />
          Average Speed: ${(
          (
            (arcLength / time1) + (arcLength / time2) + (arcLength / time3) + (arcLength / time4)
          )
          / 4).toFixed(2)
        } px/seg, <br />
        `
        , 'success');
      setShowStart(true);
    }

  }, [pathState.first.endTime]);

  return (
    <div className='w-[300px] h-[300px] flex items-center justify-center'>
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

        {/* <Hammer onPan={moving} onPanEnd={stopMove} onPanStart={startMove}> */}
        <div
          id='pointRef'
          ref={mouseRef}
          className='absolute bottom-[calc(0px-15px)] left-[calc(50%-15px)] w-[30px] h-[30px] rounded-[50%] '
        >
        </div>
        {/* </Hammer> */}

      </div>

      {/* <div className='w-20 h-20 bg-light'>
        <div className='w-10 h-10 bg-secondary' ref={mouseRef}>

        </div>


      </div> */}
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
        first: {
          ...state.first,
          status: true,
          endTime: moment()
        }
      };
    }
    case 'second': {
      return {
        ...state,
        second: {
          ...state.second,
          status: true,
          endTime: moment()
        },
        third: {
          ...state.third,
          startTime: moment()
        }
      };
    }
    case 'third': {
      return {
        ...state,
        third: {
          ...state.third,
          status: true,
          endTime: moment()
        },
        fourth: {
          ...state.fourth,
          startTime: moment()
        }
      };
    }
    case 'fourth': {
      return {
        ...state,
        fourth: {
          ...state.fourth,
          status: true,
          endTime: moment()
        },
        first: {
          ...state.first,
          startTime: moment()
        }
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
        restart: false,
        second: {
          ...state.second,
          startTime: moment()
        }
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