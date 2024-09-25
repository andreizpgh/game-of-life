import { ChangeEvent, useEffect, useState } from "react";
import Sketch from "./Sketch";
import Controls from "./Controls";

interface colorPalettesI {
  black: string[];
  retroPunch: string[];
  underFerns: string[];
  deepBlue: string[];
}

export default function App() {
  const [selectedPalette, setPalette] = useState("black");
  const [selectedSize, setSize] = useState(100);
  const [selectedEngine, setEngine] = useState("Naive");
  const [canvasSize, setCanvasSize] = useState(700);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setCanvasSize(700);
      if (window.innerWidth <= 768) setCanvasSize(600);
      if (window.innerWidth <= 642) setCanvasSize(500);
      if (window.innerWidth <= 546) setCanvasSize(400);
      if (window.innerWidth <= 442) setCanvasSize(300);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ratio = 4;

  const colorPalettes: colorPalettesI = {
    black: ["black"],
    retroPunch: ["#f8d210", "#fa26a0", "#f51720"],
    underFerns: ["#116530", "#21b6a8", "#18a558"],
    deepBlue: ["#050a30", "#000c66", "#0000ff"],
  };

  function handlePalette(e: ChangeEvent<HTMLSelectElement>) {
    setPalette(e.target.value);
  }

  function handleSize(e: ChangeEvent<HTMLSelectElement>) {
    setSize(+e.target.value);
  }

  function handleEngine(e: ChangeEvent<HTMLSelectElement>) {
    setEngine(e.target.value);
  }

  const sketchProps = {
    canvasSize: canvasSize,
    size: selectedSize,
    ratio: ratio,
    colors: colorPalettes[selectedPalette as keyof colorPalettesI],
    engine: selectedEngine,
  };

  const controlsProps = {
    size: selectedSize,
    onSize: handleSize,
    palette: selectedPalette,
    onPalette: handlePalette,
    engine: selectedEngine,
    onEngine: handleEngine,
  };

  return (
    <div className="app">
      <Sketch sketchProps={sketchProps} />
      <Controls controlsProps={controlsProps} />
      <div className="info">
        <span>?</span>
        <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
          What is Game of Life?
        </a>
      </div>
    </div>
  );
}
