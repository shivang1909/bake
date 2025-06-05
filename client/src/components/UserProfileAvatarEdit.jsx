import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { updatedAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  console.log(user.avatar);
  const [profile, setprofile] = useState(null);
  const [avatar, setavatar] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    setprofile(user.avatar);
    setavatar(null);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit ");

    if (!avatar) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("role", user.role);

    try {
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Update Redux store with new avatar
        dispatch(updatedAvatar(response.data.data.avatar));
        // Close the modal
        close();
        // Reset local state
        setprofile(null);
        setavatar(null);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleUploadAvatarImage = async (e) => {
    setprofile(URL.createObjectURL(e.target.files[0]));
    setavatar(e.target.files[0]);
  };

  // const handleUploadAvatarImage = async(e)=>{
  //     const file = e.target.files[0]

  //     if(!file){
  //         return
  //     }

  //     const formData = new FormData()
  //     formData.append('avatar',file)

  //     try {
  //         setLoading(true)
  //         const response = await Axios({
  //             ...SummaryApi.uploadAvatar,
  //             data : formData
  //         })
  //         const { data : responseData}  = response

  //         dispatch(updatedAvatar(responseData.data.avatar))

  //     } catch (error) {
  //         AxiosToastError(error)
  //     } finally{
  //         setLoading(false)
  //     }

  // }
  return (
    <section className="fixed inset-0 z-50 bg-white lg:bg-black bg-opacity-50  backdrop-blur-sm flex items-start justify-end md:items-center md:justify-center p-4">
    <div
      className={`
        bg-white h-fit w-full max-w-xs
        md:max-w-md md:h-auto md:rounded-2xl
        shadow-xl p-6 relative flex flex-col items-center
        transition-transform duration-300 ease-in-out rounded-xl mt-6 mr-6  lg:mr-0 border border-gray-300
      `}
    >
      {/* Close Button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition z-10"
      >
        <IoClose size={24} />
      </button>
  
      {/* Profile Preview */}
      <div className="mb-4 w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
        {profile ? (
          <img
            alt={user.name}
            src={profile}
            className="object-cover w-full h-full"
          />
        ) : (
          <FaRegUserCircle size={60} className="text-gray-400" />
        )}
      </div>
  
      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith("image/")) {
            handleUploadAvatarImage({ target: { files: [file] } });
          }
        }}
      >
        {/* Drag & Drop Upload */}
        <label
          htmlFor="uploadProfile"
          className="w-full border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-blue-50 transition rounded-xl p-4 text-center cursor-pointer text-sm"
        >
          <input
            id="uploadProfile"
            type="file"
            accept="image/*"
            onChange={handleUploadAvatarImage}
            className="hidden"
          />
          <div className="text-gray-600">
            {avatar ? `Selected: ${avatar.name}` : "Tap or drag image to upload"}
          </div>
        </label>
  
        {/* Submit Button */}
        {profile && (
          <button
            type="submit"
            className="w-full bg-orange-600 text-white text-sm font-semibold py-2 rounded-lg shadow hover:bg-orange-700 transition"
          >
            Update Profile
          </button>
        )}
      </form>
    </div>
  </section>
  

  );
};

export default UserProfileAvatarEdit;
