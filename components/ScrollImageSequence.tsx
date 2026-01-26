import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 202;
const START_FRAME = 1;
const END_FRAME = 202;

const getImageSrc = (index: number) =>
    `/home-images/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

const ScrollImageSequence = ({ autoPlay = true, enableScroll = false }: { autoPlay?: boolean; enableScroll?: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(START_FRAME);

    const { scrollY } = useScroll();

    // Map scroll for scroll mode
    const scrollIndex = useTransform(scrollY, [0, 2000], [START_FRAME, END_FRAME]);

    // Preload images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadCounter = 0;

        for (let i = START_FRAME; i <= END_FRAME; i++) {
            const img = new Image();
            img.src = getImageSrc(i);
            img.onload = () => {
                loadCounter++;
                setLoadedCount(loadCounter);
            };
            loadedImages[i] = img;
        }
        setImages(loadedImages);
    }, []);

    // Animation Loop
    useEffect(() => {
        if (!autoPlay || loadedCount < 1) return; // Start as soon as we have something

        let animationFrameId: number;
        let lastTime = 0;
        const fps = 30;
        const interval = 1000 / fps;

        const animate = (time: number) => {
            if (time - lastTime > interval) {
                setCurrentFrame(prev => {
                    const next = prev + 1;
                    return next > END_FRAME ? START_FRAME : next;
                });
                lastTime = time;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [autoPlay, loadedCount]);

    // Sync scroll to state if scrolling is enabled
    useMotionValueEvent(scrollIndex, "change", (latest) => {
        if (enableScroll && !autoPlay) {
            setCurrentFrame(latest);
        }
    });

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const safeIndex = Math.min(END_FRAME, Math.max(START_FRAME, Math.floor(index)));
        const img = images[safeIndex];

        if (!img || !img.complete) return;

        const w = canvas.width;
        const h = canvas.height;
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;

        let drawW, drawH, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawW = w;
            drawH = w / imgRatio;
            offsetX = 0;
            offsetY = (h - drawH) / 2;
        } else {
            drawH = h;
            drawW = h * imgRatio;
            offsetX = (w - drawW) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    // Resize handler with High-DPI support
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                // Set actual internal resolution
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;

                // Set CSS display size
                canvasRef.current.style.width = `${window.innerWidth}px`;
                canvasRef.current.style.height = `${window.innerHeight}px`;

                // Scale context once to match dpr? 
                // No, because we are drawing an image to cover. We just want the destination (w, h) to be large.
                // Our renderFrame logic uses canvas.width/height which are now dpr-scaled.
                // The image will be drawn into this larger buffer.
                // If the image itself is low-res, it won't help much, but if the images are 1080p+, this avoids downsampling blur.

                renderFrame(currentFrame);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [images, currentFrame]);

    // Render on frame change
    useEffect(() => {
        renderFrame(currentFrame);
    }, [currentFrame, images]);

    return (
        <div className="absolute inset-0 z-0 mix-blend-multiply pointer-events-none">
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block"
            />
        </div>
    );
};

export default ScrollImageSequence;
