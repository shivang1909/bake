
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
export const ThankYouModal = ({close}) => (
    <>
    {console.log(close)}


    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-xl animate-slide-up border border-teal-100">
        <div className="mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-4">Thank you so much! 💝</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Thanks for sharing your thoughts! Your voice helps us make every experience even sweeter.


          </p>
        </div>
        <div className='flex justify-center'>
       
        <button
          onClick={close}
          className="bg-teal-500
         
          text-white px-8 py-3 rounded-full font-medium hover:bg-teal-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
          Continue Shopping
        </button>
            </div>
      </div>
         </div>
            </>
  );


