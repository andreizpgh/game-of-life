import { useRef, useEffect } from "react";
import p5 from "p5";
import { generateStartState, findNextGeneration, display } from "./Naive";
import { init, drawFirstFrame, setCell, update } from "./Optimized";

interface SketchPropsI {
  sketchProps: {
    canvasSize: number;
    size: number;
    colors: string[];
    engine: string;
  };
}

export default function Sketch({ sketchProps }: SketchPropsI) {
  const { canvasSize, size, colors, engine } = sketchProps;

  const createEmptyGrid = (engineVersion = engine) =>
    engineVersion == "Naive"
      ? Array.from({ length: size }, () => new Array(size).fill(false))
      : [
          Array.from({ length: size }, () => new Uint8Array(size)),
          Array.from({ length: size }, () => new Uint8Array(size)),
        ];

  const renderRef = useRef<HTMLDivElement>(null);
  const unit = canvasSize / size;

  const engineInstance = (p5: p5) => {
    let grid = createEmptyGrid();

    const sketchHeader = p5.createDiv().addClass("sketchHeader");
    const buttons = p5.createDiv().addClass("buttons");
    const stats = p5.createDiv().addClass("stats");
    sketchHeader.child(buttons);
    sketchHeader.child(stats);

    let startButton: p5.Element;
    let randomizeButton: p5.Element;
    let resetButton: p5.Element;

    let frLabel: string;
    let genCount = 0;
    let genLabel: string;

    if (innerWidth > 642) {
      startButton = p5.createButton("Start", "Start").addClass("bigScreen");
      randomizeButton = p5.createButton("Randomize").addClass("bigScreen");
      resetButton = p5.createButton("Reset").addClass("bigScreen");

      frLabel = "frameRate: ";
      genLabel = "gen: ";
    } else {
      startButton = p5
        .createButton("", "Start")
        .addClass("startSVG smallScreen");
      randomizeButton = p5
        .createButton("")
        .addClass("randomizeSVG smallScreen");
      resetButton = p5.createButton("").addClass("resetSVG smallScreen");

      frLabel = "FR: ";
      genLabel = "G: ";
    }

    let frameRate = p5.createSpan(frLabel + p5.frameRate());
    let generations = p5.createSpan(genLabel + genCount);

    startButton.mousePressed(handleStartButton);
    randomizeButton.mousePressed(handleRandomizeButton);
    resetButton.mousePressed(handleResetButton);

    buttons.child(startButton);
    buttons.child(randomizeButton);
    buttons.child(resetButton);

    stats.child(frameRate);
    stats.child(generations);

    const hint = p5.createDiv("Draw or press Randomize").addClass("hint");

    function handleStartButton() {
      if (startButton.html()) {
        if (startButton.value() == "Start") {
          startButton.html("Stop");
          startButton.value("Stop");
          hint.style("transform", "translateX(200px)");
        } else {
          startButton.html("Start");
          startButton.value("Start");
          hint.style("transform", "translateX(0px)");
        }
      } else {
        if (startButton.value() == "Start") {
          startButton.value("Stop");
          startButton.class("stopSVG smallScreen");
          hint.style("transform", "translateX(200px)");
        } else {
          startButton.value("Start");
          startButton.class("startSVG smallScreen");
          hint.style("transform", "translateX(0px)");
        }
      }
    }

    function handleRandomizeButton() {
      p5.background("white");

      if (engine == "Naive") {
        grid = generateStartState(p5, size);
        display(p5, grid as boolean[][], size, colors);
      } else {
        grid = init(p5, size);
        drawFirstFrame(p5, grid as Uint8Array[][], size, unit, colors);
      }

      genCount = 0;
      generations.remove();
      generations = p5.createSpan(genLabel + genCount);
      stats.child(generations);

      hint.style("transform", "translateX(200px)");
    }

    function handleResetButton() {
      p5.background("white");

      if (startButton.value() == "Stop") {
        if (startButton.html()) {
          startButton.html("Start");
          startButton.value("Start");
        } else {
          startButton.value("Start");
          startButton.class("startButton smallScreen");
        }

        hint.style("transform", "translateX(0px)");
      }

      grid = createEmptyGrid();

      frameRate.remove();
      frameRate = p5.createSpan(frLabel + "0");
      stats.child(frameRate);

      genCount = 0;
      generations.remove();
      generations = p5.createSpan(genLabel + genCount);
      stats.child(generations);

      hint.style("transform", "translateX(0px)");
    }

    p5.setup = () => {
      p5.createCanvas(canvasSize, canvasSize);
      p5.noStroke();
      p5.background("white");
    };

    p5.draw = () => {
      if (startButton.value() == "Start" && p5.mouseIsPressed) {
        const row = p5.floor(p5.mouseY / unit);
        const column = p5.floor(p5.mouseX / unit);

        if (row > 0 && row < size && column > 0 && column < size) {
          p5.fill(colors[Math.floor(p5.random(0, colors.length))]);

          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              if (engine == "Naive") grid[row + i][column + j] = true;
              else setCell(row + i, column + j, grid[0], size);

              p5.square((column + j) * unit, (row + i) * unit, unit);
            }
          }
        }
      } else if (startButton.value() == "Stop") {
        if (genCount % 10 == 0) {
          frameRate.remove();
          frameRate = p5.createSpan(frLabel + p5.frameRate().toPrecision(2));
          stats.child(frameRate);
        }

        genCount++;
        generations.remove();
        generations = p5.createSpan(genLabel + genCount);
        stats.child(generations);

        if (engine == "Naive") {
          p5.background("white");
          display(p5, grid, size, colors);
          grid = findNextGeneration(grid, size);
        } else update(p5, grid, size, unit, colors);
      }
    };
  };

  useEffect(() => {
    const myP5 = new p5(engineInstance, renderRef.current as HTMLDivElement);
    return myP5.remove;
  }, [size, colors, engine]);

  return <div className="sketch" ref={renderRef}></div>;
}
