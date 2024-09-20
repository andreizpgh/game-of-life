import { useRef, useEffect } from "react";
import { generateStartState, findNextGeneration, display } from "./Naive";
import { init, drawFirstFrame, update } from "./Optimized";
import p5 from "p5";

interface SketchPropsI {
  canvasSize: number;
  size: number;
  ratio: number;
  colors: string[];
  Variant: number;
}

export default function Sketch({
  canvasSize,
  size,
  ratio,
  colors,
  Variant,
}: SketchPropsI) {
  const renderRef = useRef<HTMLDivElement>(null);
  const unit = canvasSize / size;

  const N = (p5: p5) => {
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
      //console.log(p.frameRate());
    };
  };

  const O = (p5: p5) => {
    const Generations = init(p5, size, ratio);

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      drawFirstFrame(p5, Generations, size, unit, colors);
    };

    p5.draw = () => {
      update(p5, Generations, size, unit, colors);
      p5.noLoop();
      //console.log(p.frameRate());
    };
  };

  const engines = [N, O];

  useEffect(() => {
    const callBack = engines[Variant];
    const myP5 = new p5(callBack, renderRef.current as HTMLDivElement);
    return myP5.remove;
  }, []);

  return <div ref={renderRef}></div>;
}
