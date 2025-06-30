import React, { useEffect, useState } from "react";
import { FaArrowUp, FaBreadSlice, FaLeaf, FaAward, FaClock, FaHeart } from "react-icons/fa";
import { GiWheat, GiHotSpices } from "react-icons/gi";

const AboutUs = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}

 {/* Hero Banner with Brand Gradient */}
    <div className="mt-20 relative w-full h-[90vh] max-h-[900px] overflow-hidden">
    {/* Light gradient using softer versions of your brand colors */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#e6f7f8] via-[#fee9d7] to-orange-100 z-10"></div>
    
    <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
      <div className="max-w-4xl mx-auto">
       <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
  About Bake Flavours
</h1>
<p className="text-xl md:text-2xl mb-8">
  Where every bite is a celebration of tradition, taste, and love.
</p>

        <a
          href="#visit"
          className="inline-block px-8 py-3 bg-[#F58220] text-white hover:bg-[#e6730c] font-medium rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:ring-offset-2 focus:ring-offset-[#e6f7f8]"
          aria-label="Visit our bakery"
        >
          Visit Our Bakery
        </a>
      </div>
    </div>
    
    {/* Subtle decorative elements */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-30"></div>
    <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#008E97]/10"></div>
    <div className="absolute bottom-1/3 left-20 w-24 h-24 rounded-full bg-[#F58220]/10"></div>
    
    {/* Optional subtle texture */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')] opacity-10 z-10"></div>
  </div>


      {/* Our Story Section */}
     <section className="py-20 px-6 sm:px-8 lg:px-10 max-w-7xl mx-auto">
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
    <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
  </div>
  
  <div className="grid md:grid-cols-2 gap-12 items-center">
    <div className="order-2 md:order-1">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        From Local Oven to Loved Brand
      </h3>
      <p className="text-gray-600 mb-4">
        Bake Flavours began with a simple mission — to serve fresh, flavorful, and comforting baked goods to the local community. What started with small batches and homemade recipes quickly turned into a neighborhood favorite.
      </p>
      <p className="text-gray-600 mb-4">
        Over the years, we've expanded our offerings while staying true to traditional methods, quality ingredients, and a personal touch in every product we make. From soft cookies to crispy snacks, every item is a reflection of our love for baking.
      </p>
      <p className="text-gray-600">
        Today, Bake Flavours continues to bring joy to homes with treats made fresh daily. Whether it's a festive sweet box or your everyday snack, our goal remains the same — delivering happiness, one bite at a time.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
      <img 
        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80" 
        alt="Cozy bakery interior"
        className="rounded-lg shadow-md object-cover h-64 w-full"
        loading="lazy"
      />
      <img 
        src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80" 
        alt="Baker preparing dough"
        className="rounded-lg shadow-md object-cover h-64 w-full mt-8"
        loading="lazy"
      />
    </div>
  </div>
</section>


      {/* Baking Philosophy */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Baking Philosophy</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-md transition duration-300">
              <div className="text-amber-600 mb-4 flex justify-center">
                <GiWheat className="text-5xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Ingredients</h3>
              <p className="text-gray-600">
                We source organic flours, local dairy, and seasonal fruits. No artificial preservatives or shortcuts - just real ingredients.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-md transition duration-300">
              <div className="text-amber-600 mb-4 flex justify-center">
                <FaHeart className="text-5xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Handcrafted With Care</h3>
              <p className="text-gray-600">
                Every product is made by skilled bakers who take pride in their craft. Our slow fermentation creates depth of flavor.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center hover:shadow-md transition duration-300">
              <div className="text-amber-600 mb-4 flex justify-center">
                <GiHotSpices className="text-5xl" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovative Flavors</h3>
              <p className="text-gray-600">
                While respecting tradition, we create seasonal specialties and modern twists on classic recipes.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Bake Flavours</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaBreadSlice className="text-4xl mb-4 text-amber-600" aria-hidden="true" />,
                title: "Daily Freshness",
                text: "We bake in small batches throughout the day to ensure peak freshness in every product."
              },
              {
                icon: <FaLeaf className="text-4xl mb-4 text-amber-600" aria-hidden="true" />,
                title: "Sustainable Practices",
                text: "Committed to zero food waste, composting, and eco-friendly packaging."
              },
              {
                icon: <FaAward className="text-4xl mb-4 text-amber-600" aria-hidden="true" />,
                title: "Award Winning",
                text: "Recipient of the 2022 National Artisan Bakery Award for excellence."
              },
              {
                icon: <FaClock className="text-4xl mb-4 text-amber-600" aria-hidden="true" />,
                title: "Early Birds Welcome",
                text: "Our doors open at 6am with fresh coffee and warm pastries ready."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg text-center hover:shadow-md transition duration-300 h-full">
                <div className="flex justify-center" aria-hidden="true">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-10 max-w-7xl mx-auto" id="visit">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Visit Our Bakery</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Main Bakery</h3>
                <p className="text-gray-600">123 Baker Street, Flour District</p>
                <p className="text-gray-600">Open Daily: 6am - 6pm</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Downtown Cafe</h3>
                <p className="text-gray-600">456 Pastry Avenue, City Center</p>
                <p className="text-gray-600">Open Daily: 7am - 5pm</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
                <p className="text-gray-600">hello@bakeflavours.com</p>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition duration-300 mt-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Get directions to our bakery"
              >
                Get Directions
              </a>
            </div>
          </div>
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291865!2d-73.9878449241646!3d40.74844097138962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1689779993585!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Bake Flavours Bakery Location"
              aria-label="Map showing bakery location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-white border border-gray-200 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
          showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-6 h-6 mx-auto text-amber-600" />
      </button>
    </div>
  );
};

export default AboutUs;