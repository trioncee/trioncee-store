
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const GrainEffect = () => {
  useEffect(() => {
    const canvas = document.getElementById('grain') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const noise = () => {
      const idata = ctx.createImageData(width, height);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;
      let i = 0;
      for (; i < len; i++) {
        if (Math.random() < 0.5) buffer32[i] = 0xff000000;
      }
      ctx.putImageData(idata, 0, 0);
    };

    let frame = 0;
    const loop = () => {
      frame++;
      if (frame % 2 === 0) noise();
      requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return null;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GrainEffect />
    <App />
  </React.StrictMode>
);
