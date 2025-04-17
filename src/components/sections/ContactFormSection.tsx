import React from 'react';

const ContactFormSection = () => {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left side - Contact us text */}
          <div className="md:w-1/2">
            <h3 className="text-lg font-medium text-[#FF8A00] mb-4">Contact us</h3>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1E2A36] mb-4">
              Welcome to a world of limitless possibilities, where the journey is as exhilarating as the destination,
            </h2>
            
            <p className="text-sm md:text-base text-gray-600 mb-4">
              where every moment is an opportunity to make your mark on the canvas of existence. The only limit is the extent of your imagination.
            </p>
          </div>

          {/* Right side - Contact form */}
          <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[#FF8A00] mb-4">Send Us Message</h3>
            
            <form className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Phone number input */}
              <div>
                <label htmlFor="phone" className="block text-sm text-gray-600 mb-1">Phone number</label>
                <input 
                  type="tel" 
                  id="phone"
                  placeholder="Enter your phone number" 
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Second phone number input (which appears to be mislabeled as Phone number in the image) */}
              <div>
                <label htmlFor="phone2" className="block text-sm text-gray-600 mb-1">Phone number</label>
                <input 
                  type="email" 
                  id="phone2"
                  placeholder="Enter your email" 
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Third phone number input */}
              <div>
                <label htmlFor="phone3" className="block text-sm text-gray-600 mb-1">Phone number</label>
                <input 
                  type="tel" 
                  id="phone3"
                  placeholder="Enter your phone number" 
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                />
              </div>
              
              {/* Submit button */}
              <button 
                type="submit" 
                className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
              >
                Send A message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;