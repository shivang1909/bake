import React, { useEffect, useRef, useState } from 'react';
import ReactSlider from 'react-slider';
import './ShelfLifeSlider.css'; // Optional styles — no direction flip here
import { createPortal } from 'react-dom';

const ShelfLifeSlider = ({value,setValue,isDirect,setDirect}) => {
  
  const [tempPrice, setTempPrice] = useState(value);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const containerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false); // To avoid popup on mount
  
  const handleSliderChange = (newValue) => {
    setTempPrice(newValue)  
    setHasInteracted(true);
  };
  
  const handleApply = () => {
    setValue(tempPrice);
    showConfirmDialog && setShowConfirmDialog(false); 
    setHasInteracted(false);
    };

        useEffect(() => {
          if(window.innerWidth>=1024)
          if (showConfirmDialog) {
            document.body.style.overflow = "hidden"; // Disable scrolling
          } else {
            document.body.style.overflow = "auto"; // Enable scrolling
          }
        }, [showConfirmDialog]);

        useEffect(()=>{
                if(isDirect)
          {
            setTempPrice(value);
            setDirect(false)
          }
        },[value])
    
    // 👇 Detect focus-out from slider
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            containerRef.current &&
            !containerRef.current.contains(event.target)
          ) {
            if (
              hasInteracted &&
              (tempPrice !== value)
            ) {
              setShowConfirmDialog(true);
              document.removeEventListener("mousedown", handleClickOutside);
            }
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
      }, [hasInteracted]);
      
      const handleRevert = () => {
        setTempPrice(value);
        setShowConfirmDialog(false);
        setHasInteracted(false);
      };
      

  return (
    <div className="relative">
    <div ref={containerRef} className="range-slider-container">
      <div>
        <div className='flex items-center justify-between'>
        <span className="block font-semibold text-gray-700">
          Shelf Life - in Days
        </span>

    <button className='border border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white px-3 py-1 text-xs' onClick={handleApply} type='button'>
        Apply
    </button>
        </div>

        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          value={tempPrice}
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
            value={`Shelf Life: ${tempPrice} days`}
            readOnly
            className="border rounded-full w-full text-center bg-orange-50 font-medium"
          />
        </div>
      </div>
    </div>
              {showConfirmDialog && createPortal(
        <div className="fixed inset-0 z-[99999999] bg-slate-900 bg-opacity-50 flex items-center justify-center transition-all duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-2xl text-center space-y-4 w-[300px]">
            <p className="text-gray-800 font-semibold text-lg">
              You have unsaved changes
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleApply}
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
        </div>,
          document.body 
      )}
    </div>
  );
};

export default ShelfLifeSlider;
