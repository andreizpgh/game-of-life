import { ChangeEvent, useState } from "react";
import Sketch from "./Sketch";
import Controls from "./Controls";
import Interactivity from "./Interactivity";

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

  function handlePalette(e: ChangeEvent<HTMLSelectElement>) {
    setPalette(e.target.value);
  }

  function handleSize(e: ChangeEvent<HTMLSelectElement>) {
    setSize(+e.target.value);
  }

  function handleEngine(e: ChangeEvent<HTMLSelectElement>) {
    setEngine(e.target.value);
  }

  const canvasSize = 700;
  const ratio = 4;

  const colorPalettes: colorPalettesI = {
    black: ["black"],
    retroPunch: ["#f8d210", "#fa26a0", "#f51720"],
    underFerns: ["#116530", "#21b6a8", "#18a558"],
    deepBlue: ["#050a30", "#000c66", "#0000ff"],
  };

  return (
    <div className="app">
      <Interactivity />
      <Sketch
        canvasSize={canvasSize}
        size={selectedSize}
        ratio={ratio}
        colors={colorPalettes[selectedPalette as keyof colorPalettesI]}
        engine={selectedEngine}
      />
      <Controls
        size={selectedSize}
        onSize={handleSize}
        palette={selectedPalette}
        onPalette={handlePalette}
        engine={selectedEngine}
        onEngine={handleEngine}
      />
    </div>
  );
}
