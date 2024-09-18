import { useRef, useEffect } from "react";
import { generateStartState, findNextGeneration, display } from "./Naive";
import p5 from "p5";

interface SketchPropsI {
  size: number;
  ratio: number;
  colors: string[];
}

export default function Sketch({ size, ratio, colors }: SketchPropsI) {
  const renderRef = useRef<HTMLDivElement>(null);

  const s = (p: p5) => {
    let G = generateStartState(p, size, ratio);

    p.setup = () => {
      p.createCanvas(800, 800);
      p.noStroke();
      display(p, G, size, colors);
    };

    p.draw = () => {
      G = findNextGeneration(G, size);
      display(p, G, size, colors);
      p.noLoop();
      //console.log(p.frameRate());
    };
  };

  useEffect(() => {
    const myP5 = new p5(s, renderRef.current as HTMLDivElement);
    return myP5.remove;
  }, []);

  return <div ref={renderRef}></div>;
}
