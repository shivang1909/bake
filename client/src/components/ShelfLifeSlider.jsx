import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './ShelfLifeSlider.css'; // Optional styles — no direction flip here

const ShelfLifeSlider = () => {
  const [value, setValue] = useState(0); // Default shelf life value

  const handleSliderChange = (newValue) => {
    setValue(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Shelf life: ${value} days`);
  };

  return (
    <div className="range-slider-container">
      <form onSubmit={handleSubmit}>
        <div className='flex items-center justify-between'>
        <span className="block font-semibold text-gray-700">
          Shelf Life - in Days
        </span>

    <button className='border border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white px-3 py-1 text-xs'>
        Apply
    </button>
        </div>

        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          value={value}
          onChange={handleSliderChange}
          min={0}
          max={90}
          step={1}
          withTracks={true}
          invert={false} // Make sure it's left-to-right
        />

        <div className="mt-4 mr-2">
          <input
            type="text"
            value={`Shelf Life: ${value} days`}
            readOnly
            className="border rounded-full w-full text-center bg-orange-50 font-medium"
          />
        </div>
      </form>
    </div>
  );
};

export default ShelfLifeSlider;
