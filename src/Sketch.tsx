import { useRef, useEffect } from "react";
import { generateStartState, findNextGeneration, display } from "./Naive";
import { init, update } from "./Optimized";
import p5 from "p5";

interface SketchPropsI {
  size: number;
  ratio: number;
  colors: string[];
  N: boolean;
}

export default function Sketch({ size, ratio, colors, N }: SketchPropsI) {
  const renderRef = useRef<HTMLDivElement>(null);

  const s = (p: p5) => {
    let G: number[][];
    let Generations: Uint8Array[][];
    if (N) {
      G = generateStartState(p, size, ratio);
    } else {
      Generations = init(p, size, ratio);
    }
    let unit = 0;

    p.setup = () => {
      p.createCanvas(800, 800);
      p.noStroke();
      unit = p.width / size;
      if (N) {
        //display(p, G, size, colors);
      }
    };

    p.draw = () => {
      if (N) {
        G = findNextGeneration(G, size);
        display(p, G, size, colors);
      } else {
        update(p, Generations, size, unit, colors);
      }

      //p.noLoop();
      //console.log(p.frameRate());
    };
  };

  useEffect(() => {
    const myP5 = new p5(s, renderRef.current as HTMLDivElement);
    return myP5.remove;
  }, []);

  return <div ref={renderRef}></div>;
}
