import { useRef, useEffect } from "react";
import { generateStartState, findNextGeneration, display } from "./Naive";
import { init, drawFirstFrame, update } from "./Optimized";
import p5 from "p5";

interface SketchPropsI {
  canvasSize: number;
  size: number;
  ratio: number;
  colors: string[];
  engine: string;
}

interface enginesI {
  Naive: any;
  Optimized: any;
}

export default function Sketch({
  canvasSize,
  size,
  ratio,
  colors,
  engine,
}: SketchPropsI) {
  const renderRef = useRef<HTMLDivElement>(null);
  const unit = canvasSize / size;

  const Naive = (p5: p5) => {
    let G = generateStartState(p5, size, ratio);

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      display(p5, G, size, colors);
    };

    p5.draw = () => {
      G = findNextGeneration(G, size);
      display(p5, G, size, colors);
      p5.noLoop();
      //console.log(p5.frameRate());
    };
  };

  const Optimized = (p5: p5) => {
    const Generations = init(p5, size, ratio);

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      drawFirstFrame(p5, Generations, size, unit, colors);
    };

    p5.draw = () => {
      update(p5, Generations, size, unit, colors);
      p5.noLoop();
      //console.log(p5.frameRate());
    };
  };

  const engines: enginesI = {
    Naive: Naive,
    Optimized: Optimized,
  };

  useEffect(() => {
    const callBack = engines[engine as keyof enginesI];
    const myP5 = new p5(callBack, renderRef.current as HTMLDivElement);
    return myP5.remove;
  }, [size, colors, engine]);

  return <div ref={renderRef}></div>;
}
