import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function NotFoundPage() {
 const navigate = useNavigate();
    const handleGoHome = () => {
     navigate("/",{replace:true});
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Simple 404 */}
        <h1 className="text-6xl sm:text-7xl font-bold text-gray-800 mb-6">
          404
        </h1>


        {/* Simple Message */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
       
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist.
        </p>


        {/* Single Home Button */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mx-auto"
        >
          <Home size={20} />
          Go to Home
        </button>
      </div>
    </div>
  );
}
