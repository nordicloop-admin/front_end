"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Sustainable Business"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A36]/90 to-[#1E2A36]/70"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            About Nordic Loop
          </h1>
          <div className="w-24 h-1 bg-[#FF8A00] mb-6"></div>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Transforming waste into valuable resources through innovative marketplace solutions
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1E2A36] mb-6">Our Mission & Vision</h2>
              <div className="w-16 h-1 bg-[#FF8A00] mb-6"></div>
              <p className="text-gray-600 mb-6">
                At Nordic Loop, our mission is to revolutionize waste management by creating a seamless marketplace where businesses can trade surplus materials, reducing costs and environmental impact simultaneously.
              </p>
              <p className="text-gray-600 mb-6">
                We envision a future where waste is no longer seen as a burden but as a valuable resource in a circular economy. By connecting businesses and facilitating the exchange of materials that would otherwise be discarded, we're building a more sustainable future for generations to come.
              </p>
              <p className="text-gray-600">
                Our platform is designed to make this vision a reality by providing businesses with the tools they need to participate in the circular economy efficiently and profitably.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                alt="Nordic Loop Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Core Values</h2>
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Nordic Loop, from how we build our platform to how we interact with our customers and partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sustainability Value */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1E2A36] mb-4 text-center">Sustainability</h3>
              <p className="text-gray-600 text-center">
                We're committed to creating a positive environmental impact by reducing waste and promoting resource efficiency. Every decision we make is guided by our commitment to sustainability.
              </p>
            </div>

            {/* Innovation Value */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1E2A36] mb-4 text-center">Innovation</h3>
              <p className="text-gray-600 text-center">
                We constantly seek new and better ways to solve waste management challenges. Our platform leverages cutting-edge technology to create efficient, user-friendly solutions.
              </p>
            </div>

            {/* Integrity Value */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1E2A36] mb-4 text-center">Integrity</h3>
              <p className="text-gray-600 text-center">
                We operate with honesty, transparency, and fairness in all our dealings. Our users can trust that we always act in their best interest and maintain the highest ethical standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                alt="Nordic Loop Story"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-[#1E2A36] mb-6">Our Story</h2>
              <div className="w-16 h-1 bg-[#FF8A00] mb-6"></div>
              <p className="text-gray-600 mb-6">
                Nordic Loop was founded in 2023 by a team of entrepreneurs passionate about sustainability and circular economy principles. After witnessing the enormous amount of waste generated by businesses across industries, we recognized an opportunity to create a solution that would benefit both businesses and the environment.
              </p>
              <p className="text-gray-600 mb-6">
                Our founders combined their expertise in technology, sustainability, and business to create a platform that makes it easy for companies to trade surplus materials, reducing waste and creating new value streams.
              </p>
              <p className="text-gray-600">
                Today, Nordic Loop is growing rapidly, connecting businesses across the Nordic region and beyond. We're proud of the positive impact we're making and excited about the future of our platform and the circular economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Team</h2>
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet the passionate individuals behind Nordic Loop who are dedicated to transforming waste management and promoting sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-[300px]">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                  alt="Team Member"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1E2A36] mb-1">Erik Johansson</h3>
                <p className="text-[#FF8A00] font-medium mb-4">Co-Founder & CEO</p>
                <p className="text-gray-600">
                  With over 15 years of experience in sustainability and business development, Erik leads our vision and strategy.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-[300px]">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                  alt="Team Member"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1E2A36] mb-1">Anna Lindberg</h3>
                <p className="text-[#FF8A00] font-medium mb-4">Co-Founder & CTO</p>
                <p className="text-gray-600">
                  Anna brings her expertise in technology and marketplace platforms to create our innovative solution.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-[300px]">
                <Image
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                  alt="Team Member"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1E2A36] mb-1">Markus Svensson</h3>
                <p className="text-[#FF8A00] font-medium mb-4">Head of Sustainability</p>
                <p className="text-gray-600">
                  Markus ensures that sustainability principles are integrated into every aspect of our business and platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Impact</h2>
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Through our platform, we're making a real difference in waste reduction and resource efficiency. Here's the impact we've made so far.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Impact Stat 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#FF8A00] mb-2">5,000+</div>
              <h3 className="text-xl font-semibold text-[#1E2A36] mb-4">Tons of Waste Diverted</h3>
              <p className="text-gray-600">
                Materials that would have ended up in landfills are now being reused and recycled through our platform.
              </p>
            </div>

            {/* Impact Stat 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#FF8A00] mb-2">200+</div>
              <h3 className="text-xl font-semibold text-[#1E2A36] mb-4">Businesses Connected</h3>
              <p className="text-gray-600">
                Companies across various industries are finding value in each other's waste streams.
              </p>
            </div>

            {/* Impact Stat 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#FF8A00] mb-2">3,500+</div>
              <h3 className="text-xl font-semibold text-[#1E2A36] mb-4">Tons of CO₂ Saved</h3>
              <p className="text-gray-600">
                By reducing the need for virgin materials and keeping resources in use, we're cutting carbon emissions.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
              These numbers are just the beginning. As our platform grows, so does our positive impact on the environment and the economy. Join us in our mission to create a more sustainable future.
            </p>
            <Link
              href="/contact"
              className="bg-[#FF8A00] text-white px-8 py-3 rounded-md hover:bg-[#e67e00] transition-colors inline-block font-medium"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1E2A36] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Circular Economy?</h2>
          <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
            Whether you have surplus materials to sell or you're looking for sustainable sourcing options, Nordic Loop can help you reduce costs and environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/coming-soon"
              className="bg-[#FF8A00] text-white px-8 py-3 rounded-md hover:bg-[#e67e00] transition-colors inline-block font-medium"
            >
              Join Us Now
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-white border border-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors inline-block font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
