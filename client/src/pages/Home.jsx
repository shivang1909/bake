import React, { useEffect, useState } from "react";
import banner from "../assets/banner.jpg";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { Link, useNavigate } from "react-router-dom";
import CategorySlider from "./CatagorySlider";
import VideoSection from "./VideoSection";
import ProductsPanel from "../components/ProductsPanel";
import HomeProducts from "../components/HomeProducts";
import NewBanner from "../../assets/images/Custom/bannerNew3.png";
import BannerDesk from "../../assets/images/Custom/BannerDesk.jpg";
import Offer_and_Services from "../components/Offer_and_Services";
import FeatureCard from "../components/FeatureCard";
import Offer_banner_2 from "../../assets/images/Custom/offer_banner_2.webp";
import bannerMobile from "../assets/banner-mobile.webp";
import bannerMobile2 from "../assets/cheese_cake.webp";
// import BottomToolBar from '../components/BottomToolBar'
import { Swiper, SwiperSlide } from "swiper/react";
import {
  
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import axios from "axios";

const Home = () => {
  const [banners, setBanners] = useState({ mobileBanners: [], laptopBanners: [] })
  
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Updated to remove subcategory logic
  const handleRedirectProductListpage = (id, cat) => {
    // Directly generate the URL using category name and id
    const url = `/${valideURLConvert(cat)}-${id}`;

    navigate(url);
    console.log(url);
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/homebanner/getbanners`, { withCredentials: true })
      if (res.data.success) {
        setBanners(res.data.data)
      }
      console.log("banner testing ....")
      console.log(res.data)
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    }
  }


  useEffect(() => {
    fetchBanners()
  }, [])

  // Pick first active banners or fallback
  const activeLaptopBanners = banners.laptopBanners?.filter(b => b.status === 'active') || [];
  const activeMobileBanner = banners.mobileBanners.find(b => b.status === 'active')



  return (
    <section className="bg-white">
      <div className="container mx-auto lg:mt-24">
        {/* ✅ Desktop Swiper (only shown on md and up) */}
        <div className="hidden md:block">
          <Swiper
            effect="slide" // Optional, as "slide" is the default
            grabCursor={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            className="w-full"
          >
           
           {activeLaptopBanners.map((banner, index) => (
    <SwiperSlide key={index}>
      <div className="transition-all duration-100 active:scale-95 px-2">
        <img
          src={`${import.meta.env.VITE_API_URL}/${banner.imageUrl}`}
          alt={`banner-${index}`}
          className="w-full h-full border border-gray-200 hover:border-orange-300 rounded-[30px] object-cover"
        />
      </div>
    </SwiperSlide>
  ))}
           
          </Swiper>
        </div>
      </div>

      {/* ✅ Mobile Slider completely separate */}
      <div className="w-full h-fit px-4 md:hidden">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
        >
          {[bannerMobile, bannerMobile2].map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="transition-all duration-100 active:scale-95">
                <img
                  src={img}
                  alt={`mobile-banner-${idx}`}
                  className="w-full h-full rounded-[20px]"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="">
        <CategorySlider />
        {/* other content */}
      </div>

      {/* <ProductsPanel/> */}
      <HomeProducts />

      <div className="text-gray-950 font-semibold mt-10">
        <h2 className="text-md tracking-wider text-black uppercase">
          Taste The Legacy Today !
        </h2>
        <p className="text-sm text-gray-600 text-center px-3">
          <span className="font-bold">Since 2020</span> , our Indian brand has
          been delighting customers with an exquisite mithai, spice powders,
          namkeens, and tangy pickles.
        </p>
      </div>

      <VideoSection />
      <div className="flex items-center justify-center">
        <FeatureCard />
      </div>

      {/* <Offer_and_Services /> */}

      {/* <BottomToolBar/> */}

      {/* <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index) => {
              return(
                <div key={index + "loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                  <div className='bg-blue-100 min-h-24 rounded'></div>
                  <div className='bg-blue-100 h-8 rounded'></div>
                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return(
                <div key={cat._id + "displayCategory"} className='bg-white w-full h-full' onClick={() => handleRedirectProductListpage(cat._id, cat.name)}>
                  <div>
                    <img 
                      src={cat.image}
                      className='w-full h-full object-scale-down'
                    />
                  </div>
                </div>
              )
            })
          )
        }
      </div> */}

      {/*Display category products */}
      {/* {
        categoryData?.map((c, index) => {
          return(
            <CategoryWiseProductDisplay 
              key={c?._id + "CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      } */}

      {/* <div className="recent-purchase">
        <img src="assets/images/product-image/111_1.jpg" alt="payment image"/>
        <div className="detail">
            <p>Someone in new just bought</p>
            <h6>Rakshabandhan Gift Combo !</h6>
            <p>2 Minutes ago</p>
        </div>
        <a href="javascript:void(0)" className="icon-btn recent-close">×</a>
    </div> */}
    </section>
  );
};

export default Home;
