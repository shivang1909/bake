import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ContactUs = () => {
   const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
        const handleScroll = () => {
          setShowScrollTop(document.body.scrollTop > 200); // show button after 200px scroll
        };
    
        document.body.addEventListener("scroll", handleScroll);
        return () => document.body.removeEventListener("scroll", handleScroll);
      }, []);
    
      const scrollToTop = () => {
        document.body.scrollTo({ top: 0, behavior: "smooth" });
      };
  return (
    <div className="max-w-7xl mx-auto px-5 py-16 mt-5 lg:py-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-orange-600">Contact Bake Flavours</h2>
        <p className="mt-2 text-gray-600">
          Have a question or feedback? We'd love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact Info / Illustration */}
        <div className="order-2 lg:order-1  text-center lg:text-left">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Visit Us</h3>
          <p className="text-gray-600 mb-4">
            123 Sweet Street, Cake City, Delightland 400001
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Call Us</h3>
          <p className="text-gray-600 mb-4">+91 98765 43210</p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Email</h3>
          <p className="text-gray-600 mb-4">support@bakeflavours.com</p>

          <Link
            to="/"
            className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full transition"
          >
            Back to Home
          </Link>
        </div>
        {/* Contact Form */}
        <div className=" order-1 lg:order-2 bg-white shadow-lg rounded-3xl p-8 border border-orange-100">
          <h3 className="text-2xl font-semibold text-brown-800 mb-6">Send us a message</h3>
          <form className="space-y-5">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-gray-700">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-gray-700">Phone Number</label>
              <input
                type="tel"
                placeholder="123-456-7890"
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-gray-700">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-full transition"
            >
              Send Message
            </button>
          </form>
        </div>

        
      </div>
       <button
                                onClick={scrollToTop}
                                className={`fixed bottom-5 right-5 z-40 w-[55px] h-[55px] rounded-full bg-gray-50/80 border border-gray-200 backdrop-blur-sm text-white p-3 shadow-inner transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-90 ${
                                  showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
                                }`}
                              >
                                <FaArrowUp className="w-full h-full text-orange-500" />
                              </button>
    </div>
    
  );
};

export default ContactUs;
