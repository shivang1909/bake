import React, { useState } from "react";
import ReactSlider from "react-slider";
import "./RangeSlider.css"; // Optional styling

const RangeSlider = () => {
  const [values, setValues] = useState([200, 800]);

  const handleSliderChange = (newValues) => {
    setValues(newValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected price range: $${values[0]} - $${values[1]}`);
  };

  return (
    <div className="range-slider-container">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <span className="block font-semibold text-gray-700">
            Price - ₹
          </span>

          <button className="border border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white px-3 py-1 text-xs">
            Apply
          </button>
        </div>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-trackk"
          value={values}
          onChange={handleSliderChange}
          min={0}
          max={1000}
          step={10}
          withTracks={true}
          minDistance={10}
          pearling={false} // ✨ The fix
        />
        <div className="flex w-fit justify-between gap-2">
          <input
            type="text"
            value={values[0]}
            readOnly
            className="border rounded-full  w-full text-center bg-orange-50"
          />
          <input
            type="text"
            value={values[1]}
            readOnly
            className="border rounded-full  w-full text-center bg-orange-50"
          />
        </div>
      </form>
    </div>
  );
};

export default RangeSlider;
