import { useState, useEffect } from "react";
import "./ReviewDisplay.css"; // Assuming you have a CSS file for styles
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import renderStars from "./RenderStars";
import RatingBar from "./RatingStates";
const ReviewDisplay = ({productId}) => {
  const [ratingstats, setRatingStats] = useState([]);
  const handleAddreview =  async () => {
    // Logic to handle adding a review
    
    try {
      const response = await Axios({...SummaryApi.addReview, data: {productid:productId, rating:rating, comment:review}});
       console.log("Response from server:", response);
      if (response.status === 200) {
        console.log("Review submitted successfully:", response.data);
        // Close the modal after successful submission
        setIsModalOpen(false);
        
        toast.success("Review submitted successfully!");
        // Optionally, you can reset the form fields
        setRating(0);
        setReview("");
      } else {
        console.error("Failed to submit review:", response);
        // Handle error appropriately, e.g., show a notification
      }
      
    }
    catch (error) {
      console.log('this is error',error);
     if(error.response.status === 401){
        toast.error("Please login to submit a review.");
    }


    }
  }
   const [averageRating, setAverageRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const fetchallreviews = async () => { 
    try {

      const response = await Axios({...SummaryApi.getReview(productId)});
      console.log("Response from server:", response);
      setAllReviews(response.data.data);
      
      setRatingStats(response.data.ratingsStats);
      console.log("Rating stats: res", response.data.ratingsStats);
      
      
    } catch (error) { 
      console.error("Error fetching reviews:", error);
     
    }
  } 
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
     useEffect(() => {
      
      fetchallreviews();
     }, [productId]);

  // Disable page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const handleStarClick = (index) => {
    setRating(index);
    console.log("Rating submitted:", index);
  };

  return (
    <>
      {/* Main Layout */}
      <section className="flex flex-col lg:flex-row w-full p-4 gap-4">
        {/* Left Box */}
        <div className="w-full lg:w-1/3 h-fit bg-white p-6 rounded shadow flex flex-col justify-between font-semibold">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Customer Reviews
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center">
              <div className="text-8xl font-bold text-green-600 shine-text overflow-hidden">
                
              </div>
              <div className="text-sm text-gray-500">
                {allReviews.length||0} 
                 <span className="font-medium">Reviews</span>
              </div>
            </div>

            <div className="space-y-3">
           <RatingBar ratingstats={ratingstats}  />

            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleOpenModal}
              className="bg-orange-400 text-white px-4 py-2 rounded-full w-full font-semibold hover:bg-orange-500 transition duration-200"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Right Testimonials */}
        <div className="w-full lg:w-2/3 bg-white border p-4 rounded-xl overflow-y-auto max-h-[70vh]">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
     
            {allReviews.map((data, index) => (
              <div
                key={index}
                className="break-inside-avoid relative group text-sm leading-6 transition-all duration-300 hover:scale-[1.02] font-semibold"
              >
                <div className="absolute transition rounded-lg opacity-25 -inset-1 border blur duration-400 group-hover:opacity-100 group-hover:duration-200" />
                <a
                  
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <div className="relative p-6 mb-6 space-y-6 leading-none rounded-lg bg-gray-50 ring-1 ring-gray-900/5">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${data.user.avatar}`}  
                        alt={data.user.avatar}
                        className="w-12 h-12 bg-center bg-cover border rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {data.user.name}
                        </h3>
                        <p className="text-gray-500 text-xs flex">
                          {renderStars(data.rating)}
                       
                          </p>
                      </div>
                    </div>
                    <p className="leading-normal text-gray-600 text-md">
                      {data.comment}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
          <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-xl animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Submit Your Review
              </h3>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 font-semibold">
            <div className="flex items-center justify-center gap-1 text-4xl">
  {[1, 2, 3, 4, 5].map((index) => {
    const isRated = rating >= index;
    const isHovered = hoverRating >= index;

    return (
      <span
        key={index}
        className={`cursor-pointer transition-all duration-500 transform hover:scale-125
          ${isRated ? "text-yellow-400" : isHovered ? "text-gray-400" : "text-gray-300"}
        `}
        onClick={() => handleStarClick(index)}
        onMouseEnter={() => setHoverRating(index)}
        onMouseLeave={() => setHoverRating(0)}
      >
        ★
      </span>
    );
  })}
</div>


              {/* <textarea
                rows="4"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Write your review..."
              /> */}
              <div className="grid my-3">
                <div className="w-full relative flex rounded-xl">
                  <textarea
                    required
                    id="addressline"
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                    onChange={(e) => setReview(e.target.value)}

                  />
                  <label
                    htmlFor="addressline"
                    className="absolute  bg-white text-black/70 -translate-y-1/2 rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    Write your review
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end gap-2 font-semibold">
              <button
                onClick={handleCloseModal}
                className="px-4 py-1.5 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddreview}
                className="px-4 py-1.5 rounded-full text-white bg-orange-400 hover:bg-orange-500 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewDisplay;
