import { ChangeEventHandler } from "react";

interface ControlsPropsI {
  controlsProps: {
    size: number;
    onSize: ChangeEventHandler<HTMLSelectElement>;
    palette: string;
    onPalette: ChangeEventHandler<HTMLSelectElement>;
    engine: string;
    onEngine: ChangeEventHandler<HTMLSelectElement>;
  };
}

export default function Controls({ controlsProps }: ControlsPropsI) {
  const { size, onSize, palette, onPalette, engine, onEngine } = controlsProps;

  return (
    <div className="controls">
      <label>
        Size:
        <select value={size} onChange={onSize}>
          <option>50</option>
          <option>100</option>
          <option>200</option>
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
          <option>Naive</option>
          <option>Optimized</option>
        </select>
      </label>
    </div>
  );
}
