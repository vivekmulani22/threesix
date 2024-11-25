import React, { useEffect, useRef, useState } from 'react';
import canvasimages from './canvasimage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function Canvas({ props }) {
    const { startIndex, numImages, duration, size, top, left, zIndex } = props;
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const canvasRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ repeat: -1 });
        tl.to({}, {
            duration: duration,
            onUpdate: () => {
                const progress = tl.progress();
                const frameIndex = Math.min(
                    Math.floor(progress * numImages) + startIndex,
                    startIndex + numImages - 1
                );
                setCurrentIndex(frameIndex);
            }
        });
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const scale = window.devicePixelRatio;

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;
            canvas.style.width = `${canvas.offsetWidth}px`;
            canvas.style.height = `${canvas.offsetHeight}px`;
            ctx.scale(scale, scale);
        };

        // Load and draw image
        const img = new Image();
        img.src = canvasimages[currentIndex];
        img.onload = () => {
            setCanvasDimensions();
            ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
        };

        // Handle resize
        const handleResize = () => {
            setCanvasDimensions();
            if (img.complete) {
                ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentIndex]);

    return (
        <canvas
            data-scroll
            data-scroll-speed={Math.random().toFixed(1)}
            ref={canvasRef}
            id="canvas"
            className="absolute"
            style={{
                width: `${size * 1.8}px`,
                height: `${size * 1.8}px`,
                top: `${top}%`,
                left: `${left}%`,
                zIndex: zIndex
            }}
        />
    );
}

export default Canvas;
