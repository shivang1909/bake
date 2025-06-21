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
      <div className="relative w-full sm:w-[90%] max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-xl px-6 py-6 sm:py-8 transition-all duration-500 ease-in-out">

        {/* Header */}
        <div className="flex items-center justify-center relative  border-b">
          <span className="text-lg font-semibold text-gray-800 mb-3">{title}</span>
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
              <p className="text-sm text-gray-600">
                {status.method === "cod"
                  ? "Your order will be processed and you will pay upon delivery."
                  : "Please don’t close or refresh while we’re verifying your payment."}
                <br />
                This may take a few seconds.
              </p>

              {/* Spinner */}
              <div className="mt-2 flex justify-center items-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-t-orange-400 border-transparent rounded-full animate-spin" />
                  <div className="absolute inset-2 border-4 border-t-[#008E97] border-transparent rounded-full animate-spin-slower" />
                </div>
              </div>
            </>
          )}

          {status.hasFailed && (
            <p className="mt-2 text-sm font-semibold text-balance text-red-600">
              Oops! Your payment could not be completed. If any amount was
              deducted, it will be refunded in 5 to 7 working days.
            </p>
           )} 

          {status.paymentcancel && (
          <p className="mt-2 font-semibold text-sm text-yellow-600">
  You’ve cancelled the payment. If that wasn’t intentional, feel free to try again or pick a different payment method.
</p>

           )} 
        </div>
      </div>
    </div>
  );
}
