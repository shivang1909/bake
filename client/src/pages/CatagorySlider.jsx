    // CategorySlider.jsx
    import  { useEffect, useRef, useState } from "react";
    import Slider from "react-slick";
    import "slick-carousel/slick/slick.css";
    import "slick-carousel/slick/slick-theme.css";
    import "./CatagorySlider.css"; // Import your custom CSS file
    import SummaryApi from "../common/SummaryApi";
    import Axios from "../utils/Axios";
    import { valideURLConvert } from "../utils/valideURLConvert";
    import { Link } from "react-router-dom";

    const CategorySlider = ({ onRegister, onDone }) => {
      const [categories, setCategories] = useState([]);
      const sliderRef = useRef(null);

      

      useEffect(() => {
        fetchCategory();
      }, []);
      const fetchCategory = async () => {
        onRegister?.(); 
        const response = await Axios({ ...SummaryApi.getCategory });
        setCategories(response.data.data);
        onDone?.(); 
      };

      const settings = {
        dots: false,
        infinite: false,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        draggable: true,
        swipeToSlide: true,
        touchMove: true,
        centerMode: false, // 🔥 This centers the active slide
        centerPadding: "40px", // adjust padding as needed
        beforeChange: (current, next) => {
          // If we reach the last slide, reset to first
          if (
            next >= categories.length - settings.slidesToShow &&
            sliderRef.current
          ) {
            setTimeout(() => {
              sliderRef.current.slickGoTo(0); // Boom! Back to start
            }, 2000); // Match your autoplaySpeed
          }
        },
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 3,
              centerMode: false,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2.5,
              centerMode: false,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              centerMode: false,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              centerMode: true,
              centerPadding: "10px",
            },
          },
        ],
      };

      return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-6  lg:mt-5">
          <Slider {...settings} ref={sliderRef}>
            
            {categories.map((cat, i) => (
            
              <div
                key={i}
                className="px-2 transition-all duration-300 active:scale-95"
              >
                <div
                  className={`group rounded-[30px] border border-gray-200 p-3 flex items-center gap-4 bg-white cursor-pointer`}
                  
                >
                  <div className="rounded-xl">
                    <img
                      src={import.meta.env.VITE_API_URL+"/"+cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {cat.name}{" "}
                    </h3>
                    <Link to={`/Category/${valideURLConvert(cat.name)}-${cat._id}`} className="text-sm text-pink-500 font-semibold mt-1 inline-block"> 
                      Show All &raquo;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      );
    };

    export default CategorySlider;
