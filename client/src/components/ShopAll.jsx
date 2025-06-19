import { useEffect, useState } from "react";
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
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ProductPage from "../pages/ProductPage";
import "./ProductsLeftBar.css";
import { AiOutlineProduct } from "react-icons/ai";
import { FaBagShopping } from "react-icons/fa6";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
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
  const [selectedWeight,setSelectedWeight] = useState([]);
  const [values, setValues] = useState([10, 1000]);
  const [value, setValue] = useState(0);
  const [search,setSearch] = useState("");
  const [isDirect,setDirect] = useState(false);

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

  return (
    <div className="bg-white mt-20">
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
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-linear" />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              className={`relative ml-auto flex h-full w-60 flex-col  bg-white py-4 pb-12 shadow-xl transform transition-transform duration-300 ease-in-out ${
                mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between px-4">
                <span className="text-lg font-medium text-gray-900">
                  Filters
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t overflow-y-auto border-gray-200">
                {/* <h3 className="sr-only">Categories</h3> */}
                <span className="font-bold text-xl flex items-center gap-2 px-4 py-3">
                  <AiOutlineProduct />
                  Category
                </span>
                <ul role="list" className="px-6 py-3 font-medium text-gray-900">
                  {allCatagory.map((category) => (
                    <li key={category._id}>
                      <article className="checkbox-container flex items-center space-x-1">
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            id={category._id}
                             checked={Category.includes(category._id)} 
                            className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-orange-500 checked:border-transparent focus:outline-none"
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
                              
                            }}
                          />
                        </label>
                        <label
                          htmlFor={category._id}
                          className="cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </article>
                    </li>
                  ))}
                </ul>

                <div className="px-4">
                  {filters.map((section) => {
                    return (
                      <Disclosure key={section.id} as="div" className="py-2">
                        {({ open }) => (
                          <>
                            <DisclosureButton className="group flex w-full items-center justify-between py-3 text-left text-gray-700 hover:text-gray-900">
                              <div>
                                <span
                                  className={`font-bold px-2 text-lg flex items-center gap-3 ${
                                    open ? "text-purple-600" : "text-gray-800"
                                  }`}
                                >
                                  {section.icon} {section.name}
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
                              {section.id === "Varients" ? (
                                // ✅ DEMO CHECKBOXES for Varients
                                <div className="space-y-2 pl-4">
                                  {WeightVarient.map((varient, idx) => (
                                    <li>
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
                              ) : section.id==="Price"?(
                                // ✅ Replaced range sliders with demo text
                                <div className="pl-4 rounded-lg w-[250px] bg-white text-center text-gray-700">
                                   <RangeSlider values={values} setValues={setValues} isDirect={isDirect} setDirect={setDirect}/>
                                </div>
                              ):(
                                <div className="pl-4 rounded-lg w-[250px] bg-white text-center text-gray-700">
                                    <ShelfLifeSlider value={value} setValue={setValue} isDirect={isDirect} setDirect={setDirect}/>
                                </div>
                              )}
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                    );
                  })}
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-[100%]  lg:px-8 xl:px-10 [@media(min-width:1600px)]:px-20">
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
                                  <div className="pl-4 rounded-lg w-[250px] bg-white text-center text-gray-700">
                                    <RangeSlider values={values} setValues={setValues} isDirect={isDirect} setDirect={setDirect}/>
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
                                  <div className="space-y-2 pl-4">
                                    <ShelfLifeSlider value={value} setValue={setValue} isDirect={isDirect} setDirect={setDirect}/>
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
                  weightVariants = {WeightVarient}
                  setShelf= {setValue}
                  setPrice = {setValues}
                  setCategory = {setCategory}
                  setWeight = {setSelectedWeight}
                  setDirect={setDirect}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ShopAll;
