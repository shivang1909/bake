import React from "react";
import "./Footer.css"
import footerillustration from "../../assets/images/Custom/footer-illustration.png";
import { LuDot } from "react-icons/lu";


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
                Bake Flavour<span className="text-orange-400">.</span>
              </a>

              <p className="footer-text">
                Ahmedabad Located "Bake Flavour" — Ultimate shop of cakes,
                namkeen, sweets, and more.
              </p>

              <ul className="social-list">
                <li>
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <i className="fab fa-pinterest"></i>
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
                <p className="footer-list-title">Opening Hours</p>
              </li>
              <li>
                <p className="footer-list-item">Monday–Friday: 08:00–22:00</p>
              </li>
              <li>
                <p className="footer-list-item">Tuesday 4PM: Till Midnight</p>
              </li>
              <li>
                <p className="footer-list-item">Saturday: 10:00–16:00</p>
              </li>
            </ul>

            <ul className="footer-list lg:ml-12">
              <li>
                <p className="footer-list-title">What We Serve</p>
              </li>
              <li>
                <p className="footer-list-item">Monday–Friday: 08:00–22:00</p>
              </li>
              <li>
                <p className="footer-list-item">Tuesday 4PM: Till Midnight</p>
              </li>
              <li>
                <p className="footer-list-item">Saturday: 10:00–16:00</p>
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
