import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import Axios from "../utils/Axios";


const HeroSection = () => {
  const [deviceType, setDeviceType] = useState("mobile");
  const [selectedFile, setSelectedFile] = useState(null);
  const [banners, setBanners] = useState({ mobile: [], laptop: [] });


  const fetchBanners = async () => {
    try {
       const res = await Axios({
      ...SummaryApi.getBanners,
      withCredentials: true, // if needed
    });
      const data = res.data.data || {};


      setBanners({
        mobile: data.mobileBanners || [],
        laptop: data.laptopBanners || [],
      });
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };


 const handleUpload = async () => {
  if (!selectedFile) return alert("Select an image");


  const formData = new FormData();
  formData.append("image", selectedFile);
  formData.append("deviceType", deviceType);


  try {
    await Axios({
      ...SummaryApi.addBanner,
      url: `${SummaryApi.addBanner.url}?deviceType=${deviceType}`,
      data: formData,
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    setSelectedFile(null);
    fetchBanners();
  } catch (error) {
    console.error("Upload failed:", error);
  }
};


const handleStatusChange = async (bannerId, currentStatus, device) => {
  const newStatus = currentStatus === "active" ? "inactive" : "active";


  try {
    await Axios({
      ...SummaryApi.updatestatus,
      data: {
        bannerId,
        deviceType: device,
        status: newStatus,
      },
      withCredentials: true,
    });


    fetchBanners();
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong while updating banner status.");
    }
  }
};




const handleDelete = async (bannerId, device) => {


  try {
    await Axios({
      ...SummaryApi.deleteBanner,
      data: {
        bannerId,
        deviceType: device,
      },
      withCredentials: true,
    });


    fetchBanners();
  } catch (error) {
    console.error("Delete failed:", error);
  }
};


  useEffect(() => {
    fetchBanners();
  }, []);


  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Hero Section Banner</h1>


      {/* Upload Section */}
      <div className="mb-6">
        <label className="block mb-2">Select Device Type to Upload</label>
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          className="border p-2 mb-4"
        >
          <option value="mobile">Mobile</option>
          <option value="laptop">Laptop</option>
        </select>


        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block mb-2"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload Banner
        </button>
      </div>


      {/* Mobile Banners Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Mobile Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(banners.mobile || []).length === 0 && (
            <p className="text-gray-500">No mobile banners uploaded.</p>
          )}
          {(banners.mobile || []).map((banner) => (
            <div key={banner._id} className="border p-2 rounded shadow">
              <img
                src={`${import.meta.env.VITE_API_URL}/${banner.imageUrl}`}
                alt="Mobile Banner"
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2 flex justify-between items-center">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    banner.status === "active"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {banner.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(banner._id, banner.status, "mobile")
                    }
                    className="text-sm bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id, banner.deviceType)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Laptop Banners Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Laptop Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(banners.laptop || []).length === 0 && (
            <p className="text-gray-500">No laptop banners uploaded.</p>
          )}
          {(banners.laptop || []).map(
            (banner) => (
              (
                <div key={banner._id} className="border p-2 rounded shadow">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${banner.imageUrl}`}
                    alt="Laptop Banner"
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        banner.status === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {banner.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            banner._id,
                            banner.status,
                            "laptop"
                          )
                        }
                        className="text-sm bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(banner._id, banner.deviceType)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};


export default HeroSection;
