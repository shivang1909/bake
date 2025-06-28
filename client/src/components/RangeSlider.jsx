import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactSlider from "react-slider";
import "./RangeSlider.css"; // Optional styling

const RangeSlider = ({ values, setValues, isDirect, setDirect }) => {
  const [tempPriceRange, setTempPriceRange] = useState(values);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  // Refs to hold latest values and tempPriceRange
  const latestValuesRef = useRef(values);
  const latestTempPriceRangeRef = useRef(tempPriceRange);

  // Keep refs updated with current state
  useEffect(() => {
    latestValuesRef.current = values;
  }, [values]);

  useEffect(() => {
    latestTempPriceRangeRef.current = tempPriceRange;
  }, [tempPriceRange]);

  const handleSliderChange = (newValues) => {
    setTempPriceRange(newValues);
    setHasInteracted(true);
  };

  const handleApply = () => {
    setValues(tempPriceRange);
    showConfirmDialog && setShowConfirmDialog(false);
    setHasInteracted(false);
  };

  const handleRevert = () => {
    setTempPriceRange(values);
    setShowConfirmDialog(false);
    setHasInteracted(false);
  };

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = showConfirmDialog ? "hidden" : "auto";
    }
  }, [showConfirmDialog]);

  useEffect(() => {
    if (isDirect) {
      setTempPriceRange(values);
      setDirect(false);
    }
  }, [values, isDirect, setDirect]);

  useEffect(() => {
    if (hasInteracted) {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          const temp = latestTempPriceRangeRef.current;
          const val = latestValuesRef.current;

          if (temp[0] !== val[0] || temp[1] !== val[1]) {
            setShowConfirmDialog(true);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [hasInteracted]);

  return (
    <div className="relative px-2">
      <div
        ref={containerRef}
        className="range-slider-container py-4 bg-white rounded-lg"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="block font-semibold text-gray-700">
              Price - ₹
            </span>
            <button
              type="button"
              onClick={handleApply}
              className="border border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white px-3 py-1 text-xs"
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
        </div>
      </div>

      {showConfirmDialog &&
        createPortal(
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

export default RangeSlider;
