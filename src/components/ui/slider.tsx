import React from 'react';

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  className?: string;
}

export function Slider({ 
  value, 
  defaultValue = [0], 
  min = 0, 
  max = 100, 
  step = 1, 
  onValueChange,
  className = '' 
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [Number(event.target.value)];
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue[0]}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(currentValue[0] - min) / (max - min) * 100}%, #e5e7eb ${(currentValue[0] - min) / (max - min) * 100}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
}
