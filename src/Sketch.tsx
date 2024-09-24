import { useRef, useEffect } from "react";
import { generateStartState, findNextGeneration, display } from "./Naive";
import { init, drawFirstFrame, setCell, update } from "./Optimized";
import p5 from "p5";

interface SketchPropsI {
  sketchProps: {
    canvasSize: number;
    size: number;
    ratio: number;
    colors: string[];
    engine: string;
  };
}

interface enginesI {
  Naive: any;
  Optimized: any;
}

export default function Sketch({ sketchProps }: SketchPropsI) {
  const { canvasSize, size, ratio, colors, engine } = sketchProps;

  const renderRef = useRef<HTMLDivElement>(null);
  const unit = canvasSize / size;

  const Naive = (p5: p5) => {
    let startButton: p5.Element;
    let randomizeButton: p5.Element;
    let resetButton: p5.Element;
    let hint: p5.Element;
    const sketchHeader = p5.createDiv().addClass("sketchHeader");

    let frameRate = p5
      .createSpan("frameRate: " + p5.frameRate())
      .style("color", "white");
    let gensCount = 0;
    let gens = p5.createSpan("Gens: " + gensCount).style("color", "white");

    let G = Array.from({ length: size }, () => new Array(size).fill(false));

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      p5.background("white");

      startButton = p5.createButton("Start");
      startButton.mousePressed(handleStartButton);
      randomizeButton = p5.createButton("Randomize");
      randomizeButton.mousePressed(handleRandomizeButton);
      resetButton = p5.createButton("Reset");
      resetButton.mousePressed(handleResetButton);

      sketchHeader.child(startButton);
      sketchHeader.child(randomizeButton);
      sketchHeader.child(resetButton);
      sketchHeader.child(frameRate);
      sketchHeader.child(gens);

      hint = p5.createDiv("Draw or press Randomize").addClass("hint");

      function handleStartButton() {
        if (startButton.html() == "Start")
          hint.style("transform", "translateX(200px)");
        else hint.style("transform", "translateX(0px)");
        startButton.html(startButton.html() == "Start" ? "Stop" : "Start");
      }

      function handleRandomizeButton() {
        G = generateStartState(p5, size, ratio);
        p5.background("white");
        display(p5, G, size, colors);
        hint.style("transform", "translateX(200px)");

        gensCount = 0;
        gens.remove();
        gens = p5.createSpan("Gens: " + gensCount).style("color", "white");
        sketchHeader.child(gens);
      }

      function handleResetButton() {
        startButton.html() == "Stop" && startButton.html("Start");
        G = Array.from({ length: size }, () => new Array(size).fill(false));
        p5.background("white");
        hint.style("transform", "translateX(0px)");

        frameRate.remove();
        frameRate = p5.createSpan("frameRate: 0").style("color", "white");
        sketchHeader.child(frameRate);

        gensCount = 0;
        gens.remove();
        gens = p5.createSpan("Gens: " + gensCount).style("color", "white");
        sketchHeader.child(gens);
      }
    };

    p5.draw = () => {
      if (startButton.html() == "Start") {
        if (p5.mouseIsPressed) {
          let row = p5.floor(p5.mouseY / unit);
          row = row < 0 || row > size ? 0 : row;
          let column = p5.floor(p5.mouseX / unit);
          column = column < 0 || column > size ? 0 : column;

          if (row && column) {
            p5.fill(colors[Math.floor(p5.random(0, colors.length))]);
            for (let i = -1; i < 2; i++) {
              for (let j = -1; j < 2; j++) {
                G[(row + i + size) % size][(column + j + size) % size] = true;
                p5.square(
                  ((column + j + size) % size) * unit,
                  ((row + i + size) % size) * unit,
                  unit
                );
              }
            }
          }
        }
      } else {
        gensCount++;
        if (gensCount % 10 == 0) {
          frameRate.remove();
          frameRate = p5
            .createSpan("frameRate: " + p5.frameRate().toPrecision(3))
            .style("color", "white");
          sketchHeader.child(frameRate);
        }
        gens.remove();
        gens = p5.createSpan("Gens: " + gensCount).style("color", "white");
        sketchHeader.child(gens);

        p5.background("white");
        display(p5, G, size, colors);
        G = findNextGeneration(G, size);
      }
    };
  };

  const Optimized = (p5: p5) => {
    let Generations = [
      Array.from({ length: size }, () => new Uint8Array(size)),
      Array.from({ length: size }, () => new Uint8Array(size)),
    ];
    let startButton: p5.Element;
    let randomizeButton: p5.Element;
    let resetButton: p5.Element;
    let hint: p5.Element;

    const sketchHeader = p5.createDiv().addClass("sketchHeader");

    let frameRate = p5
      .createSpan("frameRate: " + p5.frameRate())
      .style("color", "white");
    let gensCount = 0;
    let gens = p5.createSpan("Gens: " + gensCount).style("color", "white");

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      p5.background("white");

      startButton = p5.createButton("Start");
      startButton.mousePressed(handleStartButton);
      randomizeButton = p5.createButton("Randomize");
      randomizeButton.mousePressed(handleRandomizeButton);
      resetButton = p5.createButton("Reset");
      resetButton.mousePressed(handleResetButton);

      sketchHeader.child(startButton);
      sketchHeader.child(randomizeButton);
      sketchHeader.child(resetButton);
      sketchHeader.child(frameRate);
      sketchHeader.child(gens);

      hint = p5.createDiv("Draw or press Randomize").addClass("hint");

      function handleStartButton() {
        if (startButton.html() == "Start")
          hint.style("transform", "translateX(200px)");
        else hint.style("transform", "translateX(0px)");

        startButton.html() == "Start" && p5.background("white");
        startButton.html(startButton.html() == "Start" ? "Stop" : "Start");
      }

      function handleRandomizeButton() {
        Generations = init(p5, size, ratio);
        p5.background("white");
        drawFirstFrame(p5, Generations, size, unit, colors);
        hint.style("transform", "translateX(200px)");

        gensCount = 0;
        gens.remove();
        gens = p5.createSpan("Gens: " + gensCount).style("color", "white");
        sketchHeader.child(gens);
      }

      function handleResetButton() {
        Generations = [
          Array.from({ length: size }, () => new Uint8Array(size)),
          Array.from({ length: size }, () => new Uint8Array(size)),
        ];
        startButton.html() == "Stop" && startButton.html("Start");
        p5.background("white");
        hint.style("transform", "translateX(0px)");

        frameRate.remove();
        frameRate = p5.createSpan("frameRate: 0").style("color", "white");
        sketchHeader.child(frameRate);

        gensCount = 0;
        gens.remove();
        gens = p5.createSpan("Gens: " + gensCount).style("color", "white");
        sketchHeader.child(gens);
      }
    };

    p5.draw = () => {
      if (startButton.html() == "Start") {
        if (p5.mouseIsPressed) {
          let row = p5.floor(p5.mouseY / unit);
          row = row < 0 || row > size ? 0 : row;
          let column = p5.floor(p5.mouseX / unit);
          column = column < 0 || column > size ? 0 : column;

          if (row && column) {
            p5.fill(colors[Math.floor(p5.random(0, colors.length))]);
            for (let i = -1; i < 2; i++) {
              for (let j = -1; j < 2; j++) {
                setCell(row, column, Generations[0], size);
                p5.square(
                  ((column + j + size) % size) * unit,
                  ((row + i + size) % size) * unit,
                  unit
                );
              }
            }
          }
        }
      } else {
        gensCount++;
        if (gensCount % 10 == 0) {
          frameRate.remove();
          frameRate = p5
            .createSpan("frameRate: " + p5.frameRate().toPrecision(3))
            .style("color", "white");
          sketchHeader.child(frameRate);
        }
        gens.remove();
        gens = p5.createSpan("Gens: " + gensCount).style("color", "white");
        sketchHeader.child(gens);

        update(p5, Generations, size, unit, colors);
      }
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

  return <div className="sketch" ref={renderRef}></div>;
}
