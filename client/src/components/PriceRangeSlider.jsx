import { useState, useEffect } from 'react';

const PriceRangeSlider = ({ min = 0, max = 10000, value, onChange }) => {
  const [minValue, setMinValue] = useState(value?.min || min);
  const [maxValue, setMaxValue] = useState(value?.max || max);

  useEffect(() => {
    if (value) {
      setMinValue(value.min || min);
      setMaxValue(value.max || max);
    }
  }, [value, min, max]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(newMin);
    onChange?.({ min: newMin, max: maxValue });
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(newMax);
    onChange?.({ min: minValue, max: newMax });
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Min: {minValue} TND</span>
        <span>Max: {maxValue} TND</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-lg">
        <div
          className="absolute h-2 bg-primary-600 rounded-lg"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: minValue > max - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 4 }}
        />
      </div>
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;




