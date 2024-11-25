import React, { useEffect, useRef, useState } from 'react'
import canvasimages from './canvasimage'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


function Canvas({props}) {
    const {startIndex, numImages, duration, size, top, left, zIndex} = props;
    const [index, setIndex] = useState({ value: startIndex });
    const canvasref  = useRef(null);

    useGSAP(() => {
       gsap.to(index, {
        value: startIndex + numImages -1,
        duration: duration,
        repeat: -1,
        ease: "linear",
        onUpdate: () => {
            setIndex({ value: Math.round(index.value) });
        }
       })
    });
    useEffect(() => {
        const scale = window.devicePixelRatio;
        const canvas = canvasref.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = canvasimages[index.value];
        img.onload = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            canvas.style.width = canvas.offsetWidth + 'px';
            canvas.style.height = canvas.offsetHeight + 'px';
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0,canvas.offsetWidth,canvas.offsetHeight);
        };
    },[index]);
  return <canvas
  data-scroll
  data-scroll-speed={Math.random().toFixed(1)}
   ref={canvasref}  
   id="canvas" 
  className='absolute'
  style={{
    width: `${size*1.8}px`,
    height: `${size*1.8}px`,
    top: `${top}%`,
    left: `${left}%`,
    zIndex: `${zIndex}`
    }}
    ></canvas>
}

export default Canvas
