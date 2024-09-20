import Sketch from "./Sketch";

export default function App() {
  const canvasSize = 800;
  const size = 100;
  const ratio = 4;

  const black = ["black"];
  const retroPunch = ["#f8d210", "#fa26a0", "#f51720"];
  const underFerns = ["#116530", "#21b6a8", "#18a558"];
  const deepBlue = ["#050a30", "#000c66", "#0000ff"];

  const colorPalettes = [black, retroPunch, underFerns, deepBlue];

  const colors = colorPalettes[0];

  const Variant = 1;

  return (
    <Sketch
      canvasSize={canvasSize}
      size={size}
      ratio={ratio}
      colors={colors}
      Variant={Variant}
    />
  );
}
