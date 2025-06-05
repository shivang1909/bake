import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { MdMyLocation } from "react-icons/md";
import { AiOutlineAlert } from "react-icons/ai";
import Address from "../../assets/images/Custom/address.svg";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdOutlineAddLocationAlt } from "react-icons/md";

const AddAddressDesktop = ({ open, close, data = {}, mode = "add" }) => {
  const isEdit = mode === "edit";
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      _id: data._id || "",
      name: data.name || "",
      address_line1: data.address_line1 || "",
      address_line2: data.address_line2 || "",
      city: data.city || "",
      state: data.state || "",
      country: data.country || "",
      pincode: data.pincode || "",
      mobile: data.mobile || "",
    },
  });
  const { fetchAddress } = useGlobalContext();
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const pincodeValue = watch("pincode");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [pincodeTouched, setPincodeTouched] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(true);

  useEffect(() => {
    setPincodeChecked(false); // Reset check when user types again
    setShowCheckButton(true); // Show the button again
  }, [pincodeValue]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`
      );

      const data = await res.json();
      if (data.status === "OK") {
        const result = data.results[0];
        const components = result.address_components;

        const getComponent = (type) =>
          components.find((c) => c.types.includes(type))?.long_name || "";

        setValue("addressline", result.formatted_address);
        setValue("city", getComponent("locality"));
        setValue("state", getComponent("administrative_area_level_1"));
        setValue("country", getComponent("country"));
        setValue("pincode", getComponent("postal_code"));
        toast.success("Address updated");
      } else {
        toast.error("Unable to get address.");
      }
    } catch (error) {
      console.error("Reverse Geocode Error:", error);
      toast.error("Failed to reverse geocode.");
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setMarkerPosition({ lat: latitude, lng: longitude });
      setMapVisible(true);
      reverseGeocode(latitude, longitude);
    });
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    reverseGeocode(lat, lng);
  };

  const onSubmit = async (formData) => {
    if (!pincodeChecked) {
      toast.error("Please validate the pincode before submitting.");
      return;
    }

    try {
      const apiConfig = isEdit
        ? SummaryApi.updateAddress
        : SummaryApi.createAddress;
      const response = await Axios({ ...apiConfig, data: formData });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        close();
        reset();
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const checkPincode = async () => {
    if (pincodeValue.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincodeValue}`
      );
      const data = await response.json();

      const postOffice = data[0]?.PostOffice?.[0];

      if (postOffice && postOffice.District.toLowerCase() === "ahmedabad") {
        setValue("city", "Ahmedabad");
        setValue("state", "Gujarat");
        setValue("country", "India");
        setPincodeChecked(true);
        setShowCheckButton(false); // Hide the button when verified
        toast.success("Pincode is valid for Ahmedabad.");
      } else {
        toast.error(
          "We only deliver in Ahmedabad. Please enter a valid Ahmedabad pincode."
        );
        setPincodeChecked(false);
      }
    } catch (error) {
      toast.error("Failed to verify pincode.");
      setPincodeChecked(false);
    }
  };

  React.useEffect(() => {
    setPincodeChecked(false);
    setValue("city", "");
    setValue("state", "");
    setValue("country", "");
  }, [pincodeValue]);

  return (
    <section
      className={`fixed inset-0 z-50 bg-black bg-opacity-70 transition-opacity duration-300 ease-in-out
      ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }
      flex lg:items-center lg:justify-center
    `}
    >
      <div
        className={`bg-white w-full max-w-lg lg:max-w-7xl transition-all duration-300 overflow-y-auto ease-in-out transform z-50
        ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full lg:-translate-y-10"
        }
        fixed bottom-0 lg:relative
        h-[75%] lg:h-auto
        rounded-t-3xl lg:rounded-xl
        shadow-lg
      `}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center gap-4 bg-[#ff8a23] text-white pb-3 p-4 rounded-t-xl">
          <span className="font-semibold flex items-center gap-2 px-2 text-lg">
            <MdOutlineAddLocationAlt className="text-xl" /> Add Address
          </span>

          <button
            onClick={close}
            className="hover:rotate-90 transition-transform duration-300"
          >
            <IoClose size={28} />
          </button>
        </div>

        <div className="addresscontent flex flex-col lg:flex-row-reverse gap-2 overflow-y-auto h-[80vh]">
          <div className="w-full lg:w-2/5 sm:overflow-y-auto lg:overflow-hidden">
            {/* Only show image and button when map is NOT visible */}
            {!mapVisible && (
              <div className="m-0 lg:m-3 max-w-md h-[50vh] lg:h-fit w-full p-4 border-gray-400 rounded-xl flex flex-col justify-center items-center text-center">
                <div className="text-4xl text-gray-400 mb-2"></div>
                <img
                  src={Address}
                  alt="address"
                  className="h-32 w-32 lg:h-64 lg:w-64"
                />
                <p className="font-semibold text-gray-600 mb-1 mt-5">
                  No Address Found
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Add your address to proceed with checkout.
                </p>
                <button
                  onClick={handleUseCurrentLocation}
                  className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-full transition-all duration-300 active:scale-95"
                >
                  Use Current Location
                </button>
              </div>
            )}
            {/* Mobile map */}
            {isLoaded && mapVisible && (
              <div className="block lg:hidden h-64 shadow-md overflow-hidden">
                <GoogleMap
                  center={markerPosition}
                  zoom={12}
                  onClick={handleMapClick}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                  {markerPosition && (
                    <Marker
                      position={markerPosition}
                      draggable
                      onDragEnd={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        setMarkerPosition({ lat, lng });
                        reverseGeocode(lat, lng);
                      }}
                    />
                  )}
                </GoogleMap>
              </div>
            )}

            {/* Desktop map */}
            <div className="hidden lg:block h-full shadow-md overflow-hidden mb-5">
              {isLoaded && mapVisible && (
                <GoogleMap
                  center={markerPosition}
                  zoom={12}
                  onClick={handleMapClick}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                  {markerPosition && (
                    <Marker
                      position={markerPosition}
                      draggable
                      onDragEnd={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        setMarkerPosition({ lat, lng });
                        reverseGeocode(lat, lng);
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>

            {/* Only show map when isLoaded && mapVisible */}
          </div>
          <div className="w-full lg:w-3/5">
            <form
              className="mt-4 grid gap-2 px-5 pb-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <p className="text-xs lg:text-sm bg-red-100 py-1 rounded-lg w-full md:w-fit px-3 text-red-400  mt-2 flex items-center gap-2">
                <RiErrorWarningLine className="text-lg" /> We currently deliver
                only in Ahmedabad.
              </p>
              <div className="grid grid-cols-2 gap-5">
                <div className="grid my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      required
                      type="text"
                      id="name"
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white border border-gray-200 border-2 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                      {...register("name", { required: true })}
                    />
                    <label
                      htmlFor="name"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      Name
                    </label>
                  </div>
                </div>
                <div className="grid my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      required
                      type="text"
                      id="mobile"
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                      {...register("mobile", { required: true })}
                    />
                    <label
                      htmlFor="mobile"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      Mobile No
                    </label>
                  </div>
                </div>

              </div>

              <div className="grid my-3">
                <div className="w-full relative flex rounded-xl">
                  <input
                    required
                    type="text"
                    id="address_line1"
                    {...register("address_line1", { required: true })}
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                  />
                  <label
                    htmlFor="address_line1"
                    className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    Address Line
                  </label>
                </div>
              </div>
              <div className="grid my-3">
                <div className="w-full relative flex rounded-xl">
                  <input
                    required
                    type="text"
                    id="address_line2"
                    {...register("address_line2", { required: true })}
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                  />
                  <label
                    htmlFor="address_line2"
                    className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    Address Line 2
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 my-3 items-center justify-center gap-3">
                <div className="w-full relative flex items-center rounded-xl bg-white border border-2 border-gray-200 focus-within:ring-1 focus-within:ring-orange-300">
                  {/* Pincode Input */}
                  <input
                    required
                    type="text"
                    id="pincode"
                    {...register("pincode", { required: true })}
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight"
                  />

                  {/* Floating Label */}
                  <label
                    htmlFor="pincode"
                    className="absolute mt-3 bg-white text-black/70 -translate-y-1/2 left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    Pincode
                  </label>

                  {/* Inline Check Button */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {pincodeChecked && !showCheckButton ? (
                      <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-md border border-green-200 text-sm">
                        Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={checkPincode}
                        className="px-3 py-1 bg-orange-100 text-sm border border-orange-400 rounded-md"
                      >
                        Check
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      required
                      type="text"
                      id="city"
                      disabled={!pincodeChecked}
                      {...register("city", { required: true })}
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                    />
                    <label
                      htmlFor="city"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      City
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
              

                {/* <div className="grid gap-1">
                  <label htmlFor="city">City :</label>
                  <input
                    type="text"
                    id="city"
                    className="border bg-gray-50 rounded-xl px-2"
                    {...register("city", { required: true })}
                  />
                </div> */}

                <div className="grid my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      required
                      type="text"
                      id="state"
                      disabled={!pincodeChecked}
                      {...register("state", { required: true })}
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                    />
                    <label
                      htmlFor="state"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      State
                    </label>
                  </div>
                </div>

                <div className="grid my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      required
                      type="text"
                      id="country"
                      disabled={!pincodeChecked}
                      {...register("country", { required: true })}
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                    />
                    <label
                      htmlFor="country"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      Country
                    </label>
                  </div>
                </div>
              </div>

            

              <button
                type="submit"
                disabled={!pincodeChecked}
                className="w-full bg-orange-500 border border-orange-500 lg:w-60 text-white py-3 mt-2 mb-2 lg:mt-0 lg:mb-0 font-semibold hover:bg-orange-400 hover:text-white rounded-xl transition-all duration-200 ease-in-out active:scale-95"
              >
                Save Shipping Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddAddressDesktop;
