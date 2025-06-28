import { useEffect, useRef, useState } from "react";
import AddtoCartBottomBar from "../components/AddToCartBottomBar";
import { RxCross2 } from "react-icons/rx";
import { IoGrid } from "react-icons/io5";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import ListProductCardComponent from "../components/ListProductCard";
import {
  FunnelIcon,
} from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { MdStarRate } from "react-icons/md";
import {
  FaSortAmountDown,
  FaSortAmountDownAlt,
} from "react-icons/fa";

const sortOptions = [
  { name: "Sort", value: "no" },
  { name: "Best Rating", icon: <MdStarRate />, value: "rating" },
  {
    name: "Price: Low to High",
    icon: <FaSortAmountDown />,
    value: "lowToHigh",
  },
  {
    name: "Price: High to Low",
    icon: <FaSortAmountDownAlt />,
    value: "highToLow",
  },
];

const ProductPage = ({
  category,
  setMobileFiltersOpen,
  weight,
  priceRange,
  maxshelfLife,
  search,
  weightVariants,
  setShelf,
  setPrice,
  setCategory,
  setWeight,
  mobileFiltersOpen,
  setDirect,
   onRegister,
   onDone
}) => {
  const [selectedSort, setSelectedSort] = useState(0);
  const ref = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartProduct, setCartProduct] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const [totalPage, settotalPage] = useState();
  const [filterKey, setFilterKey] = useState(0); // triggers hard reset
  const stickyRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [activeVariant,setActiveVariant] = useState(0);
    const [filter, setFilter] = useState([]); 
      const allCategory = useSelector((state) => state.product.allCategory);
      const [isOpen, setIsOpen] = useState(false);

useEffect(()=>{
  if(mobileFiltersOpen)
  {
    setIsOpen(false)
  }
},[mobileFiltersOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: "-1px 0px 0px 0px" }
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, []);

  //new
  const [page, setPage] = useState(1);
  const [allProduct, setAllProduct] = useState([]);

  const removeFilter = (value) => {
    if (/^\d+\s*Day$/.test(value)) {
      setShelf(0);
      setDirect(true);
    } else if (/(\d+)[^\d\-]*-[^\d\-]*(\d+)/.test(value)) {
      setPrice([10, 1000]);
      setDirect(true);
    } else if (weight.includes(value)) {
      setWeight((prev) => prev.filter((wt) => wt !== value));
    } else {
      let uniqueId = allCategory.find((cat) => cat.name === value)._id;
      setCategory((prev) => prev.filter((c) => c !== uniqueId));
    }
  };

  useEffect(() => {
    const fetchFirstPage = async () => {
      onRegister?.();
      try {
        
        const response = await Axios({
          ...SummaryApi.getproductFilter,
          data: {
            page: 1,
            search,
            priceSort:
              sortOptions[selectedSort].value === "lowToHigh"
                ? "asc"
                : sortOptions[selectedSort].value === "highToLow"
                ? "desc"
                : null,
            weight,
            maxshelfLife,
            category,
            rating: sortOptions[selectedSort].value === "rating",
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          },
        });

        const data = response.data;
        console.log(data);
        setAllProduct(data.data);
        setPage(2); // Next page to load
        const totalCount = data.totalCount;
        const TotalP =
          totalCount % 10 !== 0
            ? Math.floor(totalCount / 10) + 1
            : totalCount / 10;
        settotalPage(TotalP);
        setFilterKey((prev) => prev + 1); // Triggers key reset
      } catch (err) {
        console.error("Error fetching filters:", err);
      } finally {
        onDone?.()
      }

    };

    const updateFilterOnce = () => {
      const oldShelfLife = filter.find((item) => /^\d+\s*Day$/.test(item));

    console.log(oldShelfLife)

    if(oldShelfLife)
      {
        if(oldShelfLife!==maxshelfLife+" Day")
          {
            console.log("hi")
            setFilter(prev => {
              const withoutOldShelfLife = prev.filter(item => item !== oldShelfLife);
              if(maxshelfLife>0)
              return [...withoutOldShelfLife, `${maxshelfLife} Day`]; // Add new shelf life
              else
              return withoutOldShelfLife;
            });
            return;
          }
        }
        
        else if(maxshelfLife>0)
        {
          const shelf = maxshelfLife+" Day"
          setFilter(prev => [...prev,shelf ]);
          return;
        }
        const oldPriceRange = filter.find(item => item.includes('-'));

      console.log(oldPriceRange);

    if(oldPriceRange)
    {
      console.log(oldPriceRange)
      const match = oldPriceRange.match(/(\d+)[^\d\-]*-[^\d\-]*(\d+)/);
      const num1 = parseInt(match[1]);
      const num2 = parseInt(match[2]);
      if(priceRange[0]!==num1||priceRange[1]!==num2)
      {
        console.log(priceRange)
        setFilter(prev => {
    const withoutOldPriceRange = prev.filter(item => item !== oldPriceRange);
    if(priceRange[0]!==10||priceRange[1]!==1000)
    return [...withoutOldPriceRange,`${priceRange[0]}₹-${priceRange[1]}₹`]
    else
    return withoutOldPriceRange;
  })
  return;
};
}
else if(priceRange[0]!==10||priceRange[1]!==1000)
{
  const price = `${priceRange[0]}₹-${priceRange[1]}₹`;
  setFilter(prev => [...prev,price]);
  return;
}

      const weights = filter.flatMap((f) => {
        const weight = weightVariants.find((weight) => weight.weight === f);
        return weight ? weight.weight : [];
      });
      console.log(weights);

      if (weights.length > weight.length) {
        let uniqueId = weights.filter((w) => !weight.includes(w));
        console.log(uniqueId);
        setFilter((prev) => prev.filter((p) => p !== uniqueId[0]));
        return;
      } else if (weight.length) {
        let uniqueId = weight.filter((w) => !weights.includes(w));
        if (uniqueId.length) {
          setFilter((prev) => [...prev, uniqueId[0]]);
          return;
        }
      }

      const catIds = filter.flatMap((f) => {
        const cat = allCategory.find((cat) => cat.name === f);
        return cat ? cat._id : [];
      });
      console.log(catIds);
      if (catIds.length > category.length) {
        let uniqueId = catIds.filter((c) => !category.includes(c));
        const cat = allCategory.find((cat) => cat._id === uniqueId[0]).name;
        setFilter((prev) => prev.filter((p) => p !== cat));
        return;
      } else if (category.length) {
        let uniqueId = category.filter((c) => !catIds.includes(c));
        if (uniqueId.length) {
          const cat = allCategory.find((cat) => cat._id === uniqueId[0]).name;
          setFilter((prev) => [...prev, cat]);
          return;
        }
      }
    };
    fetchFirstPage();
    updateFilterOnce();
  }, [weight, category, maxshelfLife, priceRange, search, selectedSort]);

  useEffect(() => {
    console.log("this is filters", filter);
  }, [filter]);

  const loadMore = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getproductFilter,
        data: {
          page,
          search,
          priceSort:
            sortOptions[selectedSort].value === "lowToHigh"
              ? "asc"
              : sortOptions[selectedSort].value === "highToLow"
              ? "desc"
              : null,
          weight,
          maxshelfLife,
          category,
          rating: sortOptions[selectedSort].value === "rating",
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        },
      });

      const data = response.data;
      console.log(data);
      setAllProduct((prev) => [...prev, ...data.data]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load more:", err);
    }
  };

  const handleAddToCart = (product) => {
    setCartProduct(product);
  };

  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "auto";
  }, [selectedProduct]);
  const [focusedOrFilled, setFocusedOrFilled] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="py-4 bg-white flex-col items-center justify-center">
      {/* View Toggle Buttons */}
      <div ref={stickyRef}></div>
      <div
        className={`z-20 transition-all duration-300 ${
          isSticky
            ? "sticky top-0 bg-white/60 backdrop-blur-xl rounded-b-[20px] shadow-sm border-b"
            : ""
        }`}
      >
        <div className="flex flex-col-reverse md:flex-row  justify-between md:gap-3 md:mb-5 md:mx-4">
          {/* apllied filters section start */}
          <div className="flex flex-row gap-1 px-3 overflow-y-auto whitespace-nowrap flex-nowrap tracking-widest my-3 md:my-0 md:mt-5">
            {filter.map((f) => (
              <span className="text-xs font-semibold py-1.5 md:py-3 px-3 bg-gray-50 rounded-full border border-gray-200  flex gap-1 justify-center items-center">
                <RxCross2
                  className="text-sm cursor-pointer"
                  onClick={() => {
                    removeFilter(f);
                  }}
                />
                {f}
              </span>
            ))}
          </div>
          {/* apllied filters section end  */}

          <div className="flex justify-center items-center px-3 mt-5">
            {/* <div className="flex items-center px-3">
           
          </div> */}

            <div className="filters flex gap-3 w-full justify-between bg-gray-50 border border-gray-200 rounded-[24px] shadow-inner px-3 p-2 md:py-1">
              <div className="flex items-center">
                <div className="relative inline-block text-left z-30 ">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between gap-2 text-sm font-medium text-black hover:text-gray-900 px-1"
                  >
                    {sortOptions[selectedSort].name}
                    <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="absolute mt-4 w-60 rounded-xl bg-white shadow-xl border border-gray-200 ">
                      {sortOptions.map((option, index) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setSelectedSort(index);
                            setIsOpen(false);
                          }}
                          className={`${
                            index === selectedSort
                              ? "bg-gray-100 text-black"
                              : "text-gray-600"
                          } flex items-center gap-2 w-full px-4 py-2 text-sm cursor-pointer hover:bg-gray-100`}
                        >
                          {option.icon}
                          {option.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="-m-2 ml-1 p-2 text-gray-600 hover:text-gray-500 sm:ml-6 [@media(min-width:768px)_and_(min-height:1366px)]:block lg:hidden"
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon aria-hidden="true" className="size-5" />
                </button>
              </div>

              <div className="grid-list-buttons mt-1">
                <button
                  onClick={() => setIsListView(!isListView)}
                  title={
                    isListView ? "Switch to Card View" : "Switch to List View"
                  }
                >
                  {isListView ? (
                    <IoGrid className="text-2xl text-gray-700  transition-all duration-300 active:scale-95" />
                  ) : (
                    <TfiLayoutListThumbAlt className="text-2xl text-gray-700 transition-all duration-300 active:scale-95" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Display Section */}
      <div className="">
        <InfiniteScroll
          key={filterKey}
          dataLength={allProduct.length}
          hasMore={page <= totalPage}
          next={loadMore}
          className="px-1"
          scrollableTarget="infinitebody"
        >
          <div
            ref={ref}
            className={
              isListView
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 lg:gap-3 md:px-3 px-0"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mx-1 lg:mx-2 gap-0 md:gap-4 lg:gap-4 items-center md:px-3 px-0"
            }
          >
            {allProduct.map((product) => {
              const { minPrice, maxPrice, weightVariants } = product;
              let selectedIndex = 0;
              if (sortOptions[selectedSort].value === "highToLow") {
                selectedIndex = weightVariants.findIndex((variant) => {
                  return (
                    variant.price - (variant.price * variant.discount) / 100 ===
                    maxPrice
                  );
                });
              } else {
                selectedIndex = weightVariants.findIndex((variant) => {
                  return (
                    variant.price - (variant.price * variant.discount) / 100 ===
                    minPrice
                  );
                });
              }
              return isListView ? (
                <ListProductCardComponent
                  key={product._id}
                  product={product}
                  setCartProduct={setCartProduct}
                  activeIndex={selectedIndex}
                  setActiveVariant={setActiveVariant}
                />
              ) : (
                <ProductCard
                  key={product._id}
                  product={product}
                  setCartProduct={setCartProduct}
                  activeIndex={selectedIndex}
                  setActiveVariant={setActiveVariant}
                  className=" md:min-w-[220px]"
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>

      {cartProduct && (
        <AddtoCartBottomBar
          activeIndex={activeVariant}
          refeernce={ref}
          product={cartProduct}
          onClose={handleCloseBottomBar}
        />
      )}
    </div>
  );
};

export default ProductPage;
