import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const ProductsPanel = () => {
  const [activeTab, setActiveTab] = useState("all");
  return (
    <>
      <section className="section ec-product-tab section-space-p">
        <div className="container align-content-center">
          <div className="row align-content-center justify-center">
            <div className="col-lg-9 col-md-12">
              <div className="row space-t-50">
                <div className="col-md-12"></div>

                <div className="col-md-12">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b gap-4 md:gap-0">
                    {/* Heading */}
                    <div className="font-semibold text-2xl text-center md:text-left">
                      <h2 className="">{activeTab}</h2>
                    </div>

                    {/* Tabs - Scrollable on Mobile */}
                    <div className="relative overflow-hidden">
                      {/* Left Fog Overlay */}
                      <div className="block md:hidden absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

                      {/* Right Fog Overlay */}
                      <div className="block md:hidden absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

                      {/* Scrollable Tabs */}
                      <div className="overflow-x-auto w-full md:w-auto">
                        <ul className="flex gap-3 w-max md:w-auto px-2 ">
                          {[
                            { label: "Trending", value: "all" },
                            { label: "New Arrival", value: "Sweets" },
                            { label: "Hot & Fresh", value: "Namkeen" },
                            { label: "Bakery", value: "Bakery" },
                          ].map((tab) => (
                            <li key={tab.value} className="shrink-0">
                              <a
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActiveTab(tab.value);
                                }}
                                className={`inline-block font-bold rounded-full tracking-widest cursor-pointer p-3 transition duration-300 active:scale-95 ${
                                  activeTab === tab.value
                                    ? "bg-orange-500 text-white"
                                    : "bg-transparent text-black hover:bg-gray-100"
                                }`}
                              >
                                {tab.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row margin-minus-b-15">
                <div className="col">
                  <div className="tab-content">
                    {activeTab === "all" && (
                      <div>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/11.webp"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/12.webp"
                                      alt="Product"
                                    />
                                  </a>
                                  <span className="percentage">20%</span>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="px-5 mb-2 text-[15px] uppercase font-bold text-black">
                                    Pastrey
                                  </h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Sweet and Sour Pastry
                                  </a>
                                </h5>

                                <div className="flex justify-between items-center px-2">
                                  {/* Price */}
                                  <div className="ec-price">
                                    <span className="new-price text-[15px] font-semibold text-black">
                                      ₹58.00
                                    </span>
                                    <span className="old-price ml-2 line-through text-gray-500 text-sm">
                                      ₹65.00
                                    </span>
                                  </div>

                                  {/* Stars */}
                                  <div className="ec-pro-rating flex gap-1 text-yellow-500 text-sm">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                  </div>
                                </div>

                                {/* Full width button under it */}
                                <div className="mt-3 px-2">
                                  <button className="w-full font-bold bg-red-500 text-white text-sm px-3 py-2 rounded-full hover:bg-orange-600 transition duration-200 active:scale-95 flex items-center justify-center gap-1">
                                    Add{" "}
                                    <IoIosAddCircleOutline className="text-lg" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/97_1.jpg"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/97_2.jpg"
                                      alt="Product"
                                    />
                                  </a>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="ec-pro-stitle">Sports</h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Trekking & Running Shoes - black
                                  </a>
                                </h5>
                                <div className="ec-pro-rat-price">
                                  <span className="ec-pro-rating">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                    <i className="ecicon eci-star"></i>
                                  </span>
                                  <span className="ec-price">
                                    <span className="new-price">$58.00</span>
                                    <span className="old-price">$64.00</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "Sweets" && (
                      <div>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/94_1.jpg"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/94_2.jpg"
                                      alt="Product"
                                    />
                                  </a>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="ec-pro-stitle">Jackets</h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Mens Winter Leathers Jackets
                                  </a>
                                </h5>
                                <div className="ec-pro-rat-price">
                                  <span className="ec-pro-rating">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                  </span>
                                  <span className="ec-price">
                                    <span className="new-price">$59.00</span>
                                    <span className="old-price">$87.00</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/95_1.jpg"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/95_2.jpg"
                                      alt="Product"
                                    />
                                  </a>
                                  <span className="flags">
                                    <span className="sale">Sale</span>
                                  </span>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="ec-pro-stitle">Shorts</h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Better Basics French Terry Sweatshorts
                                  </a>
                                </h5>
                                <div className="ec-pro-rat-price">
                                  <span className="ec-pro-rating">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                    <i className="ecicon eci-star"></i>
                                  </span>
                                  <span className="ec-price">
                                    <span className="new-price">$78.00</span>
                                    <span className="old-price">$85.00</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "Namkeen" && (
                      <div>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/96_1.jpg"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/96_2.jpg"
                                      alt="Product"
                                    />
                                  </a>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="ec-pro-stitle">Sports</h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Running & Trekking Shoes - White
                                  </a>
                                </h5>
                                <div className="ec-pro-rat-price">
                                  <span className="ec-pro-rating">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                  </span>
                                  <span className="ec-price">
                                    <span className="new-price">$89.00</span>
                                    <span className="old-price">$95.00</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/97_1.jpg"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/97_2.jpg"
                                      alt="Product"
                                    />
                                  </a>
                                  <span className="flags">
                                    <span className="sale">Sale</span>
                                  </span>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="ec-pro-stitle">Sports</h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Trekking & Running Shoes - black
                                  </a>
                                </h5>
                                <div className="ec-pro-rat-price">
                                  <span className="ec-pro-rating">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                    <i className="ecicon eci-star"></i>
                                  </span>
                                  <span className="ec-price">
                                    <span className="new-price">$58.00</span>
                                    <span className="old-price">$64.00</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === "Bakery" && (
                      <div>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/105_1.jpg"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/105_2.jpg"
                                      alt="Product"
                                    />
                                  </a>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="ec-pro-stitle">watches</h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Smart watche Vital Plus
                                  </a>
                                </h5>
                                <div className="ec-pro-rat-price">
                                  <span className="ec-pro-rating">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                  </span>
                                  <span className="ec-price">
                                    <span className="new-price">$100.00</span>
                                    <span className="old-price">$120.00</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content">
                            <div className="ec-product-inner">
                              <div className="ec-pro-image-outer">
                                <div className="ec-pro-image">
                                  <a
                                    href="product-left-sidebar.html"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src="assets/images/product-image/106_1.jpg"
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src="assets/images/product-image/106_2.jpg"
                                      alt="Product"
                                    />
                                  </a>
                                  <span className="flags">
                                    <span className="sale">Sale</span>
                                  </span>
                                  <div className="ec-pro-actions">
                                    <a
                                      className="ec-btn-group wishlist"
                                      title="Wishlist"
                                    >
                                      <i className="fi-rr-heart"></i>
                                    </a>
                                    <a
                                      href="#"
                                      className="ec-btn-group quickview"
                                      data-link-action="quickview"
                                      title="Quick view"
                                      data-bs-toggle="modal"
                                      data-bs-target="#ec_quickview_modal"
                                    >
                                      <i className="fi-rr-eye"></i>
                                    </a>
                                    <a
                                      href="compare.html"
                                      className="ec-btn-group compare"
                                      title="Compare"
                                    >
                                      <i className="fi fi-rr-arrows-repeat"></i>
                                    </a>
                                    <a
                                      href="javascript:void(0)"
                                      title="Add To Cart"
                                      className="ec-btn-group add-to-cart"
                                    >
                                      <i className="fi-rr-shopping-basket"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="ec-pro-content">
                                <a href="shop-left-sidebar-col-3.html">
                                  <h6 className="ec-pro-stitle">Watches</h6>
                                </a>
                                <h5 className="ec-pro-title">
                                  <a href="product-left-sidebar.html">
                                    Pocket Watch Leather Pouch
                                  </a>
                                </h5>
                                <div className="ec-pro-rat-price">
                                  <span className="ec-pro-rating">
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star fill"></i>
                                    <i className="ecicon eci-star"></i>
                                    <i className="ecicon eci-star"></i>
                                  </span>
                                  <span className="ec-price">
                                    <span className="new-price">$150.00</span>
                                    <span className="old-price">$170.00</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPanel;
