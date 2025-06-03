import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './RangeSlider.css'; // Styling is optional

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
       
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          value={values}
          onChange={handleSliderChange}
          min={0}
          max={1000}
          step={10}
          withTracks={true}
          pearling
          minDistance={10}
        />
         {/* <label>Price Range: ${values[0]} - ${values[1]}</label> */}
         <div className='flex w-fit justify-between gap-2'>
          <input type="text" value={values[0]} className='border rounded-lg w-full text-center bg-orange-50'/>
         
            <input type="text" value={values[1]} className='border rounded-lg  w-full text-center bg-orange-50'/>
          </div>
      </form>
    </div>
  );
};

export default RangeSlider;
