import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition
} from "@headlessui/react";
import { Fragment } from "react";~
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ProductPage from "../pages/ProductPage";
import "../assets/styles/ProductsLeftBar.css";
import { AiOutlineProduct } from "react-icons/ai";
import { FaBagShopping } from "react-icons/fa6";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { FaArrowUp, FaChevronRight } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { setAllCategory, setAllProduct } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import RangeSlider from "./RangeSlider";
import ShelfLifeSlider from "./ShelfLifeSlider";
import Breadcrumbs from "./Breadcrumbs";

const ShopAll = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const allCatagory = useSelector((state) => state.product.allCategory);
  const [Category, setCategory] = useState([]);
  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct);
  const [WeightVarient, setWeightVarient] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState([]);
  const [values, setValues] = useState([10, 1000]);
  const [value, setValue] = useState(0);
  const [search, setSearch] = useState("");
  const [isDirect, setDirect] = useState(false);
const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // show button after 200px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const filters = [
    { id: "Varients", name: "Varients", icon: <FaBagShopping /> },
    { id: "Price", name: "Price", icon: <AiOutlineProduct /> },
    { id: "ShelfLife", name: "Shelf Life", icon: <FaHeartCircleCheck /> },
  ];

  const fetchCategory = async () => {
    try {
      dispatch(setAllCategory([]));
      const response = await Axios(SummaryApi.getCategory);
      dispatch(setAllCategory(response.data.data));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchWeightVarient = async () => {
    try {
      console.log("URL I'm passing:", SummaryApi.getallWeightVariant); // 👀 Check it
      const response = await Axios.get(SummaryApi.getallWeightVariant.url);
      setWeightVarient(response.data.data);
      console.log("wweeeeiiigghhhttttt", response);
    } catch (err) {
      console.log("Error fetching weight variant:", err);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchWeightVarient();
  }, []);

  useEffect(() => {
     if (mobileFiltersOpen) {
       document.body.style.overflow = "hidden";
     } else {
       document.body.style.overflow = "auto";
     }
   }, [mobileFiltersOpen]);

      const handleClose = () => setMobileFiltersOpen(false);

  return (
    <div className="bg-white mt-20">
      <Helmet>
        <title>
          Buy Sweets, Cakes & Namkeen Online | Bake Flavours Ahmedabad
        </title>
        <meta
          name="description"
          content="Explore and shop delicious sweets, cakes, cookies, dry fruit sweets, and namkeen from Bake Flavour – your favorite Ahmedabad bakery."
        />
        <meta
          name="keywords"
          content="shop sweets Ahmedabad, buy namkeen online, cakes, cookies, dry fruit sweets, chavana, bake flavour shop"
        />
        <link rel="canonical" href="https://bakeflavours.com/shopall" />
      </Helmet>

      <style>
        {`
          @font-face {
            font-family: 'Bartex';
            src: url('/Fonts/Bartex-Regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div className="mx-auto max-w-[100%] px-4 sm:px-2 lg:px-8 xl:px-10 [@media(min-width:1600px)]:px-20">
        <div className="py-10 flex flex-col items-center text-center space-y-2">
          <span
            className="text-5xl md:text-7xl font-thin text-[#1e293b] flex justify-center items-center gap-2 tracking-wide"
            style={{ fontFamily: "Bartex, sans-serif" }}
          >
            products
          </span>

          <p className="flex gap-2 items-center text-gray-700">
            <Breadcrumbs />
          </p>
          {/* <p className="font-semibold text-lg">30 Products</p> */}
        </div>
      </div>
      <div>
       <div
        className={`
          fixed inset-0 bg-black/50 z-50 transition-opacity duration-300
          ${mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={handleClose}
      />
        {/* Mobile filter dialog */}
 <div
        className={`
          fixed top-0 bottom-0 right-0 w-60 pb-12  bg-white z-50 transition-transform duration-300 ease-in-out
          ${mobileFiltersOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-lg font-semibold text-gray-900">Filters</span>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-4 py-4 h-full">
          <form>
            {/* Category Filter */}
            <span className="font-bold text-xl flex items-center gap-2 py-3 px-2">
              <AiOutlineProduct /> Category
            </span>
            <ul className="space-y-2 pl-4">
              {allCatagory.map((category) => (
                                            <li key={category._id}>
                              <article className="checkbox-container flex items-center space-x-2">
                                <label className="checkbox">
                                  <input
                                    name="category"
                                    type="checkbox"
                                    checked={Category.includes(category._id)} 
                                    onChange={(e) => {
                                      console.log(
                                        "Checkbox changed:",
                                        e.target.checked
                                      );
                                      e.target.checked
                                        ? setCategory((prev) => [
                                            ...prev,
                                            category._id,
                                          ])
                                        : setCategory((prev) =>
                                            prev.filter(
                                              (cat) => cat !== category._id
                                            )
                                          );
                                      console.log(
                                        "Current categories:",
                                        Category
                                      );
                                    }}
                                    id={category.name}
                                    className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-orange-500 checked:border-transparent focus:outline-none"
                                  />
                                </label>
                                <label
                                  htmlFor={category.name}
                                  className="cursor-pointer"
                                >
                                  {category.name}
                                </label>
                              </article>
                            </li>
              ))}
            </ul>

            {/* Other Filters (Variants, Price, Shelf Life) */}
            <div className="pt-4">
              {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="py-2">
                  {({ open }) => (
                    <>
                      <DisclosureButton className="group flex w-full items-center justify-between py-3 text-left text-gray-700 hover:text-gray-900">
                        <span
                          className={`font-bold px-2 text-lg flex items-center gap-3 ${open ? "text-orange-600" : "text-gray-800"}`}
                        >
                          {section.icon} {section.name}
                        </span>
                        <span className="flex items-center">
                          {open ? (
                            <span className="text-gray-500">-</span>
                          ) : (
                            <span className="text-gray-500">+</span>
                          )}
                        </span>
                      </DisclosureButton>
                      <DisclosurePanel className="pt-2">
                        {section.id === "Varients" ? (
                          <ul className="space-y-2 pl-4">
                            {WeightVarient.map((varient, idx) => (
                                    <li key={idx}>
                                      <article className="checkbox-container flex items-center space-x-1">
                                        <label className="checkbox">
                                          <input
                                            type="checkbox"
                                            id={`weight-${idx}`}
                                             checked={selectedWeight.includes(varient.weight)} 
                                            className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-indigo-600 checked:border-transparent focus:outline-none"
                                            onChange={(e) => {
                                              console.log(
                                                "Checkbox changed:",
                                                e.target.checked
                                              );
                                              e.target.checked
                                                ? setSelectedWeight((prev) => [
                                                    ...prev,
                                                    varient.weight,
                                                  ])
                                                : setSelectedWeight((prev) =>
                                                    prev.filter(
                                                      (varientName) => varientName !== varient.weight
                                                    )
                                                  );
                                                  console.log(
                                                    "Current weight:",
                                                    selectedWeight
                                                  );
                                            }}
                                          />
                                        </label>
                                        <label
                                          htmlFor={`weight-${idx}`}
                                          className="cursor-pointer"
                                        >
                                          {varient.weight}
                                        </label>
                                      </article>
                                    </li>
                            ))}
                          </ul>
                        ) : section.id === "Price" ? (
                          <div className="pt-2">
                            <RangeSlider
                              values={values}
                              setValues={setValues}
                              isDirect={isDirect}
                              setDirect={setDirect}
                            />
                          </div>
                        ) : (
                          <div className="pt-2">
                            <ShelfLifeSlider
                              value={value}
                              setValue={setValue}
                              isDirect={isDirect}
                              setDirect={setDirect}
                            />
                          </div>
                        )}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </form>
        </div>
      </div>
        <main className="mx-auto max-w-[100%]  lg:px-8 xl:px-10 [@media(min-width:1600px)]:px-20 ">
          <section aria-labelledby="products-heading" className="">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 ">
              {/* Filters */}
              <div className="hidden lg:block lg:p-2 xl:p-4">
                <div className="hidden lg:block lg:p-2 xl:p-4 sticky top-20">
                  <div className="h-[85vh] bg-white border border-gray-200 rounded-2xl shadow-md">
                    <div className="text-center bg-zinc-800 text-white p-3 rounded-t-xl">
                      <span className="text-xl font-semibold ">
                        Filter Products
                      </span>
                    </div>
                    <div className="h-[75vh] overflow-y-auto">
                      <form className="lg:p-2 p-4 rounded-b-2xl">
                        <span className="font-bold text-xl flex items-center gap-2 px-2 py-3">
                          <AiOutlineProduct />
                          Category
                        </span>
                        <ul
                          role="list"
                          className="space-y-4 border-b border-gray-200 pb-3 pt-3 text-sm font-medium lg:px-2 px-4"
                        >
                          {allCatagory.map((category) => (
                            <li key={category._id}>
                              <article className="checkbox-container flex items-center space-x-2">
                                <label className="checkbox">
                                  <input
                                    name="category"
                                    type="checkbox"
                                    checked={Category.includes(category._id)}
                                    onChange={(e) => {
                                      console.log(
                                        "Checkbox changed:",
                                        e.target.checked
                                      );
                                      e.target.checked
                                        ? setCategory((prev) => [
                                            ...prev,
                                            category._id,
                                          ])
                                        : setCategory((prev) =>
                                            prev.filter(
                                              (cat) => cat !== category._id
                                            )
                                          );
                                      console.log(
                                        "Current categories:",
                                        Category
                                      );
                                    }}
                                    id={category.name}
                                    className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-orange-500 checked:border-transparent focus:outline-none"
                                  />
                                </label>
                                <label
                                  htmlFor={category.name}
                                  className="cursor-pointer"
                                >
                                  {category.name}
                                </label>
                              </article>
                            </li>
                          ))}
                        </ul>
                        {/* <div className="flex justify-center items-center  bg-gray-100">
      <RangeSlider />
    </div> */}

                        <div>
                          {/* Varients Section */}
                          <Disclosure as="div" className="py-2">
                            {({ open }) => (
                              <>
                                <DisclosureButton className="group flex w-full items-center justify-between py-3 text-left text-gray-700 hover:text-gray-900">
                                  <div>
                                    <span
                                      className={`font-bold px-2 text-lg flex items-center gap-3 ${
                                        open ? "text-red-600" : "text-gray-800"
                                      }`}
                                    >
                                      <FaBagShopping /> Varients
                                    </span>
                                  </div>
                                  <span className="flex items-center">
                                    {open ? (
                                      <MinusIcon className="w-5 text-gray-500" />
                                    ) : (
                                      <PlusIcon className="w-5 text-gray-500" />
                                    )}
                                  </span>
                                </DisclosureButton>

                                <DisclosurePanel className="pt-4">
                                  <div className="space-y-2 pl-4">
                                    {WeightVarient.map((varient, idx) => (
                                      <li>
                                        <article className="checkbox-container flex items-center space-x-1">
                                          <label className="checkbox">
                                            <input
                                              type="checkbox"
                                              id={`weight-${idx}`}
                                              checked={selectedWeight.includes(
                                                varient.weight
                                              )}
                                              className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-indigo-600 checked:border-transparent focus:outline-none"
                                              onChange={(e) => {
                                                console.log(
                                                  "Checkbox changed:",
                                                  e.target.checked
                                                );
                                                e.target.checked
                                                  ? setSelectedWeight(
                                                      (prev) => [
                                                        ...prev,
                                                        varient.weight,
                                                      ]
                                                    )
                                                  : setSelectedWeight((prev) =>
                                                      prev.filter(
                                                        (varientName) =>
                                                          varientName !==
                                                          varient.weight
                                                      )
                                                    );
                                                console.log(
                                                  "Current weight:",
                                                  selectedWeight
                                                );
                                              }}
                                            />
                                          </label>
                                          <label
                                            htmlFor={`weight-${idx}`}
                                            className="cursor-pointer"
                                          >
                                            {varient.weight}
                                          </label>
                                        </article>
                                      </li>
                                    ))}
                                  </div>
                                </DisclosurePanel>
                              </>
                            )}
                          </Disclosure>

                          {/* Price Section */}
                          <Disclosure as="div" className="py-2">
                            {({ open }) => (
                              <>
                                <DisclosureButton className="group flex w-full items-center justify-between py-3 text-left text-gray-700 hover:text-gray-900">
                                  <div>
                                    <span
                                      className={`font-bold px-2 text-lg flex items-center gap-3 ${
                                        open ? "text-red-600" : "text-gray-800"
                                      }`}
                                    >
                                      <AiOutlineProduct /> Price
                                    </span>
                                  </div>
                                  <span className="flex items-center">
                                    {open ? (
                                      <MinusIcon className="w-5 text-gray-500" />
                                    ) : (
                                      <PlusIcon className="w-5 text-gray-500" />
                                    )}
                                  </span>
                                </DisclosureButton>

                                <DisclosurePanel className="pt-4">
                                  <div className=" rounded-lg  bg-white text-center text-gray-700">
                                    <RangeSlider
                                      values={values}
                                      setValues={setValues}
                                      isDirect={isDirect}
                                      setDirect={setDirect}
                                    />
                                  </div>
                                </DisclosurePanel>
                              </>
                            )}
                          </Disclosure>

                          {/* Shelf Life Section */}
                          <Disclosure as="div" className="py-2">
                            {({ open }) => (
                              <>
                                <DisclosureButton className="group flex w-full items-center justify-between py-3 text-left text-gray-700 hover:text-gray-900">
                                  <div>
                                    <span
                                      className={`font-bold px-2 text-lg flex items-center gap-3 ${
                                        open ? "text-red-600" : "text-gray-800"
                                      }`}
                                    >
                                      <FaHeartCircleCheck /> Shelf Life
                                    </span>
                                  </div>
                                  <span className="flex items-center">
                                    {open ? (
                                      <MinusIcon className="w-5 text-gray-500" />
                                    ) : (
                                      <PlusIcon className="w-5 text-gray-500" />
                                    )}
                                  </span>
                                </DisclosureButton>

                                <DisclosurePanel className="pt-4">
                                  <div className="space-y-2 ">
                                    <ShelfLifeSlider
                                      value={value}
                                      setValue={setValue}
                                      isDirect={isDirect}
                                      setDirect={setDirect}
                                    />
                                  </div>
                                </DisclosurePanel>
                              </>
                            )}
                          </Disclosure>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductPage
                  category={Category}
                  setMobileFiltersOpen={setMobileFiltersOpen}
                  weight={selectedWeight}
                  priceRange={values}
                  maxshelfLife={value}
                  search={search}
                  weightVariants={WeightVarient}
                  setShelf={setValue}
                  setPrice={setValues}
                  setCategory={setCategory}
                  setWeight={setSelectedWeight}
                  setDirect={setDirect}
                />
              </div>
            </div>
          </section>
        </main>
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

export default ShopAll;
