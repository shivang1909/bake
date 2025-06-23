import { Link } from "react-router-dom";
import "../assets/styles/paymentloader.css";

export default function ProcesspaymentModal({ status, onClose }) {
  const title = status.hasFailed
    ? "Payment Failed"
    : status.paymentcancel
    ? "Payment Cancelled"
    : status.method === "cod"
    ? "Processing Order"
    : "Processing Payment";

  const showClose = status.hasFailed || status.paymentcancel;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="relative h-full max-h-fit lg:max-h-fit w-full sm:w-[90%] max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-xl   transition-all duration-500 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-center relative py-5 border-b">
          <span className="text-lg font-semibold text-gray-800 ">
            {title}
          </span>
          {showClose && (
            <button
              onClick={onClose}
              className="absolute right-0 top-0 p-2 text-gray-400 hover:text-red-500 text-xl"
              aria-label="Close"
            >
              &times;
            </button>
          )}
        </div>

        {/* Description */}
        <div className="mt-1 text-center">
          {status.isProcessing && !status.hasFailed && (
          <>
          <div className="flex justify-center items-center py-5">
            <div class="coin ">
              <span class="engraving">₹</span>
            </div>
          </div>
            

            <p className="text-sm text-gray-800 font-semibold px-7 py-8 ">
              {status.method === "cod"
                ? "Your order will be processed and you will pay upon delivery."
                : "Please don’t close or refresh while we’re verifying your payment."}
              <br />
              This may take a few seconds.
            </p>
          </>
          )}

           {status.hasFailed && ( 
            <>
             <p className="mt-2 text-sm font-semibold text-balance text-red-600 py-3">
              Oops! Your payment could not be completed. If any amount was
              deducted, it will be refunded in 5 to 7 working days.
            </p>
            <div className="flex justify-center items-center py-5 px-5">
              <button className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300" onClick={onClose}>
             <Link to="/">Go to Home</Link>   
              </button>
            </div>
            </>
           
          )} 

          {status.paymentcancel && (
          <>
           <p className="mt-2 font-semibold text-sm text-yellow-600 py-3">
              You’ve cancelled the payment. If that wasn’t intentional, feel
              free to try again or pick a different payment method.
            </p>
            <div className="flex justify-center items-center py-5 px-5">
              <button className="w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg  transition-colors duration-300" onClick={onClose}>
             <Link to="/">Go to Home</Link>   
              </button>
            </div>
          </>
           
           )} 
        </div>
      </div>
    </div>
  );
}
