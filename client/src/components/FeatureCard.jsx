import React, { useEffect, useState } from "react";
import {
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaCalendarAlt,
} from "react-icons/fa";
import FeatureBanner from "../../src/assets/Featurebanner.jpg"; // Adjust the path as necessary
import Blob1 from "../../src/assets/blob.svg";

const featuresLeft = [
  {
    icon: <FaShippingFast />,
    title: "Quick & Fresh Delivery",
    text: "From oven to doorstep – we ensure speedy delivery of fresh bakery and snack items across India.",
    blobColor: "bg-orange-400",
  },
  {
    icon: <FaShieldAlt />,
    title: "Quality You Can Trust",
    text: "Each bite is made with premium ingredients, hygienic practices, and loads of love – guaranteed!",
    blobColor: "bg-[#00ABB8]",
  },
];

const featuresRight = [
  {
    icon: <FaHeadset />,
    title: "Friendly Customer Support",
    text: "Got a craving or query? We're always just a message away to help you with your orders.",
    blobColor: "bg-[#00ABB8]",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Festive & Daily Offers",
    text: "Celebrate every day with exciting discounts on cakes, namkeens, mithai, and more!",
    blobColor: "bg-orange-400",
  },
];

const FeatureCard = () => {
  const [isIPadMini, setIsIPadMini] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isIPadMiniSize =
        window.innerWidth === 768 && window.innerHeight === 1024;
      setIsIPadMini(isIPadMiniSize);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);
  return (
    <>
      <div className="flex justify-center items-center py-10">
        <div
          className={`flex ${
            isIPadMini ? "flex-col" : "flex-col md:flex-row md:flex-wrap"
          } items-center gap-8 max-w-7xl w-full px-4`}
        >
          {/* Left Features */}
          {/* Left Features */}
          <div className="flex flex-col gap-10 font-normal flex-1 min-w-[280px] md:min-w-[250px]">
            {featuresLeft.map((feature, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row justify-end gap-2 md:gap-4 ${
                    isIPadMini
                      ? "items-start text-left"
                      : "items-center md:items-start text-center md:text-right"
                  }`}
                >
                  {isIPadMini ? (
                    <>
                      <div
                        className={`${feature.blobColor} w-12 h-12 px-5 rounded-full flex items-center justify-center shadow-md`}
                      >
                        <span className="text-white text-3xl md:text-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-lg">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 break-words">
                          {feature.text}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col order-2 md:order-1">
                        <h3 className="font-semibold text-lg">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 break-words">
                          {feature.text}
                        </p>
                      </div>
                      <div
                        className={`${feature.blobColor} w-12 h-12 px-5 rounded-full flex items-center justify-center shadow-md order-1 md:order-2`}
                      >
                        <span className="text-white text-3xl md:text-lg">
                          {feature.icon}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Center Poster */}
          {!isIPadMini && (
            <div className="w-48 h-48 lg:w-72 lg:h-72 flex-shrink-0 hidden md:block">
              <img
                src={FeatureBanner}
                alt="Delivery Poster"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Right Features */}
          <div className="flex flex-col gap-10 font-normal flex-1 min-w-[280px] md:min-w-[250px]">
            {featuresRight.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center md:items-start justify-start text-center md:text-left gap-2 md:gap-4"
              >
                <div
                  className={`${feature.blobColor} w-12 h-12 px-5 py-4 rounded-full flex items-center justify-center shadow-md`}
                >
                  <span className="text-white text-3xl md:text-lg">
                    {feature.icon}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-600 break-words">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureCard;
