import React, { useEffect, useRef, useState } from "react";
import ReactSlider from "react-slider";
import "./RangeSlider.css"; // Optional styling

const RangeSlider = ({values,setValues,isDirect,setDirect}) => {

  const [tempPriceRange, setTempPriceRange] = useState(values);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const containerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false); // To avoid popup on mount

  const handleSliderChange = (newValues) => {
    setTempPriceRange(newValues)  
    setHasInteracted(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setValues(tempPriceRange);
    setShowConfirmDialog(false); 
  };

    // 👇 Detect focus-out from slider
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          if (
            hasInteracted &&
            (tempPriceRange[0] !== values[0] || tempPriceRange[1] !== values[1])
          ) {
            setShowConfirmDialog(true);
          }
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      if(isDirect)
      {
        setTempPriceRange(values);
        setShowConfirmDialog(false); 
        setDirect(false)
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [tempPriceRange, values, hasInteracted]);
  
    const handleRevert = () => {
      setTempPriceRange(values);
      setShowConfirmDialog(false);
      setHasInteracted(false);
    };

    return (
      <div className="relative px-2">
        <div ref={containerRef} className="range-slider-container py-4 bg-white rounded-lg ">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-2">
              <span className="block font-semibold text-gray-700">Price - ₹</span>
              <button
                type="submit"
                className="border border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white px-3 py-1 text-xs"
                onClick={handleSubmit}
              >
                Apply
              </button>
            </div>
  
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="slider-thumb"
              trackClassName="slider-trackk"
              value={tempPriceRange}
              onChange={handleSliderChange}
              min={0}
              max={1000}
              step={10}
              withTracks={true}
              minDistance={10}
              pearling={false}
            />
  
            <div className="flex justify-between gap-2 mt-2">
              <input
                type="text"
                value={tempPriceRange[0]}
                readOnly
                className="border rounded-full w-full text-center bg-gray-50 shadow-inner"
              />
              <input
                type="text"
                value={tempPriceRange[1]}
                readOnly
                className="border rounded-full w-full text-center bg-gray-50 shadow-inner"
              />
            </div>
          </form>
        </div>
  
        {showConfirmDialog && (
  <div className="fixed inset-0 z-[99999999] bg-slate-900 bg-opacity-50 flex items-center justify-center transition-all duration-300">
    <div className="bg-white p-6 rounded-2xl shadow-2xl text-center space-y-4 w-[300px]">
      <p className="text-gray-800 font-semibold text-lg">
        You have unsaved changes
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Apply Changes
        </button>
        <button
          onClick={handleRevert}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
        >
          Revert
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    );
  };

export default RangeSlider;
