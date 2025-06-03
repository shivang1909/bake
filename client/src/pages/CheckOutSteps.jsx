import React, { useState } from 'react';

const steps = ['cart', 'checkout', 'order'];
const stepTitles = ['Cart', 'Checkout', 'Order'];
const nextBtnLabels = ['Proceed to Checkout', 'Confirm Order', ''];
const prevBtnLabels = ['', 'Go to Cart', 'Back to Checkout'];

const CheckOutSteps = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const goToNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  return (
    <div className="bg-white sm:px-8 px-4 py-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center">

        {/* Stepper */}
        <div className="flex items-start mb-16 w-full transition-all duration-500">
          {steps.map((step, index) => {
            const isActive = stepIndex >= index;

            return (
              <div key={step} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full transition-all duration-500 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-300 text-white'
                    }`}
                  >
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-full h-[3px] mx-4 rounded-lg relative overflow-hidden bg-slate-300">
                      <div
                        className={`absolute left-0 top-0 h-full bg-blue-600 transition-all duration-700`}
                        style={{ width: stepIndex > index ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <h6
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {stepTitles[index]}
                  </h6>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="w-full text-center">
          {steps[stepIndex] === 'cart' && (
            <div id="step-cart">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Delivery Details</h2>
              <div className="grid lg:grid-cols-2 gap-y-6 gap-x-4 text-left">
                <input type="text" placeholder="First Name" className="border p-2 rounded" />
                <input type="text" placeholder="Last Name" className="border p-2 rounded" />
                <input type="email" placeholder="Email" className="border p-2 rounded" />
                <input type="text" placeholder="Phone No." className="border p-2 rounded" />
              </div>
            </div>
          )}

          {steps[stepIndex] === 'checkout' && (
            <div id="step-checkout">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Payment & Summary</h2>
              <div className="bg-gray-100 p-4 rounded-md mb-4">Order Summary Here</div>
            </div>
          )}

          {steps[stepIndex] === 'order' && (
            <div id="step-order">
              <h2 className="text-xl font-semibold text-green-600">Order Confirmed!</h2>
              <p className="text-slate-700 mt-2">Thank you for your purchase.</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10 w-full max-w-md">
          <button
            onClick={goToPrevious}
            disabled={stepIndex === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
              stepIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
            }`}
          >
            {prevBtnLabels[stepIndex]}
          </button>
          {stepIndex < steps.length - 1 && (
            <button
              onClick={goToNext}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {nextBtnLabels[stepIndex]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOutSteps;
