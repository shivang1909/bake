// components/MapPopup.jsx
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapPopup = ({ lat, lng, onConfirm, onClose }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // or process.env.REACT_APP_ if using CRA
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white p-4 rounded-xl max-w-md w-full shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Confirm Location</h2>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat, lng }}
          zoom={15}
        >
          <Marker position={{ lat, lng }} />
        </GoogleMap>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(lat, lng)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPopup;
