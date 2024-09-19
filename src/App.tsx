import Sketch from "./Sketch";

export default function App() {
  const size = 200;
  const ratio = 4;
  const colors = ["black"];
  const N = false;

  return <Sketch size={size} ratio={ratio} colors={colors} N={N} />;
}
