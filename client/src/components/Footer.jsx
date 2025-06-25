import React from "react";
import "../assets/styles/Footer.css"
import footerillustration from "../../assets/images/Custom/footer-illustration.png";
import { LuDot } from "react-icons/lu";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";


const Footer = () => {
  const items = [
    "Kaju Katli", "Rasgulla", "Soan Papdi", "Mysore Pak",
    "Bhujia", "Sev", "Chakli", "Mathri",
    "Bread", "Puff", "Cake", "Cookies",
    "Bread", "Puff", "Cake", "Cookies",
  ];
  return (
    <>
    <div className="justify-center items-center flex flex-col ">
       <div className="marquee">
      <div className="marquee-track">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="marquee-item flex items-center">{item} <LuDot className="text-2xl font-extrabold -mr-8"/></span>
        ))}
      </div>
    </div>
    </div>
    
      <footer className="footer font-semibold">
        <div
          className="footer-top"
          style={{
            backgroundImage: "url('../../assets/images/Custom/footer-illustration.png')",
          }}
        >
          <div className="container">
            <div className="footer-brand">
              <a href="#" className="text-4xl flex">
                Bake Flavours<span className="text-orange-400">.</span>
              </a>

              <p className="footer-text">
                Ahmedabad Located "Bake Flavour" Ultimate shop of Sweets,
                namkeen, cakes, farsan and more.
              </p>

              <ul className="social-list gap-5">
                <li>
                  <a href="#" className="p-1.5 bg-gray-100 rounded-xl ">
                  <FaInstagram className="text-lg"/>

                  </a>
                </li>
                <li>
                  <a href="#" className="p-1.5 bg-gray-100 rounded-xl ">
                  <FcGoogle className="text-lg"/>
                  </a>
                </li>
                <li>
                  <a href="#" className="p-1.5 bg-gray-100 rounded-xl ">
                  <FaFacebook className="text-lg"/>
                  </a>
                </li>
                <li>
                  <a href="#" className="p-1.5 bg-gray-100 rounded-xl ">
                    <BsTwitterX className="text-lg"/>
                  </a>
                </li>
              </ul>
            </div>

            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Contact Info</p>
              </li>
              <li>
                <p className="footer-list-item">+91 6353157921</p>
              </li>
              <li>
                <p className="footer-list-item">triospheretech@gmail.com</p>
              </li>
              <li>
                <address className="footer-list-item">
                  1205, Phoenix, Vijay Cross Road, Ahmedabad, Gujarat, India.
                </address>
              </li>
            </ul>

            <ul className="footer-list">
              <li>
                <p className="footer-list-title">Quick Links</p>
              </li>
              <li>
                <Link to="/">
                <p className="footer-list-item">Home</p>
                </Link>
              </li>
              <li>
                <Link to="/shopall">
                <p className="footer-list-item">Shop all</p>
                </Link>
              </li>
              <li>
                <Link to="/Category/Sweets-67ade28fcab3e4e31c09cd0f">
                <p className="footer-list-item">Categories</p>
                </Link>
              </li>
              <li>
                <Link to="/Featured/Trending-Section-6842c3985e487e24a4e62882">
                <p className="footer-list-item">Featured</p>
                </Link>
              </li>
            </ul>

            <ul className="footer-list lg:ml-12">
              <li>
                <p className="footer-list-title">About Us</p>
              </li>
              <li>
                <p className="footer-list-item">About Bake Flavours</p>
              </li>
              <li>
                <p className="footer-list-item">Terms & Conditions</p>
              </li>
              <li>
                <p className="footer-list-item">Privacy-Policy</p>
              </li>
            </ul>

          
           
           
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p className="copyright-text">
              &copy; 2024{" "}
              <a href="#" className="copyright-link">
                Bake Flavour
              </a>{" "}
              All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
