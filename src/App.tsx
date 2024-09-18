import Sketch from "./Sketch";

export default function App() {
  const size = 100;
  const ratio = 4;
  const colors = ["black", "yellow", "red", "green"];

  return <Sketch size={size} ratio={ratio} colors={colors} />;
}
