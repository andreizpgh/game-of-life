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
    let G = Array.from({ length: size }, () => new Array(size).fill(false));

    let startButton: p5.Element;
    let randomizeButton: p5.Element;
    let resetButton: p5.Element;
    let hint: p5.Element;
    const sketchHeader = p5.createDiv().addClass("sketchHeader");
    const buttons = p5.createDiv().addClass("buttons");
    const stats = p5.createDiv().addClass("stats");
    sketchHeader.child(buttons);
    sketchHeader.child(stats);

    let frLabel: string;
    let frameRate: p5.Element;
    let genCount = 0;
    let gLabel: string;
    let generations: p5.Element;

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      p5.background("white");

      if (innerWidth > 642) {
        startButton = p5.createButton("Start", "Start").addClass("bigScreen");
        randomizeButton = p5.createButton("Randomize").addClass("bigScreen");
        resetButton = p5.createButton("Reset").addClass("bigScreen");
        frLabel = "frameRate: ";
        gLabel = "gen: ";
      } else {
        frLabel = "FR: ";
        gLabel = "G: ";
        startButton = p5
          .createButton("", "Start")
          .addClass("startButton smallScreen");
        randomizeButton = p5
          .createButton("")
          .addClass("randomizeButton smallScreen");
        resetButton = p5.createButton("").addClass("resetButton smallScreen");
      }

      frameRate = p5.createSpan(frLabel + p5.frameRate());
      generations = p5.createSpan(gLabel + genCount);

      startButton.mousePressed(handleStartButton);
      randomizeButton.mousePressed(handleRandomizeButton);
      resetButton.mousePressed(handleResetButton);

      buttons.child(startButton);
      buttons.child(randomizeButton);
      buttons.child(resetButton);
      stats.child(frameRate);
      stats.child(generations);

      hint = p5.createDiv("Draw or press Randomize").addClass("hint");

      function handleStartButton() {
        if (startButton.html()) {
          if (startButton.value() == "Start") {
            startButton.html("Stop");
            startButton.value("Stop");
            hint.style("transform", "translateX(200px)");
          } else if (startButton.value() == "Stop") {
            startButton.html("Start");
            startButton.value("Start");
            hint.style("transform", "translateX(0px)");
          }
        } else {
          if (startButton.value() == "Start") {
            startButton.value("Stop");
            startButton.class("stopButton smallScreen");
            hint.style("transform", "translateX(200px)");
          } else {
            startButton.value("Start");
            startButton.class("startButton smallScreen");
            hint.style("transform", "translateX(0px)");
          }
        }
      }

      function handleRandomizeButton() {
        G = generateStartState(p5, size, ratio);
        p5.background("white");
        display(p5, G, size, colors);
        hint.style("transform", "translateX(200px)");

        genCount = 0;
        generations.remove();
        generations = p5.createSpan(gLabel + genCount);
        stats.child(generations);
      }

      function handleResetButton() {
        if (startButton.value() == "Stop") {
          if (startButton.html()) {
            startButton.html("Start");
            startButton.value("Start");
            hint.style("transform", "translateX(0px)");
          } else {
            startButton.value("Start");
            startButton.class("startButton smallScreen");
            hint.style("transform", "translateX(0px)");
          }
        }

        G = Array.from({ length: size }, () => new Array(size).fill(false));
        p5.background("white");
        hint.style("transform", "translateX(0px)");

        frameRate.remove();
        frameRate = p5.createSpan(frLabel + "0");
        stats.child(frameRate);

        genCount = 0;
        generations.remove();
        generations = p5.createSpan(gLabel + genCount);
        stats.child(generations);
      }
    };

    p5.draw = () => {
      if (startButton.value() == "Start") {
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
        genCount++;
        if (genCount % 10 == 0) {
          frameRate.remove();
          frameRate = p5.createSpan(frLabel + p5.frameRate().toPrecision(2));
          stats.child(frameRate);
        }
        generations.remove();
        generations = p5.createSpan(gLabel + genCount);
        stats.child(generations);

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
    const buttons = p5.createDiv().addClass("buttons");
    const stats = p5.createDiv().addClass("stats");
    sketchHeader.child(buttons);
    sketchHeader.child(stats);

    let frLabel: string;
    let frameRate: p5.Element;
    let genCount = 0;
    let gLabel: string;
    let generations: p5.Element;

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      p5.background("white");

      if (innerWidth > 642) {
        startButton = p5.createButton("Start", "Start").addClass("bigScreen");
        randomizeButton = p5.createButton("Randomize").addClass("bigScreen");
        resetButton = p5.createButton("Reset").addClass("bigScreen");
        frLabel = "frameRate: ";
        gLabel = "gen: ";
      } else {
        frLabel = "FR: ";
        gLabel = "G: ";
        startButton = p5
          .createButton("", "Start")
          .addClass("startButton smallScreen");
        randomizeButton = p5
          .createButton("")
          .addClass("randomizeButton smallScreen");
        resetButton = p5.createButton("").addClass("resetButton smallScreen");
      }

      frameRate = p5.createSpan(frLabel + p5.frameRate());
      generations = p5.createSpan(gLabel + genCount);

      startButton.mousePressed(handleStartButton);
      randomizeButton.mousePressed(handleRandomizeButton);
      resetButton.mousePressed(handleResetButton);

      buttons.child(startButton);
      buttons.child(randomizeButton);
      buttons.child(resetButton);
      stats.child(frameRate);
      stats.child(generations);

      hint = p5.createDiv("Draw or press Randomize").addClass("hint");

      function handleStartButton() {
        if (startButton.html()) {
          if (startButton.value() == "Start") {
            startButton.html("Stop");
            startButton.value("Stop");
            hint.style("transform", "translateX(200px)");
          } else if (startButton.value() == "Stop") {
            startButton.html("Start");
            startButton.value("Start");
            hint.style("transform", "translateX(0px)");
          }
        } else {
          if (startButton.value() == "Start") {
            startButton.value("Stop");
            startButton.class("stopButton smallScreen");
            hint.style("transform", "translateX(200px)");
          } else {
            startButton.value("Start");
            startButton.class("startButton smallScreen");
            hint.style("transform", "translateX(0px)");
          }
        }
      }

      function handleRandomizeButton() {
        Generations = init(p5, size, ratio);
        p5.background("white");
        drawFirstFrame(p5, Generations, size, unit, colors);
        hint.style("transform", "translateX(200px)");

        genCount = 0;
        generations.remove();
        generations = p5.createSpan(gLabel + genCount);
        stats.child(generations);
      }

      function handleResetButton() {
        if (startButton.value() == "Stop") {
          if (startButton.html()) {
            startButton.html("Start");
            startButton.value("Start");
            hint.style("transform", "translateX(0px)");
          } else {
            startButton.value("Start");
            startButton.class("startButton smallScreen");
            hint.style("transform", "translateX(0px)");
          }
        }

        Generations = [
          Array.from({ length: size }, () => new Uint8Array(size)),
          Array.from({ length: size }, () => new Uint8Array(size)),
        ];
        p5.background("white");
        hint.style("transform", "translateX(0px)");

        frameRate.remove();
        frameRate = p5.createSpan(frLabel + "0");
        stats.child(frameRate);

        genCount = 0;
        generations.remove();
        generations = p5.createSpan(gLabel + genCount);
        stats.child(generations);
      }
    };

    p5.draw = () => {
      if (startButton.value() == "Start") {
        if (p5.mouseIsPressed) {
          let row = p5.floor(p5.mouseY / unit);
          row = row < 0 || row > size ? 0 : row;
          let column = p5.floor(p5.mouseX / unit);
          column = column < 0 || column > size ? 0 : column;

          if (row && column) {
            p5.fill(colors[Math.floor(p5.random(0, colors.length))]);
            for (let i = -1; i < 2; i++) {
              for (let j = -1; j < 2; j++) {
                setCell(row + i, column + j, Generations[0], size);
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
        genCount++;
        if (genCount % 10 == 0) {
          frameRate.remove();
          frameRate = p5.createSpan(frLabel + p5.frameRate().toPrecision(2));
          stats.child(frameRate);
        }
        generations.remove();
        generations = p5.createSpan(gLabel + genCount);
        stats.child(generations);

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
