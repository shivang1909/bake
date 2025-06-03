import React from "react";

const SideMenu = () => {
  return (
    <>
      <div
        id="ec-mobile-menu"
        className={`ec-side-cart ec-mobile-menu ${isMenuOpen ? "ec-open" : ""}`}
      >
        <div className="ec-menu-title">
          <span className="menu_title">Explore Flavours</span>
          <button className="ec-close" onClick={() => setIsMenuOpen(false)}>
            ×
          </button>
        </div>
        <div class="ec-menu-inner">
          <div class="ec-menu-content">
            <ul className="flex flex-col space-y-2 text-[15px] tracking-wider gap-2 font-bold ">
              {/* offers */}
              <li>
                <div className="flex justify-between items-center cursor-pointer">
                  <span>Home</span>
                </div>
              </li>
              {/* Categories */}
              <li>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSubmenu("categories")}
                >
                  <span>Categories</span>
                  <span>{submenuOpen === "categories" ? "−" : "+"}</span>
                </div>

                {/* Submenu under Categories */}
                <ul
                  className={`pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    submenuOpen === "categories" ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="flex flex-col gap-2 mt-2 justify-center">
                    <li className="rounded-2xl">
                      <a href="">Sweets</a>
                    </li>
                    <li className="rounded-2xl">
                      <a href="">Namkeens</a>
                    </li>
                    <li className="rounded-2xl">
                      <a href="">Farsan</a>
                    </li>
                    <li className="rounded-2xl">
                      <a href="">Bakery</a>
                    </li>
                    <li className="rounded-2xl">
                      <a href="">Gifts & More</a>
                    </li>
                  </div>
                </ul>
                <ul class="sub-menu">
                  <li>
                    <a class="p-0" href="shop-left-sidebar-col-3.html">
                      <img
                        class="img-responsive"
                        src="assets/images/menu-banner/1.jpg"
                        alt=""
                      />
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSubmenu("Offers")}
                >
                  <span>Offers</span>
                  <span>{submenuOpen === "Offers" ? "−" : "+"}</span>
                </div>

                {/* Submenu under Categories */}
                <ul
                  className={`pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    submenuOpen === "Offers" ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="mt-2 gap-2 flex flex-wrap">
                    <li>
                      <a class="p-0" href="shop-left-sidebar-col-3.html">
                        <img
                          class="img-responsive rounded-lg"
                          src={SampleOffer}
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a class="p-0" href="shop-left-sidebar-col-3.html">
                        <img
                          class="img-responsive rounded-lg"
                          src={SampleOffer}
                          alt=""
                        />
                      </a>
                    </li>
                  </div>
                </ul>
                <ul class="sub-menu">
                  <li>
                    <a class="p-0" href="shop-left-sidebar-col-3.html">
                      <img class="img-responsive" src={SampleOffer} alt="" />
                    </a>
                  </li>
                </ul>
              </li>
              {/* Account */}
              <li>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSubmenu("Account")}
                >
                  <span>Account</span>
                  <span>{submenuOpen === "Account" ? "−" : "+"}</span>
                </div>

                {/* Submenu under Account */}
                <ul
                  className={`pl-3 mt-1  overflow-hidden transition-all duration-300 ease-in-out ${
                    submenuOpen === "Account" ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="mt-2 gap-2 flex flex-col">
                    <li className="p-1 rounded-2xl">
                      <a href="">My Account</a>
                    </li>
                    <li className=" p-1  rounded-2xl">
                      <a href="">Track Your Order</a>
                    </li>
                    <li className=" p-1  rounded-2xl">
                      <a href="">Chat With Us</a>
                    </li>
                    <li className=" p-1  rounded-2xl">
                      <a href="">Write a Review</a>
                    </li>
                  </div>
                </ul>
                <ul class="sub-menu">
                  <li>
                    <a class="p-0" href="shop-left-sidebar-col-3.html">
                      <img class="img-responsive" src={SampleOffer} alt="" />
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSubmenu("About")}
                >
                  <span>About</span>
                  <span>{submenuOpen === "About" ? "−" : "+"}</span>
                </div>

                {/* Submenu under About */}
                <ul
                  className={`pl-3 mt-1  overflow-hidden transition-all duration-300 ease-in-out ${
                    submenuOpen === "About" ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="mt-2 gap-2 flex flex-col">
                    <li className="p-1 rounded-2xl">
                      <a href="">About</a>
                    </li>
                    <li className=" p-1  rounded-2xl">
                      <a href="">Our Vision & Mission</a>
                    </li>
                    <li className=" p-1  rounded-2xl">
                      <a href="">Privacy Policy</a>
                    </li>
                    <li className=" p-1  rounded-2xl">
                      <a href="">Certificates</a>
                    </li>
                  </div>
                </ul>
                <ul class="sub-menu">
                  <li>
                    <a class="p-0" href="shop-left-sidebar-col-3.html">
                      <img class="img-responsive" src={SampleOffer} alt="" />
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
