import { ChangeEvent, useEffect, useState } from "react";
import Sketch from "./Sketch";
import Controls from "./Controls";

interface ColorPalettesI {
  black: string[];
  retroPunch: string[];
  underFerns: string[];
  deepBlue: string[];
}

export enum EngineVersionE {
  Naive = "Naive",
  Optimized = "Optimized",
}

export default function App() {
  const [selectedPalette, setPalette] = useState("black");
  const [selectedSize, setSize] = useState(100);
  const [selectedEngine, setEngine] = useState(EngineVersionE.Naive);
  const [canvasSize, setCanvasSize] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (innerWidth > 800) setCanvasSize(750);
      if (innerWidth <= 800) setCanvasSize(600);
      if (innerWidth <= 642) setCanvasSize(450);
      if (innerWidth <= 470) setCanvasSize(300);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const colorPalettes: ColorPalettesI = {
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
    setEngine(e.target.value as EngineVersionE);
  }

  const sketchProps = {
    canvasSize: canvasSize,
    size: selectedSize,
    colors: colorPalettes[selectedPalette as keyof ColorPalettesI],
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
      <Sketch {...sketchProps} />
      <Controls {...controlsProps} />
      <div className="info">
        <span>?</span>
        <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
          What is Game of Life?
        </a>
      </div>
    </div>
  );
}
