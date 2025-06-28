import  { useEffect, useRef, useState } from "react";
import CategorySlider from "./CatagorySlider";
import VideoSection from "./VideoSection";
import HomeProducts from "../components/HomeProducts";
import FeatureCard from "../components/FeatureCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa6";
import RingLoader from "./RingLoader";

const Home = () => {
  
  const [banners, setBanners] = useState({
    mobileBanners: [],
    laptopBanners: [],
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
    const [loading, setLoading] = useState(true);
      const [minDuration,setMinDuration] = useState(true);
  const pendingTasks = useRef(0);

  useEffect(() => {

    const initialScroll = () =>{
      document.body.scrollTo({ top: 0});
    }

    const handleScroll = () => {
      setShowScrollTop(document.body.scrollTop > 200); // show button after 200px scroll
    };

     const timeOutId = setTimeout(() => {
      setMinDuration(false)
    }, 1000);

    initialScroll();

    document.body.addEventListener("scroll", handleScroll);
       return () => {
      document.body.removeEventListener("scroll", handleScroll);
      clearTimeout(timeOutId);
    } 
  }, []);

  const scrollToTop = () => {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  };

    const registerTask = () => pendingTasks.current++;

      const markDone = () => {
    pendingTasks.current--;
    if (pendingTasks.current === 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      });
    }
  };


  const fetchBanners = async () => {
    registerTask();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/homebanner/getbanners`,
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log("✅ Banner data received:", res.data.data);
        setBanners(res.data.data);
      } else {
        console.warn("⚠️ Failed banner response:", res.data);
      }
    } catch (error) {
      console.error("❌ Error fetching banners:", error);
    } finally {
      markDone();
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Pick first active banners or fallback
  const activeLaptopBanners =
    banners?.laptopBanners?.filter((b) => b?.status === "active") || [];

  useEffect(() => {
    console.log("🧪 RAW banners state:", banners);
    console.log("✅ Active Laptop Banners:", activeLaptopBanners);
  }, [banners]);

  const activeMobileBanner =
    banners.mobileBanners.filter((b) => b.status === "active") || [];

  return (<>
    {(loading||minDuration) && <RingLoader/>}
    {
      
    <section className={`bg-white ${loading?"opacity-0":"opacity-100"} `}>
      <div className=" mt-20 lg:mt-24">
        {/* ✅ Desktop Swiper */}
        <div className="hidden md:block ">
          <Swiper
            spaceBetween={30}
            effect="slide"
            grabCursor={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            className="w-full"
          >
            {activeLaptopBanners.length > 0 ? (
              activeLaptopBanners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <div className="lg:h-fit md:h-auto px-2">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${banner.imageUrl}`}
                      loading="lazy"
                      alt={`banner-${index}`}
                      className="w-full h-full object-fit rounded-[30px] border-gray-200 "
                      onError={() =>
                        console.error(
                          `❌ Failed to load image for banner ${index}`
                        )
                      }
                    />
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <div className="text-center py-10">
                🚫 No active banners available
              </div>
            )}
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
          {activeMobileBanner.length > 0 ? (
            activeMobileBanner.map((banner, index) => (
              <SwiperSlide key={index}>
                <div className="transition-all duration-100 active:scale-95">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${banner.imageUrl}`}
                    loading="lazy"
                    alt={`mobile-banner-${index}`}
                    className="w-full h-full rounded-[20px]"
                    onError={() =>
                      console.error(
                        `❌ Failed to load image for banner ${index}`
                      )
                    }
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-center py-10">
              🚫 No active banners available
            </div>
          )}
        </Swiper>
      </div>

      <div className="">
        <CategorySlider onRegister={registerTask} onDone={markDone} />
        {/* other content */}
      </div>

      {/* <ProductsPanel/> */}
      <HomeProducts />

      <div className="text-gray-950 font-semibold mt-10">
        <h2 className="text-md tracking-wider text-black uppercase">
          Taste The Legacy Today !
        </h2>
        <p className="text-sm text-gray-600 text-center px-3">
    <b className="font-bold">Since 2020,</b> Bake Flavours has served <br />
    authentic sweets, rich spice blends,<br />  crunchy namkeens,  and zesty pickles
    with love and tradition.
  </p>
      </div>

      <VideoSection />
      <div className="flex items-center justify-center">
        <FeatureCard />
      </div>

     <button
                onClick={scrollToTop}
                className={`fixed bottom-5 right-5 z-40 w-[55px] h-[55px] rounded-full bg-gray-50/80 border border-gray-200 backdrop-blur-sm text-white p-3 shadow-inner transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-90 ${
                  showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <FaArrowUp className="w-full h-full text-orange-500" />
              </button>
    </section>
    }
    </>
  );
};

export default Home;
