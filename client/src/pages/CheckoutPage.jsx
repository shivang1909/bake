import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { updatedShoppingCart } from "../store/userSlice";
import wrapprice from "../utils/wrapprice.json";
import { FaLocationDot } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { MdMyLocation } from "react-icons/md";
import CheckOutSteps from "./CheckOutSteps";
import confetti from "canvas-confetti";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import "./CheckoutPage.css";
import SkeletonCardLoader from "./SkeletonCardLoader";
import Razorpay from "../../assets/images/Custom/razorpay.png";
import COD from "../../assets/images/Custom/COD.png";
import Logo from "../../assets/images/Custom/BakeFlavors.png";
import AddAddressDesktop from "../components/AddAddressDesktop";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { FaAngleUp } from "react-icons/fa6";
import { CiGift } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import ProcesspaymentModal from "../components/ProcesspaymentModal";
import { IoCaretBackOutline } from "react-icons/io5";
import Breadcrumbs from "../components/Breadcrumbs";
import { GiShoppingBag } from "react-icons/gi";
import { BsCart3 } from "react-icons/bs";


const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const Accordion = ({
  title,
  children,
  isOpen,
  onToggle,
  footerButton,
  onPrevious,
  customHeaderButton, // 👈 new prop
}) => {
  const accordionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => {
        accordionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 50);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (isOpen) {
    return (
      <div
        ref={accordionRef}
        className={`fixed inset-0 z-50 bg-white flex flex-col transition-all duration-500 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        
        {/* Sticky Header */}
        <div className=" font-semibold border-b bg-white sticky top-0 z-10">
        <div className="flex justify-center items-center py-3 px-3 gap-2 mb-2 border-b">
       
            <img src={Logo} alt="" className="mx-auto w-24 h-auto" />
            </div>
            
          
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
            <span>{title}</span>

            {/* 🧠 Conditional logic for header button */}
            {customHeaderButton ? (
              customHeaderButton
            ) : onPrevious ? (
              <button
                onClick={onPrevious}
                className="text-sm flex items-center font-medium text-indigo-600"
              >
                <IoCaretBackOutline /> Previous
              </button>
            ) : null}
          </div>
          </div>
          
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        <div className="p-4 border-t bg-white sticky bottom-0 z-10">
          {footerButton}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden border border-gray-300 h-fit rounded-lg overflow-hidden transition-all duration-300 mt-20">
      <button
        className="w-full text-left px-4 py-3 font-medium flex justify-between items-center bg-white"
        onClick={onToggle}
      >
        {title}
        <span className="text-xl">+</span>
      </button>
    </div>
  );
};

const CheckoutPage = () => {
  const [paymentStatus, setPaymentStatus] = useState({
    isProcessing: false, // true when payment is being processed
    method: null, // 'online' or 'cod'
    hasFailed: false,
    paymentcancel: false, // true if payment failed
  });
  const user = useSelector((state) => state.user);
  const [openAddress, setOpenAddress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [GiftWrapCharges, setGiftWrapCharges] = useState(0);
  const addressList = useSelector((state) => state.addresses.addressList);
  const dispatch = useDispatch();
  const [selectAddress, setSelectAddress] = useState(0);
  const navigate = useNavigate();
  const { setTotalQty, setCartItem } = useGlobalContext();
  const [checkoutItems, setcheckoutItems] = useState([]);
  const [giftNoteEditable, setGiftNoteEditable] = useState({});
  const [giftNotes, setGiftNotes] = useState({});
  const [giftNoteQtys, setGiftNoteQtys] = useState({}); // Tracks how many notes per variant
  const [giftWrapChargesList, setGiftWrapChargesList] = useState([]); // Should be array to store per-product charges
  // Promocode states
  const [promocodes, setPromocodes] = useState([]);
  const [selectedPromocode, setSelectedPromocode] = useState("");
  const [showPromocodes, setShowPromocodes] = useState(false);
  const [appliedPromocode, setAppliedPromocode] = useState(null);
  const [promocodeDiscount, setPromocodeDiscount] = useState(0);
  const [isLoadingPromocode, setIsLoadingPromocode] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [openSection, setOpenSection] = useState("address");
  const [showGiftWrapDetails, setShowGiftWrapDetails] = useState({});

  const [selectedMethod, setSelectedMethod] = useState("razorpay");

  const handleAddressComplete = () => {
    if (addressList.length === 0) {
      toast.error("Please add an address to proceed");
      return;
    }
    setOpenSection("product");
  };
  const handleProductComplete = () => setOpenSection("promo");
  const handlePromoComplete = () => setOpenSection("checkout");
  const [checked, setChecked] = useState(false);
  // const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const promoRef = useRef(null);
  const promoRefAlt = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fromCart = location.state?.fromCart;
    console.log("this is ", fromCart);
    const orderCompleted = sessionStorage.getItem("orderCompleted");
    console.log("this is orderCompleted", orderCompleted);
    console.log("this is user", user);
    if (fromCart === undefined || user.shopping_cart.length === 0) {
      sessionStorage.removeItem("orderCompleted");
      // Redirect to home
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const vibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  };

  const handleClick = () => {
    vibrate();
    
    if (selectedMethod === "cod") {
      handleCashOnDelivery();
    } else if (selectedMethod === "razorpay") {
      handleOnlinePayment();
    } else {
      toast.error("Please select a valid payment method");
    }
  };

  useEffect(() => {
    if (openAddress) {
      setShowModal(true);
    } else {
      // Delay unmount to let close animation finish
      const timeout = setTimeout(() => setShowModal(false), 300); // duration matches transition
      return () => clearTimeout(timeout);
    }
  }, [openAddress]);
  useEffect(() => {
    console.log("useeffect for check out items", checkoutItems);
  }, [checkoutItems]);
  useEffect(() => {
    if (appliedPromocode && promoRef.current) {
      // Trigger smooth iPhone-style vibration
      if (navigator.vibrate) {
        // iPhone-style soft buzz: 50ms vibration with a 30ms pause, repeated
        navigator.vibrate([50, 30, 50]);
      }

      const rect = promoRef.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
        spread: 80,
        startVelocity: 45,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        scalar: 1.2,
      });
    }
  }, [appliedPromocode]);
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "warning dont close"; // Required for Chrome to show the confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (appliedPromocode && promoRefAlt.current) {
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }

      const rect = promoRefAlt.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
        spread: 80,
        startVelocity: 45,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        scalar: 1.2,
      });
    }
  }, [appliedPromocode]);

  const handleGiftNoteEdit = (productIndex, variantIndex, giftIndex) => {
    setGiftNoteEditable((prev) => ({
      ...prev,
      [`${productIndex}-${variantIndex}-${giftIndex}`]: true,
    }));
  };

  const handleGiftNoteChange = (
    productIndex,
    variantIndex,
    giftIndex,
    note
  ) => {
    setGiftNotes((prev) => ({
      ...prev,
      [`${productIndex}-${variantIndex}-${giftIndex}`]: note,
    }));
  };

  const handleGiftNoteSave = (productIndex, variantIndex, giftIndex) => {
    setGiftNoteEditable((prev) => ({
      ...prev,
      [`${productIndex}-${variantIndex}-${giftIndex}`]: false,
    }));
  };

  // const handleGiftWrapChange = (
  //   productIndex,
  //   variantIndex,
  //   weight,
  //   isChecked
  // ) => {
  //   const quantity =
  //     checkoutItems[productIndex].variantPrices[variantIndex].quantity;
  //   const pricePerWrap = giftWrapChargesList[weight];
  //   console.log("pricePerWrap", pricePerWrap);
  //   console.log("quantity", quantity);
  //   console.log("handleGiftWrapChange", productIndex, variantIndex, isChecked);

  //   if (isChecked) {
  //     // Initialize with default quantity (all items)
  //     setGiftNoteQtys((prev) => ({
  //       ...prev,
  //       [`${productIndex}-${variantIndex}`]: quantity,
  //     }));

  //     // Initialize empty notes for each item
  //     const initialNotes = {};
  //     for (let i = 0; i < quantity; i++) {
  //       initialNotes[`${productIndex}-${variantIndex}-${i}`] = "";
  //     }
  //     setGiftNotes((prev) => ({ ...prev, ...initialNotes }));
  //     console.log("GiftWrapCharges", GiftWrapCharges);
  //     setGiftWrapCharges((prev) => prev + pricePerWrap * quantity);
  //   } else {
  //     // Clean up all related states
  //     setGiftNotes((prev) => {
  //       const updated = { ...prev };
  //       for (let i = 0; i < quantity; i++) {
  //         delete updated[`${productIndex}-${variantIndex}-${i}`];
  //       }
  //       return updated;
  //     });

  //     setGiftNoteEditable((prev) => {
  //       const updated = { ...prev };
  //       for (let i = 0; i < quantity; i++) {
  //         delete updated[`${productIndex}-${variantIndex}-${i}`];
  //       }
  //       return updated;
  //     });

  //     setGiftNoteQtys((prev) => {
  //       const updated = { ...prev };
  //       delete updated[`${productIndex}-${variantIndex}`];
  //       return updated;
  //     });

  //     setGiftWrapCharges(
  //       (prev) =>
  //         prev -
  //         pricePerWrap *
  //           (giftNoteQtys[`${productIndex}-${variantIndex}`] || quantity)
  //     );
  //   }

  //   // Update checkout items
  //   setcheckoutItems((prev) => {
  //     const updated = [...prev];
  //     updated[productIndex] = {
  //       ...updated[productIndex],
  //       variantPrices: updated[productIndex].variantPrices.map((v, i) =>
  //         i === variantIndex
  //           ? {
  //               ...v,
  //               isGiftWrap: isChecked,
  //             }
  //           : v
  //       ),
  //     };
  //     return updated;
  //   });
  // };

  // Apply promocode
  const handleGiftWrapChange = (
    productIndex,
    variantIndex,
    weight,
    isChecked
  ) => {
    const quantity =
      checkoutItems[productIndex].variantPrices[variantIndex].quantity;
    const pricePerWrap = giftWrapChargesList[weight];

    if (isChecked) {
      // Set number of gift notes
      setGiftNoteQtys((prev) => ({
        ...prev,
        [`${productIndex}-${variantIndex}`]: quantity,
      }));

      // Initialize notes
      const initialNotes = {};
      for (let i = 0; i < quantity; i++) {
        initialNotes[`${productIndex}-${variantIndex}-${i}`] = "";
      }
      setGiftNotes((prev) => ({ ...prev, ...initialNotes }));

      // Add to total charge
      setGiftWrapCharges((prev) => prev + pricePerWrap * quantity);

      // ✅ Update checkout items with isGiftWrap and giftWrapCharge
      setcheckoutItems((prev) => {
        const updated = [...prev];
        updated[productIndex] = {
          ...updated[productIndex],
          variantPrices: updated[productIndex].variantPrices.map((variant, i) =>
            i === variantIndex
              ? {
                  ...variant,
                  isGiftWrap: true,
                  giftWrapCharge: quantity * pricePerWrap,
                }
              : variant
          ),
        };
        return updated;
      });
    } else {
      // Remove notes
      setGiftNotes((prev) => {
        const updated = { ...prev };
        for (let i = 0; i < quantity; i++) {
          delete updated[`${productIndex}-${variantIndex}-${i}`];
        }
        return updated;
      });

      // Remove editables
      setGiftNoteEditable((prev) => {
        const updated = { ...prev };
        for (let i = 0; i < quantity; i++) {
          delete updated[`${productIndex}-${variantIndex}-${i}`];
        }
        return updated;
      });

      // Remove qty
      setGiftNoteQtys((prev) => {
        const updated = { ...prev };
        delete updated[`${productIndex}-${variantIndex}`];
        return updated;
      });

      // Deduct gift wrap charges
      setGiftWrapCharges(
        (prev) =>
          prev -
          pricePerWrap *
            (giftNoteQtys[`${productIndex}-${variantIndex}`] || quantity)
      );

      // ✅ Update checkout items: remove giftWrapCharge
      setcheckoutItems((prev) => {
        const updated = [...prev];
        updated[productIndex] = {
          ...updated[productIndex],
          variantPrices: updated[productIndex].variantPrices.map((variant, i) =>
            i === variantIndex
              ? {
                  ...variant,
                  isGiftWrap: false,
                  giftWrapCharge: 0,
                }
              : variant
          ),
        };
        return updated;
      });
    }
  };

  const applyPromocode = async () => {
    if (!selectedPromocode) {
      toast.error("Please enter a promocode");
      return;
    }

    try {
      setIsLoadingPromocode(true);
      const response = await Axios({
        method: "POST",
        url: "/api/promocode/verify",
        data: {
          code: selectedPromocode.code,
          orderAmount: finalTotal - discountedPrice,
        },
      });

      if (response.data.success) {
        setAppliedPromocode(selectedPromocode);

        setPromocodeDiscount(response.data.data.discountAmount);
        toast.success("Promocode applied successfully!");
        setShowPromocodes(false);
      }
    } catch (error) {
      setSelectedPromocode(null);
      setAppliedPromocode(null);
      toast.error(error.response?.data?.message || "Failed to apply promocode");
    } finally {
      setIsLoadingPromocode(false);
    }
  };

  // Remove applied promocode
  const removePromocode = () => {
    setAppliedPromocode(null);
    setPromocodeDiscount(0);
    setSelectedPromocode("");
    toast.success("Promocode removed");
  };

  const handleSelectPromocode = (code) => {
    setSelectedPromocode(code);
  };

  const handleCashOnDelivery = async () => {
    try {
      setPaymentStatus({
        isProcessing: true,
        method: "cod",
        hasFailed: false,
        paymentcancel: false,
      });
      if (!addressList[selectAddress]) {
        toast.error("Please select a delivery address");
        return;
      }

      // Prepare items with gift notes
      const itemsWithGiftDetails = checkoutItems.map((item, pIndex) => ({
        ...item,
        variantPrices: item.variantPrices.map((variant, vIndex) => {
          const notes = [];
          const noteQty =
            giftNoteQtys[`${pIndex}-${vIndex}`] || variant.quantity;

          for (let i = 0; i < noteQty; i++) {
            notes.push(giftNotes[`${pIndex}-${vIndex}-${i}`] || "");
          }

          return {
            ...variant,
            giftNotes: variant.isGiftWrap ? notes : undefined,
          };
        }),
      }));
      console.log("itemwithgiftdetailss", itemsWithGiftDetails);

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: itemsWithGiftDetails,
          addressId: addressList[selectAddress]?._id,
          total: grandTotal,
          special_Gift_packing: GiftWrapCharges,
          promocodeId: appliedPromocode?._id || null,
          promocodeDiscount: promocodeDiscount || 0,
        },
      });

      toast.dismiss();
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);

        // Reset cart data
        setGiftWrapCharges(0);
        setCartItem([]);
        dispatch(updatedShoppingCart([]));
        setTotalQty(0);

        // Trigger animation and navigate after 10s
        if (!isAnimating) {
          setIsAnimating(true);
          setTimeout(() => {
            setIsAnimating(false);
            setPaymentStatus({
              isProcessing: false,
              method: null,
              hasFailed: false,
              paymentcancel: false,
            });
            navigate("/success", {
              replace: true,
              state: { fromCheckout: true },
            });
          }, 7000); // 10 second delay for animation
        }
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      if (!addressList[selectAddress]) {
        toast.error("Please select a delivery address");
        return;
      }
      setPaymentStatus({
        isProcessing: true,
        method: "online",
        hasFailed: false,
        paymentcancel: false,
      });
      const itemsWithGiftDetails = checkoutItems.map((item, pIndex) => ({
        ...item,
        variantPrices: item.variantPrices.map((variant, vIndex) => {
          const notes = [];
          const noteQty =
            giftNoteQtys[`${pIndex}-${vIndex}`] || variant.quantity;

          for (let i = 0; i < noteQty; i++) {
            notes.push(giftNotes[`${pIndex}-${vIndex}-${i}`] || "");
          }

          return {
            ...variant,
            giftNotes: variant.isGiftWrap ? notes : undefined,
          };
        }),
      }));

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: { amount: grandTotal },
      });

      const order = response.data;

      const options = {
        key: "rzp_test_SXcix9cPDGx5eU",
        amount: order.amount,
        currency: order.currency,
        name: "Bake Flavour",
        description: "Test Transaction",
        order_id: order.id,
        modal: {
          ondismiss: () => {
            console.log("Razorpay popup closed by user");

            setPaymentStatus({
              isProcessing: false,
              method: null,
              hasFailed: false,
              paymentcancel: true,
            });

            toast.error("Payment was cancelled.");
          },
        },

        handler: async (response) => {
          try {
            // 🚨 Start blocking user
            const verifyRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/order/verifyPayment`,
              {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  ...response,
                  list_items: itemsWithGiftDetails,
                  addressId: addressList[selectAddress]?._id,
                  special_Gift_packing: GiftWrapCharges,
                  total:
                    finalTotal -
                    discountedPrice -
                    promocodeDiscount +
                    GiftWrapCharges,
                  promocodeId: appliedPromocode?._id || null,
                  promocodeDiscount: promocodeDiscount || 0,
                  amount: order.amount,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            console.log(verifyData);

            if (verifyData.success) {
              setCartItem([]);
              dispatch(updatedShoppingCart([]));
              setTotalQty(0);
              toast.success("Payment verified successfully!");

              if (!isAnimating) {
                setIsAnimating(true);
                setTimeout(() => {
                  setIsAnimating(false);
                  setPaymentStatus({
                    isProcessing: false,
                    method: null,
                    hasFailed: false,
                    paymentcancel: false,
                  });

                  navigate("/success", {
                    replace: true,
                    state: { fromCheckout: true },
                  });
                }, 10000); // wait 10 seconds
              }
            } else if (!verifyData.success) {
              setPaymentStatus({
                isProcessing: false,
                method: null,
                hasFailed: true,
                paymentcancel: false,
              });
            }
          } catch (err) {
            console.error("this is", err);
            setPaymentStatus({
              isProcessing: false,
              method: null,
              hasFailed: true,
              paymentcancel: false,
            });
            toast.error("Payment verification failed. Please Wait.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      setPaymentStatus({
        isProcessing: false,
        method: null,
        hasFailed: true,
        paymentcancel: false,
      });

      // AxiosToastError(error);
    }
  };

  const { finalTotal, quantity, discountedPrice } = useMemo(() => {
    let finalTotal = 0;
    let quantity = 0;
    let discountedPrice = 0;

    console.log("usememocalled");
    checkoutItems.forEach((item) => {
      item.variantPrices.forEach((variant) => {
        finalTotal += variant.price * variant.quantity;
        quantity += variant.quantity;
        discountedPrice +=
          variant.price * variant.quantity * (variant.discount / 100);

        // Calculate based on actual number of wrapped items
      });
    });

    return {
      finalTotal,
      quantity,
      discountedPrice,
    };
  }, [checkoutItems, giftNoteQtys, giftWrapChargesList]);

  const grandTotal =
    finalTotal - discountedPrice - promocodeDiscount + GiftWrapCharges;

  useEffect(() => {
    // Fetch all promocodes
    const fetchPromocodes = async () => {
      try {
        console.log(finalTotal - discountedPrice);

        const response = await Axios({
          method: "POST",
          url: "/api/promocode/applicable",
          data: {
            orderAmount: finalTotal - discountedPrice,
          },
        });

        if (response.data.success) {
          setPromocodes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching promocodes:", error);
      }
    };
    fetchPromocodes();
  }, [checkoutItems]);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.usercartdetails,
        });
        const { data: responseData } = response;
        if (responseData.success) {
          console.log(responseData.giftwrapCharges);
          setcheckoutItems(responseData.data);
          setGiftWrapChargesList(responseData.giftwrapCharges);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };
    fetchCartDetails();
    // fetchPromocodes();
  }, []);

  const { register, handleSubmit, reset, watch } = useForm();
  const { fetchAddress } = useGlobalContext();
  const handleGiftNoteQtyChange = (
    productIndex,
    variantIndex,
    weight,
    change
  ) => {
    const key = `${productIndex}-${variantIndex}`;
    console.log("inside button click ", giftNoteQtys);
    const currentQty =
      giftNoteQtys[key] ||
      checkoutItems[productIndex].variantPrices[variantIndex].quantity;
    const newQty = currentQty + change;
    console.log("newQty", newQty);
    console.log("this is ", change);
    console.log("this is weight", weight);
    // Validate new quantity is between 1 and item quantity
    if (
      newQty >= 1 &&
      newQty <= checkoutItems[productIndex].variantPrices[variantIndex].quantity
    ) {
      // Calculate price difference
      const pricePerWrap = giftWrapChargesList[weight];

      // Update gift wrap charges
      if (change < 0) {
        setGiftWrapCharges((prev) => prev - pricePerWrap);
      } else {
        setGiftWrapCharges((prev) => prev + pricePerWrap);
      }

      // Update checkout items (only update the charge for the actually wrapped items)
      setcheckoutItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[productIndex] = {
          ...updatedItems[productIndex],
          variantPrices: updatedItems[productIndex].variantPrices.map(
            (variant, vIndex) =>
              vIndex === variantIndex
                ? {
                    ...variant,
                    giftWrapCharge: newQty * pricePerWrap,
                  }
                : variant
          ),
        };
        return updatedItems;
      });

      // Update gift note quantity
      setGiftNoteQtys((prev) => ({
        ...prev,
        [key]: newQty,
      }));
    }
  };

  return (
    <section className="bg-white text-black font-normal ">
      <div className="hidden lg:block md:flex flex-col items-center justify-center pt-10 pb-5">
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
        <h2 style={{ fontFamily: "Bartex, sans-serif" }} className="text-4xl font-semibold">CheckOut</h2>
        <Breadcrumbs />
      </div>

      <div className="hidden  container lg:p-8 lg:px-0 xl:px-3 lg:flex flex-col lg:flex-row w-full 2xl:gap-10 lg:gap-5 [@media(min-width:1600px)]:gap-8 justify-center">
        {/* First column : for address */}
        
        <div className="w-full h-full max-h-[80vh] max-w-md bg-white rounded-xl border-1">
          {addressList.filter((a) => a.status).length === 0 ? (
            <>
           <div className="flex font-semibold items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white pb-3 p-4 rounded-t-xl">
                  <FaLocationDot className="text-lg" /> Choose your address
                </div>
            <div className="h-full mt-3 max-h-[70vh] lg:min-h-[70vh]  rounded-xl flex flex-col justify-center items-center">
              <div className="border-2 border-dashed border-gray-400 rounded-xl  p-3 flex flex-col justify-center items-center text-center">
              <div className="text-4xl text-gray-400 mb-2">
                <FaLocationDot />
              </div>
              <p className="font-semibold text-gray-600 mb-1">
                No Address Found
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Add your address to proceed with checkout.
              </p>
              <button
                onClick={() => setOpenAddress(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 active:scale-95"
              >
                Add Address
              </button>
                </div>
            </div>
            </>
          ) : (
            <>
              <div className="w-full h-full max-h-[80vh] max-w-md bg-white rounded-xl border-1">
                <div className="flex font-semibold items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white pb-3 p-4 rounded-t-xl">
                  <FaLocationDot /> Choose your address
                </div>

                <div className="rounded-xl overflow-auto h-[70vh] flex flex-col pb-3 mt-3 ">
                  {/* Scrollable Address Cards */}
                  <div className="overflow-y-auto flex-1  px-4 gap-4 flex flex-col items-center scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {addressList.map((address, index) => {
                      const isActive = selectAddress === index;
                      if (!address.status) return null;

                      return (
                        <div
                          key={index}
                          className={`border  rounded-xl p-4 flex flex-col gap-2 w-full max-w-md h-fit cursor-pointer transition-all duration-300 active:scale-95 shadow-sm ${
                            isActive
                              ? "border-orange-400 border-2 bg-orange-50"
                              : "border-gray-300 bg-white"
                          }`}
                          onClick={() => setSelectAddress(index)}
                        >
                          <input
                            id={"address" + index}
                            type="radio"
                            value={index}
                            onChange={(e) =>
                              setSelectAddress(Number(e.target.value))
                            }
                            name="address"
                            checked={isActive}
                            className="hidden"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-md font-semibold text-gray-800">
                              {address.name || "Krunal Mistry"}
                            </span>
                            {isActive && (
                              <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded-md">
                                Selected
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 leading-5">
                            <p>{address.address_line1}</p>
                            {address.address_line2 && (
                              <p>{address.address_line2}</p>
                            )}
                            <p>
                              {address.city}, {address.state}
                            </p>
                            <p>
                              {address.country} - {address.pincode}
                            </p>
                          </div>

                          <p className="text-sm font-medium text-gray-700">
                            📞 {address.mobile}
                          </p>
                        </div>
                      );
                    })}

                    {/* Shown if only one active address */}
                    {addressList.filter((a) => a.status).length === 1 && (
                      <div className="flex-1 w-full flex items-stretch justify-center">
                        <div
                          onClick={() => setOpenAddress(true)}
                          className="border-2 border-dashed rounded-xl p-4 flex flex-col justify-center items-center w-full max-w-md cursor-pointer transition-all duration-300 active:scale-95 shadow-sm"
                        >
                          <span className="text-md font-semibold text-orange-600 flex flex-col gap-1 items-center">
                            <MdOutlineAddHomeWork className="text-4xl" />
                            Add Another Address
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sticky Bottom Button */}
                  {addressList.filter((a) => a.status).length > 1 && (
                    <div
                      onClick={() => setOpenAddress(true)}
                      className="py-4 mx-3 text-md gap-2 rounded-xl border text-md border-gray-500 border-dashed flex justify-center items-center cursor-pointer transition-all duration-300 active:scale-95 bg-white mt-3"
                    >
                      <MdMyLocation className="text-lg" /> Add Another Address
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* second column : for product checkout */}
        <div className="w-full h-full max-h-[80vh] max-w-md bg-white rounded-xl border-1">
          <div className="flex font-semibold items-center gap-2 bg-gradient-to-r from-[#607D8B] to-[#607D8B] text-white pb-3 p-4 rounded-t-xl">
                  <BsCart3 className="text-lg" /> Your cart
                </div>
          {/**summary**/}
          <div className="rounded-xl overflow-y-auto max-h-[70vh] mt-3 lg:min-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent" >
            {checkoutItems.length > 0 ? (
              <>
                <div className="flex items-center justify-between mx-4 px-4 py-2 font-semibold border border-green-200 bg-green-100 text-green-700 rounded-lg">
                  <p>Your total savings</p>
                  <p>
                    {DisplayPriceInRupees(discountedPrice + promocodeDiscount)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                  {checkoutItems.map((item, productIndex) =>
                    item.variantPrices.map((variant, index) => {
                      const isDetailsVisible =
                        showGiftWrapDetails[`${productIndex}-${index}`] ?? true;

                      return (
                        <div
                          key={`${item.productId}_product_${index}`}
                          className={`flex flex-col w-full gap-4 border-b pb-4 border rounded-xl px-3 transition-colors duration-300 ${
                            variant.isGiftWrap
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 cursor-pointer select-none text-[#ff5050] relative">
                              <label
                                htmlFor={`gift-wrap-${productIndex}-${index}`}
                                className="inline-flex items-center cursor-pointer select-none"
                              >
                                <input
                                  type="checkbox"
                                  id={`gift-wrap-${productIndex}-${index}`}
                                  onChange={(e) =>
                                    handleGiftWrapChange(
                                      productIndex,
                                      index,
                                      variant.weight,
                                      e.target.checked
                                    )
                                  }
                                  checked={variant.isGiftWrap || false}
                                  className="hidden"
                                />

                                <div
                                  className={`w-[1.5em] h-[1.5em] flex items-center justify-center border-2 rounded-md border-[#ff5050] transition-colors duration-300 ${
                                    variant.isGiftWrap
                                      ? "bg-[#ff5050]"
                                      : "bg-white"
                                  }`}
                                >
                                  {variant.isGiftWrap && (
                                    <CiGift className="text-white text-md scale-125" />
                                  )}
                                </div>

                                <span
                                  className={`ml-3 text-base font-semibold text-red-500 select-none`}
                                >
                                  {variant.isGiftWrap
                                    ? "Wrapped Gift"
                                    : "Wrapped as Gift ?"}
                                </span>
                              </label>
                            </div>

                            {variant.isGiftWrap && (
                              <button
                                onClick={() =>
                                  setShowGiftWrapDetails((prev) => ({
                                    ...prev,
                                    [`${productIndex}-${index}`]:
                                      !isDetailsVisible,
                                  }))
                                }
                                className="text-sm text-red-600 hover:text-red-800 bg-white px-2 py-1 rounded-lg transition"
                              >
                                {isDetailsVisible ? (
                                  <>
                                    <span>
                                      {" "}
                                      <FaAngleUp />{" "}
                                    </span>
                                  </>
                                ) : (
                                  "Add Gift Message"
                                )}
                              </button>
                            )}
                          </div>

                          {/* ✅ Smooth Transition Box */}
                          <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                              variant.isGiftWrap
                                ? isDetailsVisible
                                  ? "max-h-[1000px] opacity-100"
                                  : "max-h-0 opacity-0"
                                : "hidden"
                            }`}
                          >
                            <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-semibold text-red-800">
                                  Gift Add-ons
                                </h4>
                                {/* <button
                                  onClick={() =>
                                    handleGiftWrapChange(
                                      productIndex,
                                      index,
                                      variant.weight,
                                      false
                                    )
                                  }
                                  className="text-sm text-pink-600 hover:text-pink-800 transition underline"
                                >
                                  ❌ Hide
                                </button> */}
                              </div>

                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-700">
                                  How many notes?
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      handleGiftNoteQtyChange(
                                        productIndex,
                                        index,
                                        variant.weight,
                                        -1
                                      )
                                    }
                                    disabled={
                                      giftNoteQtys[
                                        `${productIndex}-${index}`
                                      ] <= 1
                                    }
                                    className="w-8 h-8 border border-red-600 rounded-full font-normal bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    -
                                  </button>
                                  <span className="px-4 py-1 rounded-lg border border-red-400 text-gray-800 bg-white">
                                    {giftNoteQtys[`${productIndex}-${index}`] ||
                                      (variant.isGiftWrap ? 1 : 0)}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleGiftNoteQtyChange(
                                        productIndex,
                                        index,
                                        variant.weight,
                                        1
                                      )
                                    }
                                    disabled={
                                      giftNoteQtys[
                                        `${productIndex}-${index}`
                                      ] >= variant.quantity
                                    }
                                    className="w-8 h-8 border border-red-600 rounded-full bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {[
                                ...Array(
                                  giftNoteQtys[`${productIndex}-${index}`] || 1
                                ),
                              ].map((_, giftIndex) => {
                                const noteKey = `${productIndex}-${index}-${giftIndex}`;
                                const isEditable = giftNoteEditable[noteKey];
                                const currentNote = giftNotes[noteKey] || "";

                                return (
                                  <div
                                    key={giftIndex}
                                    className="mb-4 p-3 bg-white border rounded-md shadow-sm"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <label className="font-medium text-gray-800">
                                        ✍️{" "}
                                        {giftIndex === 0
                                          ? "Sweet Note"
                                          : `Shoutout ${giftIndex + 1}`}
                                      </label>
                                      <span className="text-xs text-gray-500">
                                        {currentNote.length}/70
                                      </span>
                                    </div>

                                    {isEditable ? (
                                      <>
                                        <textarea
                                          ref={(element) => {
                                            if (element) {
                                              element.focus();
                                            }
                                          }}
                                          value={currentNote}
                                          onChange={(e) =>
                                            handleGiftNoteChange(
                                              productIndex,
                                              index,
                                              giftIndex,
                                              e.target.value
                                            )
                                          }
                                          maxLength={70}
                                          className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                                          placeholder="Write something special here..."
                                        />
                                        <div className="flex h-full mt-2">
                                          <button
                                            onClick={() =>
                                              handleGiftNoteSave(
                                                productIndex,
                                                index,
                                                giftIndex
                                              )
                                            }
                                            className="bg-red-600 hover:bg-red-700 text-white w-full px-4 py-1.5 rounded-md transition"
                                          >
                                            Save Changes
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex items-start justify-between gap-2">
                                        <div
                                          className="flex-grow bg-gray-100 text-gray-700 p-2 rounded-md min-h-[2.5rem]"
                                          onClick={() =>
                                            handleGiftNoteEdit(
                                              productIndex,
                                              index,
                                              giftIndex
                                            )
                                          }
                                        >
                                          {currentNote || "No message yet"}
                                        </div>
                                        {/* <button
                                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-3 rounded-md transition"
                                        >
                                          <CiEdit />
                                        </button> */}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Product Display */}
                          <div className="flex gap-4 items-start">
                            <div className="w-20 h-20 rounded-lg bg-gray-200">
                              <img
                                src={item.coverimage}
                                alt={item.name}
                                className="w-full h-full object-scale-down rounded-lg"
                              />
                            </div>
                            <div className="w-full">
                              <p className="text-sm font-semibold">
                                {item.itemname}
                              </p>
                              <div
                                key={`${item.productId}_variant_${index}`}
                                className="flex justify-between items-center mt-2"
                              >
                                <div>
                                  <p className="text-xs text-neutral-600 ">
                                    {variant.weight}
                                  </p>
                                  <p className="font-semibold mt-1">
                                    {DisplayPriceInRupees(
                                      pricewithDiscount(
                                        variant.price,
                                        variant.discount
                                      ) * variant.quantity
                                    )}
                                  </p>
                                </div>
                                <div className="w-full max-w-[150px]">
                                  <div className="flex w-full h-full">
                                    <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
                                      Qt: {variant.quantity}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              // <SkeletonCardLoader/>
              <>
                <div className="flex flex-col items-center justify-center h-full ">
                  <SkeletonCardLoader className="max-w-sm" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Third column : for promo code and  Bill details*/}
        <div className="w-full max-h-[80vh] max-w-md bg-white border-1  rounded-xl">
          <div className="flex font-semibold items-center gap-2 bg-gradient-to-r from-[#008E97] to-[#00a0abe1] text-white pb-3 p-4 rounded-t-xl mb-3 text-md">
            <IoBagCheckOutline className="text-lg" /> Checkout
          </div>
          <div className="contentarea px-2 overflow-y-auto max-h-[70vh] lg:min-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {/* Promocode Section */}
            <div className="bg-white p-4">
              <h3 className="font-semibold mb-2">Apply Promocode</h3>

              {appliedPromocode ? (
                <div
                  ref={promoRefAlt}
                  className="bg-green-100 border-2 border-dashed border-green-400 p-3 rounded-lg mb-3 shiny-button"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{appliedPromocode.code}</p>
                      <p className="text-sm font-semibold text-green-600">
                        {appliedPromocode.discountType === "percentage"
                          ? `${appliedPromocode.discountValue}% off`
                          : `₹${appliedPromocode.discountValue} off`}
                      </p>
                      <p className="text-xs text-gray-800 ">
                        You saved{" "}
                        <span className="font-medium">
                          {DisplayPriceInRupees(promocodeDiscount)}
                        </span>{" "}
                        on this order !
                      </p>
                    </div>
                    <button
                      onClick={removePromocode}
                      className="text-red-500 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="">
                  <div className="flex text-black">
                    <input
                      type="text"
                      value={selectedPromocode ? selectedPromocode.code : ""}
                      placeholder="Enter Promocode"
                      className="flex-1 border-gray-300 border-r border-2 border-dashed p-2 rounded-l-xl font-semibold"
                      disabled
                    />
                    <button
                      onClick={applyPromocode}
                      disabled={isLoadingPromocode || !selectedPromocode}
                      className={`px-4 py-2 rounded-r-xl font-semibold text-white ${
                        isLoadingPromocode || !selectedPromocode
                          ? "bg-slate-500"
                          : "bg-slate-800 hover:bg-slate-500"
                      }`}
                    >
                      {isLoadingPromocode ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowPromocodes(!showPromocodes)}
                    className="text-green-500 bg-white w-full px-2 py-1 rounded-lg  text-sm mt-2 font-medium"
                  >
                    {showPromocodes ? (
                      <>
                        <div className="flex gap-1 items-center">
                          <CiCircleChevUp className="text-lg" />
                          Hide Available Codes
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-1 items-center">
                          <CiCircleChevDown className="text-lg" /> View
                          Available Promocodes
                        </div>
                      </>
                    )}
                  </button>

                  {showPromocodes && (
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-y-auto overflow-hidden mt-2 ${
                        showPromocodes ? "max-h-60" : "max-h-0"
                      }`}
                    >
                      {promocodes.length > 0 ? (
                        promocodes
                          .filter((code) => code.isActive)
                          .map((code) => (
                            <div
                              key={code._id}
                              className="border-2 border-dotted rounded-lg  p-2 cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSelectPromocode(code)}
                            >
                              <div className="flex justify-between">
                                <p className="font-semibold">{code.code}</p>
                                <p className="text-sm">
                                  {code.discountType === "percentage"
                                    ? `${code.discountValue}% off`
                                    : `₹${code.discountValue} off`}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500">
                                Min order: ₹{code.minOrderValue} | Expires:{" "}
                                {new Date(code.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                      ) : (
                        <p className="text-center p-2">
                          No promocodes available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-white p-4 space-y-3">
              <h3 className="font-semibold">Bill details</h3>
              <div className="flex gap-4 justify-between ml-1">
                <p>Items total</p>
                <p className="flex items-center gap-2">
                  <span className="line-through text-neutral-400">
                    {DisplayPriceInRupees(finalTotal)}
                  </span>
                  <span>
                    {DisplayPriceInRupees(finalTotal - discountedPrice)}
                  </span>
                </p>
              </div>
              <div className="flex gap-4 justify-between ml-1">
                <p>Quantity total</p>
                <p className="flex items-center gap-2">{quantity} items</p>
              </div>
              {promocodeDiscount > 0 && (
                <div className="flex gap-4 justify-between ml-1 text-green-600">
                  <p>Promocode discount</p>
                  <p className="flex items-center gap-2">
                    - {DisplayPriceInRupees(promocodeDiscount)}
                  </p>
                </div>
              )}
              <div className="flex gap-4 justify-between ml-1">
                <p>Delivery Charge</p>
                <p className="flex items-center gap-2">Free</p>
              </div>
              <div className="flex gap-4 justify-between ml-1">
                <p>GiftWrap Charges </p>
                <p className="flex items-center gap-2">
                  {DisplayPriceInRupees(GiftWrapCharges)}
                </p>
              </div>
              <div className="font-semibold flex items-center justify-between gap-4 mt-2 pt-2 border-t">
                <p>Grand total</p>
                {console.log(grandTotal)}
                <p>{DisplayPriceInRupees(grandTotal)}</p>
              </div>
            </div>

            <div className="px-3">
              <div className="mt-4 space-y-4">
                <div className="flex flex-col">
                  {/* Razorpay Option */}
                  <label
                    onClick={() => setSelectedMethod("razorpay")}
                    className={`flex items-center gap-4 rounded-xl p-4 py-5 cursor-pointer transition-all  duration-300 active:scale-100 border-2 ${
                      selectedMethod === "razorpay"
                        ? "border-blue-400 bg-blue-50 shadow-sm"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Online Payment
                      </span>
                      <span className="text-sm text-gray-500">
                        Pay securely using Razorpay
                      </span>
                    </div>
                    <img
                      src={Razorpay}
                      alt="Razorpay"
                      className="ml-auto h-16"
                    />
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    onClick={() => setSelectedMethod("cod")}
                    className={`flex items-center gap-4 rounded-xl p-4 py-8 cursor-pointer transition-all  duration-300 active:scale-100 border-2 ${
                      selectedMethod === "cod"
                        ? "border-green-400 bg-green-50 shadow-sm"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        Cash on Delivery
                      </span>
                      <span className="text-sm text-gray-500">
                        Pay with cash upon delivery
                      </span>
                    </div>
                    <img src={COD} alt="COD" className="ml-auto h-10" />
                  </label>
                </div>

                {/* Selected Payment Display */}
                <div className="mt-4 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
                  {selectedMethod === "razorpay" ? (
                    <>
                      <span className="text-gray-700 font-medium">
                        Payment Method:{" "}
                        <span className="text-blue-600">Online (Razorpay)</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700 font-medium">
                        Payment Method:{" "}
                        <span className="text-green-600">Cash on Delivery</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Shipping Address Card */}
                <div className="mt-6 border rounded-xl p-4 bg-white shadow-sm">
                  <div className="font-semibold text-gray-800 mb-2">
                    Shipping Address
                  </div>
                  {addressList[selectAddress] ? (
                    <div className="text-sm text-gray-600">
                      {addressList[selectAddress].name || "NA"}
                      <br />
                      {addressList[selectAddress].address_line1 || "NA"}
                      <br />
                      {addressList[selectAddress].address_line2 || "NA"}
                      <br />
                      {addressList[selectAddress].city || "NA"}
                      <br />
                      {addressList[selectAddress].country || "NA"}
                      <br />
                      {addressList[selectAddress].mobile || "NA"}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      No address selected
                    </div>
                  )}
                </div>

                {/* Place Order Button */}
                <div className="flex items-center justify-center">
                  <button
                    className={`order mb-2 ${isAnimating ? "animate" : ""}`}
                    onClick={handleClick}
                  >
                    <span className="default">Complete Order</span>
                    <span className="success">
                      Order Placed
                      <svg viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1" />
                      </svg>
                    </span>
                    <div className="box"></div>
                    <div className="truck">
                      <div className="back"></div>
                      <div className="front">
                        <div className="window"></div>
                      </div>
                      <div className="light top"></div>
                      <div className="light bottom"></div>
                    </div>
                    <div className="lines"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden sticky flex flex-col gap-4 p-4 px-2">
        
        <Accordion
          title={<span className="text-lg font-semibold">Confirm Address</span>}
          isOpen={openSection === "address"}
          onToggle={() =>
            setOpenSection(openSection === "address" ? null : "address")
          }
          customHeaderButton={
            <button
              onClick={() => navigate("/shopall")}
              className="flex  gap-1 items-center text-sm font-semibold bg-gray-100 border border-gray-300 p-1 px-2 rounded-xl text-black hover:bg-gray-100 transition-all duration-300 active:scale-95"
            >
              Shop More
              <GiShoppingBag />
            </button>
          }
          footerButton={
            <button
              className="text-md font-semibold w-full bg-black text-white px-4 py-4 rounded-full"
              onClick={handleAddressComplete}
            >
              Save Address & Continue
            </button>
          }
        >
          <div className="min-h-full overflow-y-auto">
            <div>
              {addressList.filter((a) => a.status).length === 0 ? (
                // Empty State
                <div className="m-3  p-4 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50 flex flex-col justify-center items-center text-center">
                  <div className="text-4xl text-gray-400 mb-2">
                    <FaLocationDot />
                  </div>
                  <p className="font-semibold text-gray-600 mb-1">
                    No Address Found
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Add your address to proceed with checkout.
                  </p>
                  <button
                    onClick={() => setOpenAddress(true)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 active:scale-95"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="rounded-xl">
                  {/* <div className="flex font-semibold items-center gap-2 bg-gray-200 pb-3 p-4 rounded-t-xl mb-3">
              <FaLocationDot /> Choose your address
            </div> */}

                  <div className="bg-white gap-4 px-5 py-2 grid grid-cols-1 md:grid-cols-2 overflow-y-auto max-h-[72vh] lg:h-[60vh]">
                    {/* // Address Cards */}
                    {addressList.map((address, index) => {
                      const isActive = selectAddress === index;
                      if (!address.status) return null;

                      return (
                        // <div key={index} className="mx-3">
                        <>
                          <div
                            className={`border rounded-[20px] p-4 flex flex-col gap-2 max-w-sm h-fit cursor-pointer transition-all duration-300 active:scale-95 shadow-sm ${
                              isActive
                                ? "border-orange-400 border-2 bg-orange-50"
                                : "border-gray-300 bg-white"
                            }`}
                            onClick={() => setSelectAddress(index)}
                          >
                            <input
                              id={"address" + index}
                              type="radio"
                              value={index}
                              onChange={(e) =>
                                setSelectAddress(Number(e.target.value))
                              }
                              name="address"
                              checked={isActive}
                              className="hidden"
                            />

                            <div className="flex items-center justify-between">
                              <span className="text-md font-semibold text-gray-800">
                                {address.name || "Krunal Mistry"}
                              </span>
                              {isActive && (
                                <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded-md">
                                  Selected
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-gray-600 leading-5">
                              <p>{address.address_line1}</p>
                              {address.address_line2 && (
                                <p>{address.address_line2}</p>
                              )}
                              <p>
                                {address.city}, {address.state}
                              </p>
                              <p>
                                {address.country} - {address.pincode}
                              </p>
                            </div>

                            <p className="text-sm font-medium text-gray-700">
                              📞 {address.mobile}
                            </p>
                          </div>
                        </>
                        // {/* </div> */}
                      );
                    })}

                    {/* Add Another Address only when one address is active */}
                  </div>
                  {addressList.filter((a) => a.status).length === 1 && (
                    <div className="flex-1 px-4 mt-5 flex items-stretch">
                      <div
                        onClick={() => setOpenAddress(true)}
                        className="border-2 border-dashed rounded-xl p-4 flex flex-col justify-center items-center w-full max-w-sm h-full py-32 max-h-full cursor-pointer transition-all duration-300 active:scale-95 shadow-sm"
                      >
                        <span className="text-md font-semibold text-orange-600 flex flex-col gap-1 items-center">
                          <MdOutlineAddHomeWork className="text-4xl" />
                          Add Another Address
                        </span>
                      </div>
                    </div>
                  )}
                  {addressList.filter((a) => a.status).length > 1 && (
<div className="fixed right-2 bottom-24 z-50 flex flex-col items-center  animate-bounce">
  {/* Tooltip with arrow */}
  <div className="relative mb-2 animate-pulse ">
    <div className="z-20 border border-orange-400 border-dotted backdrop:blur-sm bg-white text-orange-400 text-sm font-semibold px-3 py-1 rounded-lg shadow-md">
      Add Address
    </div>
    {/* Arrow */}
<div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 
  border-l-8 border-l-transparent 
  border-r-8 border-r-transparent 
  border-t-8 border-t-orange-400">
</div>
  </div>

  {/* Floating Button */}
  <div className=" text-white text-lg rounded-full bg-orange-500 p-4 hover:scale-110 transition-transform duration-300 shadow-lg">
    <MdMyLocation  onClick={() => setOpenAddress(true)} />
  </div>
</div>


                  )}
                </div>
              )}
            </div>
          </div>
        </Accordion>

        <Accordion
          title={
            <span className="text-lg font-semibold">Product Checkout</span>
          }
          isOpen={openSection === "product"}
          onToggle={() =>
            setOpenSection(openSection === "product" ? null : "product")
          }
          onPrevious={() => setOpenSection("address")} // 👈 New
          footerButton={
            <button
              className="font-semibold text-md w-full bg-black text-white px-4 py-4 rounded-full"
              onClick={handleProductComplete}
            >
              Proceed to Billing
            </button>
          }
        >
          <div>
            <div className="w-full  bg-white  px-2 overflow-y-auto h-full max-h-fit">
              {/**summary**/}
              {checkoutItems.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-4 py-2 mb-3 font-semibold bg-green-100 text-green-600 rounded-lg">
                    <p>Your total savings</p>
                    <p>
                      {DisplayPriceInRupees(
                        discountedPrice + promocodeDiscount
                      )}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg  grid gap-5 overflow-auto w-full h-full max-h-fit">
                    {checkoutItems.map((item, productIndex) =>
                      item.variantPrices.map((variant, index) => {
                        const isDetailsVisible =
                          showGiftWrapDetails[`${productIndex}-${index}`] ??
                          true;

                        return (
                          <div
                            key={`${item.productId}_product_${index}`}
                            className={`flex flex-col w-full gap-4 border-b pb-4 border rounded-xl px-3 transition-colors duration-300 ${
                              variant.isGiftWrap
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-3 cursor-pointer select-none text-[#ff5050] relative">
                                <label
                                  htmlFor={`gift-wrap-${productIndex}-${index}`}
                                  className="inline-flex items-center cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    id={`gift-wrap-${productIndex}-${index}`}
                                    onChange={(e) =>
                                      handleGiftWrapChange(
                                        productIndex,
                                        index,
                                        variant.weight,
                                        e.target.checked
                                      )
                                    }
                                    checked={variant.isGiftWrap || false}
                                    className="hidden"
                                  />

                                  <div
                                    className={`w-[1.5em] h-[1.5em] flex items-center justify-center border-2 rounded-md border-[#ff5050] transition-colors duration-300 ${
                                      variant.isGiftWrap
                                        ? "bg-[#ff5050]"
                                        : "bg-white"
                                    }`}
                                  >
                                    {variant.isGiftWrap && (
                                      <CiGift className="text-white text-md scale-125" />
                                    )}
                                  </div>

                                  <span
                                    className={`ml-3 text-base font-semibold text-red-500 select-none`}
                                  >
                                    {variant.isGiftWrap ? (
                                      <>
                                        <span className="text-xs">Wrapped</span>
                                      </>
                                    ) : (
                                      "Wrapped as Gift ?"
                                    )}
                                  </span>
                                </label>
                              </div>

                              {variant.isGiftWrap && (
                                <button
                                  onClick={() =>
                                    setShowGiftWrapDetails((prev) => ({
                                      ...prev,
                                      [`${productIndex}-${index}`]:
                                        !isDetailsVisible,
                                    }))
                                  }
                                  className="text-sm text-red-600 hover:text-red-800 bg-white px-2 py-1 rounded-lg transition"
                                >
                                  {isDetailsVisible ? (
                                    <>
                                      <span>
                                        {" "}
                                        <FaAngleUp />{" "}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-xs">
                                        Add Gift Message
                                      </span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* ✅ Smooth Transition Box */}
                            <div
                              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                variant.isGiftWrap
                                  ? isDetailsVisible
                                    ? "max-h-[1000px] opacity-100"
                                    : "max-h-0 opacity-0"
                                  : "hidden"
                              }`}
                            >
                              <div className="mt-2 py-2 rounded-xl border-red-200 bg-red-50 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-lg font-semibold text-red-800">
                                    Gift Add-ons
                                  </h4>
                                  {/* <button
                                  onClick={() =>
                                    handleGiftWrapChange(
                                      productIndex,
                                      index,
                                      variant.weight,
                                      false
                                    )
                                  }
                                  className="text-sm text-pink-600 hover:text-pink-800 transition underline"
                                >
                                  ❌ Hide
                                </button> */}
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-sm text-gray-700">
                                    How many notes?
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() =>
                                        handleGiftNoteQtyChange(
                                          productIndex,
                                          index,
                                          variant.weight,
                                          -1
                                        )
                                      }
                                      disabled={
                                        giftNoteQtys[
                                          `${productIndex}-${index}`
                                        ] <= 1
                                      }
                                      className="w-8 h-8 border border-red-600 rounded-full font-normal bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                      -
                                    </button>
                                    <span className="px-4 py-1 rounded-lg border border-red-400 text-gray-800 bg-white">
                                      {giftNoteQtys[
                                        `${productIndex}-${index}`
                                      ] || (variant.isGiftWrap ? 1 : 0)}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleGiftNoteQtyChange(
                                          productIndex,
                                          index,
                                          variant.weight,
                                          1
                                        )
                                      }
                                      disabled={
                                        giftNoteQtys[
                                          `${productIndex}-${index}`
                                        ] >= variant.quantity
                                      }
                                      className="w-8 h-8 border border-red-600 rounded-full bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {[
                                  ...Array(
                                    giftNoteQtys[`${productIndex}-${index}`] ||
                                      1
                                  ),
                                ].map((_, giftIndex) => {
                                  const noteKey = `${productIndex}-${index}-${giftIndex}`;
                                  const isEditable = giftNoteEditable[noteKey];
                                  const currentNote = giftNotes[noteKey] || "";

                                  return (
                                    <div
                                      key={giftIndex}
                                      className="mb-4 p-3 bg-white border rounded-md shadow-sm"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <label className="font-medium text-gray-800">
                                          ✍️{" "}
                                          {giftIndex === 0
                                            ? "Sweet Note"
                                            : `Shoutout ${giftIndex + 1}`}
                                        </label>
                                        <span className="text-xs text-gray-500">
                                          {currentNote.length}/70
                                        </span>
                                      </div>

                                      {isEditable ? (
                                        <>
                                          <textarea
                                            ref={(element) => {
                                              if (element) {
                                                element.focus();
                                              }
                                            }}
                                            value={currentNote}
                                            onChange={(e) =>
                                              handleGiftNoteChange(
                                                productIndex,
                                                index,
                                                giftIndex,
                                                e.target.value
                                              )
                                            }
                                            maxLength={70}
                                            className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                                            placeholder="Write something special here..."
                                          />
                                          <div className="flex h-full mt-2">
                                            <button
                                              onClick={() =>
                                                handleGiftNoteSave(
                                                  productIndex,
                                                  index,
                                                  giftIndex
                                                )
                                              }
                                              className="bg-red-500 font-semibold hover:bg-red-700 text-white w-full px-4 py-1.5 rounded-md transition"
                                            >
                                              Save Changes
                                            </button>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="flex items-start justify-between gap-2">
                                          <div
                                            className="flex-grow bg-gray-100 text-gray-700 p-2 rounded-md min-h-[2.5rem]"
                                            onClick={() =>
                                              handleGiftNoteEdit(
                                                productIndex,
                                                index,
                                                giftIndex
                                              )
                                            }
                                          >
                                            {currentNote || "No message yet"}
                                          </div>
                                          {/* <button
                                           
                                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-3 rounded-md transition"
                                          >
                                            <CiEdit />
                                          </button> */}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Product Display */}

                            <div className="flex gap-4 items-start">
                              <div className="w-20 h-20 rounded-lg bg-gray-200">
                                <img
                                  src={item.coverimage}
                                  alt={item.name}
                                  className="w-full h-full object-scale-down rounded-lg"
                                />
                              </div>
                              <div className="w-full">
                                <p className="text-sm font-semibold">
                                  {item.itemname}
                                </p>
                                <div
                                  key={`${item.productId}_variant_${index}`}
                                  className="flex justify-between items-center mt-2"
                                >
                                  <div>
                                    <p className="text-xs text-neutral-600 ">
                                      {variant.weight}
                                    </p>
                                    <p className="font-semibold mt-1">
                                      {DisplayPriceInRupees(
                                        pricewithDiscount(
                                          variant.price,
                                          variant.discount
                                        ) * variant.quantity
                                      )}
                                    </p>
                                  </div>
                                  <div className="w-full max-w-[150px]">
                                    <div className="flex w-full h-full">
                                      <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
                                        Qt: {variant.quantity}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                // <SkeletonCardLoader/>
                <>
                  <div className="flex flex-col items-center justify-center h-full ">
                    <SkeletonCardLoader className="max-w-sm" />
                  </div>
                </>
              )}
            </div>
          </div>
        </Accordion>

        <Accordion
          title={
            <>
              <span className="text-lg font-semibold">Promo & Billing</span>
            </>
          }
          isOpen={openSection === "promo"}
          onToggle={() =>
            setOpenSection(openSection === "promo" ? null : "promo")
          }
          onPrevious={() => setOpenSection("product")}
          footerButton={
            <button
              className="text-md font-semibold w-full bg-black text-white px-4 py-4 rounded-full"
              onClick={handlePromoComplete}
            >
              Proceed to Checkout
            </button>
          }
        >
          <div>
            <div className="w-full  bg-white overflow-y-auto h-full max-h-[75vh]">
              {/* <div className="flex font-semibold items-center gap-2 bg-gray-200 pb-3 p-4 rounded-t-xl mb-3 text-lg">
              <IoBagCheckOutline className="text-xl" /> Checkout
            </div> */}

              {/* Promocode Section */}
              <div className="bg-white p-4">
                <h3 className="font-semibold mb-2">Apply Promocode</h3>

                {appliedPromocode ? (
                  <div
                    ref={promoRef}
                    className="bg-green-100 border-2 border-dashed border-green-400 p-3 rounded-lg mb-3 shiny-button"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{appliedPromocode.code}</p>
                        <p className="text-sm font-semibold text-green-600">
                          {appliedPromocode.discountType === "percentage"
                            ? `${appliedPromocode.discountValue}% off`
                            : `₹${appliedPromocode.discountValue} off`}
                        </p>
                        <p className="text-xs text-gray-800 ">
                          You saved{" "}
                          <span className="font-medium">
                            {DisplayPriceInRupees(promocodeDiscount)}
                          </span>{" "}
                          on this order !
                        </p>
                      </div>
                      <button
                        onClick={removePromocode}
                        className="text-red-500 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className="flex text-black">
                      <input
                        type="text"
                        value={selectedPromocode ? selectedPromocode.code : ""}
                        placeholder="Enter Promocode"
                        className="flex-1 border-gray-300 border-r border-2 border-dashed p-2 rounded-l-xl font-semibold"
                        disabled
                      />
                      <button
                        onClick={applyPromocode}
                        disabled={isLoadingPromocode || !selectedPromocode}
                        className={`px-4 py-2 rounded-r-xl font-semibold text-white ${
                          isLoadingPromocode || !selectedPromocode
                            ? "bg-green-300"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {isLoadingPromocode ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    <button
                      onClick={() => setShowPromocodes(!showPromocodes)}
                      className="text-green-500 bg-white w-full px-2 py-1 rounded-lg text-sm mt-2 font-semibold"
                    >
                      {showPromocodes ? (
                        <>
                          <div className="flex gap-1 items-center">
                            <CiCircleChevUp className="text-lg" />
                            Hide Available Codes
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-1 items-center">
                            <CiCircleChevDown className="text-lg" /> View
                            Available Promocodes
                          </div>
                        </>
                      )}
                    </button>

                    {showPromocodes && (
                      <div
                        className={`transition-all border-2 border-gray-100 p-2 rounded-[15px] duration-500 ease-in-out overflow-y-auto overflow-hidden mt-2 ${
                          showPromocodes ? "max-h-60" : "max-h-0"
                        }`}
                      >
                        {promocodes.length > 0 ? (
                          promocodes
                            .filter((code) => code.isActive)
                            .map((code) => (
                              <div
                                key={code._id}
                                className="border-b-2 border-dotted mb-1 mt-1 py-1 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectPromocode(code)}
                              >
                                <div className="flex justify-between">
                                  <p className="font-semibold">{code.code}</p>
                                  <p className="text-md font-semibold">
                                    {code.discountType === "percentage"
                                      ? `${code.discountValue}% OFF`
                                      : `₹${code.discountValue} OFF`}
                                  </p>
                                </div>
                                <p className="text-xs flex flex-col justify-between  text-gray-500">
                                  <span>Min order: ₹{code.minOrderValue}</span>
                                  <span>
                                    Expires:{" "}
                                    {new Date(
                                      code.expiryDate
                                    ).toLocaleDateString()}
                                  </span>
                                </p>
                              </div>
                            ))
                        ) : (
                          <p className="text-center p-2">
                            No promocodes available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-white p-4 space-y-3">
                <h3 className="font-semibold">Bill details</h3>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Items total</p>
                  <p className="flex items-center gap-2">
                    <span className="line-through text-neutral-400">
                      {DisplayPriceInRupees(finalTotal)}
                    </span>
                    <span>
                      {DisplayPriceInRupees(finalTotal - discountedPrice)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Quantity total</p>
                  <p className="flex items-center gap-2">{quantity} items</p>
                </div>
                {promocodeDiscount > 0 && (
                  <div className="flex gap-4 justify-between ml-1 text-green-600">
                    <p>Promocode discount</p>
                    <p className="flex items-center gap-2">
                      - {DisplayPriceInRupees(promocodeDiscount)}
                    </p>
                  </div>
                )}
                <div className="flex gap-4 justify-between ml-1">
                  <p>Delivery Charge</p>
                  <p className="flex items-center gap-2">Free</p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>GiftWrap Charges </p>
                  <p className="flex items-center gap-2">
                    {DisplayPriceInRupees(GiftWrapCharges)}
                  </p>
                </div>
                <div className="font-semibold flex items-center justify-between gap-4 mt-2 pt-2 border-t">
                  <p>Grand total</p>
                  <p>
                    <p>{DisplayPriceInRupees(grandTotal)}</p>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion
          title={
            <>
              <span className="text-lg font-semibold">Checkout</span>
            </>
          }
          isOpen={openSection === "checkout"}
          onToggle={() =>
            setOpenSection(openSection === "checkout" ? null : "checkout")
          }
          onPrevious={() => setOpenSection("promo")}
          footerButton={
            <>
              <div className="flex items-center justify-center">
                <button
                  className={`order ${isAnimating ? "animate" : ""}`}
                  onClick={handleClick}
                >
                  <span className="default">Complete Order</span>
                  <span className="success">
                    Order Placed
                    <svg viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1" />
                    </svg>
                  </span>
                  <div className="box"></div>
                  <div className="truck">
                    <div className="back"></div>
                    <div className="front">
                      <div className="window"></div>
                    </div>
                    <div className="light top"></div>
                    <div className="light bottom"></div>
                  </div>
                  <div className="lines"></div>
                </button>
              </div>
            </>
          }
        >
          <div>
            <div className="mt-4 space-y-4">
              <div className="flex flex-col gap-0 md:gap-2">
                {/* Razorpay Option */}
                <label
                  className={`flex items-center gap-4 rounded-xl p-4 py-5 cursor-pointer transition-all  duration-300 active:scale-100 border-2 ${
                    selectedMethod === "razorpay"
                      ? "border-blue-400 bg-blue-50 shadow-sm"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={selectedMethod === "razorpay"}
                    onChange={() => setSelectedMethod("razorpay")}
                    className="form-radio text-blue-600 w-5 h-5"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      Online Payment
                    </span>
                    <span className="text-sm text-gray-500">
                      Pay securely using Razorpay
                    </span>
                  </div>
                  <img src={Razorpay} alt="Razorpay" className="ml-auto h-16" />
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-center gap-4 rounded-xl p-4 py-8 cursor-pointer transition-all  duration-300 active:scale-100 border-2 ${
                    selectedMethod === "cod"
                      ? "border-green-400 bg-green-50 shadow-sm"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={selectedMethod === "cod"}
                    onChange={() => setSelectedMethod("cod")}
                    className="form-radio text-green-600 w-5 h-5"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      Cash on Delivery
                    </span>
                    <span className="text-sm text-gray-500">
                      Pay with cash upon delivery
                    </span>
                  </div>
                  <img src={COD} alt="COD" className="ml-auto h-10" />
                </label>
              </div>

              <div className="flex flex-col gap-0 md:gap-2 justify-center">
                {/* Selected Payment Display */}
                <div className=" md:mt-0 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
                  {selectedMethod === "razorpay" ? (
                    <>
                      <span className="text-gray-700 font-medium">
                        Payment Method:{" "}
                        <span className="text-blue-600">Online (Razorpay)</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700 font-medium">
                        Payment Method:{" "}
                        <span className="text-green-600">Cash on Delivery</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Shipping Address Card */}
                <div className="mt-6 md:mt-0 border rounded-xl p-4 bg-white shadow-sm">
                  <div className="font-semibold text-gray-800 mb-2">
                    Shipping Address
                  </div>

                  {addressList[selectAddress] ? (
                    <div className="text-sm text-gray-600">
                      {addressList[selectAddress].name || "NA"}
                      <br />
                      {addressList[selectAddress].address_line1 || "NA"}
                      <br />
                      {addressList[selectAddress].address_line2 || "NA"}
                      <br />
                      {addressList[selectAddress].city || "NA"}
                      <br />
                      {addressList[selectAddress].country || "NA"}
                      <br />
                      {addressList[selectAddress].mobile || "NA"}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      No address selected
                    </div>
                  )}
                </div>
              </div>

              {/* Place Order Button */}
            </div>
          </div>
        </Accordion>
      </div>
      {(paymentStatus.isProcessing ||
        paymentStatus.hasFailed ||
        paymentStatus.paymentcancel) && (
        <ProcesspaymentModal
          status={paymentStatus}
          onClose={() =>
            setPaymentStatus({
              isProcessing: false,
              method: null,
              hasFailed: false,
              paymentcancel: false,
            })
          }
        />
       )} 

      {showModal && (
        <AddAddressDesktop
          open={openAddress}
          close={() => setOpenAddress(false)}
        />
      )}

      {/* <div className="flex w-full items-center justify-center">
        <CheckOutSteps />
      </div> */}
    </section>
  );
};

export default CheckoutPage;
