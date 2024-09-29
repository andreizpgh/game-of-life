import { ChangeEventHandler } from "react";
import { EngineVersionE } from "./App";

interface ControlsPropsI {
  size: number;
  onSize: ChangeEventHandler<HTMLSelectElement>;
  palette: string;
  onPalette: ChangeEventHandler<HTMLSelectElement>;
  engine: EngineVersionE;
  onEngine: ChangeEventHandler<HTMLSelectElement>;
}

export default function Controls(props: ControlsPropsI) {
  const { size, onSize, palette, onPalette, engine, onEngine } = props;

  return (
    <div className="controls">
      <label>
        Size:
        <select value={size} onChange={onSize}>
          <option>50</option>
          <option>75</option>
          {innerWidth <= 642 && innerWidth > 470 && <option>90</option>}
          <option>150</option>
          {innerWidth > 800 && <option>250</option>}
        </select>
      </label>
      <label>
        Color Palette:
        <select value={palette} onChange={onPalette}>
          <option>black</option>
          <option>retroPunch</option>
          <option>underFerns</option>
          <option>deepBlue</option>
        </select>
      </label>
      <label>
        Engine:
        <select value={engine} onChange={onEngine}>
          <option>{EngineVersionE.Naive}</option>
          <option>{EngineVersionE.Optimized}</option>
        </select>
      </label>
    </div>
  );
}
