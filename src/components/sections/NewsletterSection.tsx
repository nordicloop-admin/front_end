import React from 'react';

const NewsletterSection = () => {
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-[#1E2A36]">
          Get to know us more. Join our newsletter.
        </h2>

        <form className="mt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#FF8A00] text-white px-6 py-2 rounded-md hover:bg-[#e67e00] transition-colors font-medium text-sm"
            >
              Submit
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            By clicking Sign Up you're confirming that you agree with our Terms and Conditions.
          </p>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
