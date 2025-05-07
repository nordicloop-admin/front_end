"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  // State for interactive elements
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);
  const [hoveredTeamMember, setHoveredTeamMember] = useState<number | null>(null);

  // Timeline data
  const timelineItems = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Nordic Loop was founded with a vision to transform waste management in the Nordic region.',
    },
    {
      year: '2021',
      title: 'First Partnerships',
      description: 'We established our first key partnerships with businesses committed to sustainability.',
    },
    {
      year: '2022',
      title: 'Platform Launch',
      description: 'Our marketplace platform was officially launched, connecting businesses across the region.',
    },
    {
      year: '2023',
      title: 'Expansion',
      description: 'Nordic Loop expanded operations beyond the Nordic countries, reaching new markets.',
    },
    {
      year: 'Today',
      title: 'Growing Impact',
      description: 'We continue to grow, connecting more businesses and making a significant environmental impact.',
    },
  ];

  // Team data
  const teamMembers = [
    {
      name: 'Shaya Rahimian',
      role: 'CEO & Co-founder',
      bio: 'Shaya brings over 3 years of experience in marketing and campaign management. With a deep understanding of the circular economy, negotiation, advertisement, and marketing strategies he has spearheaded the creation of Nordic Loop\'s platform, leading the company\'s strategic growth and market entry in Sweden.',
      image: '/images/About/Shaya.jpeg',
    },
    {
      name: 'Nicola Valenti',
      role: 'COO & Co-founder',
      bio: 'Nicola leads the operations, communications, and customer Success team, focusing on client onboarding, user satisfaction, and support services. He ensures that clients derive maximum value from the Nordic Loop platform. He also brings extensive experience in digital marketing and brand strategy.',
      image: '/images/About/nick.jpeg',
    },
    {
      name: 'Raissa Uwase',
      role: 'CTO',
      bio: 'With extensive experience across multiple tech companies, Raissa brings deep expertise in developing complex, enterprise-scale systems. Her background in leading challenging technical projects and implementing innovative solutions makes her the ideal leader for Nordic Loop\'s technology strategy and platform development.',
      image: '/images/About/raissa uwase.jpeg',
    },
    {
      name: 'Olivier Karera',
      role: 'Principal Engineer',
      bio: 'Olivier brings technical expertise to Nordic Loop, developing innovative solutions and architectural designs that power the platform. He focuses on creating scalable systems that deliver exceptional user experiences for our customers.',
      image: '/images/About/Olivier Karera.png',
    },
  ];

  // Values data
  const values = [
    {
      title: 'Sustainability',
      description: 'We are committed to environmental stewardship and promoting sustainable business practices.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We constantly seek new solutions and approaches to waste management challenges.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of partnerships and working together to achieve common goals.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  // Impact data
  const impactStats = [
    { value: '5,000+', label: 'Tons of Waste Diverted', description: 'Materials that would have ended up in landfills are now being reused and recycled through our platform.' },
    { value: '200+', label: 'Businesses Connected', description: 'Companies across various industries are finding value in each other\'s waste streams.' },
    { value: '3,500+', label: 'Tons of CO₂ Saved', description: 'By reducing the need for virgin materials and keeping resources in use, we\'re cutting carbon emissions.' },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "Nordic Loop has transformed how we handle our waste materials. What was once a cost center is now generating revenue for our business.",
      author: "Maria Svensson",
      company: "Eco Manufacturing AB",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    },
    {
      quote: "The platform is intuitive and has connected us with suppliers we never would have found otherwise. It's a game-changer for sustainable sourcing.",
      author: "Anders Nilsson",
      company: "Green Solutions Nordic",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Full-Width Elegant Hero Section with Side-by-Side Layout */}
      <section className="relative w-full overflow-hidden bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="h-full w-full"
               style={{
                 backgroundImage: 'radial-gradient(#1E2A36 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }}>
          </div>
        </div>

        {/* Main hero content */}
        <div className="min-h-[90vh] flex flex-col md:flex-row">
          {/* Left content area - Takes full width on mobile, 45% on desktop */}
          <div className="w-full md:w-[45%] px-8 md:px-16 lg:px-24 py-20 md:py-0 flex flex-col justify-center">
            {/* Minimal section label */}
            <div className="mb-8 flex items-center">
              <div className="h-[1px] w-12 bg-[#FF8A00]"></div>
              <span className="ml-4 text-sm uppercase tracking-widest text-[#1E2A36]/70 font-light">About Us</span>
            </div>

            {/* Refined typography for main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1E2A36] mb-8 leading-tight">
              Transforming waste into <span className="text-[#FF8A00] font-normal">valuable resources</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-[#1E2A36]/80 leading-relaxed mb-12 max-w-xl">
              Nordic Loop connects businesses to trade surplus materials, reducing costs, cutting CO₂ emissions, and driving sustainability through our innovative marketplace.
            </p>

            {/* Key stats with minimal styling - Horizontal layout */}
            <div className="grid grid-cols-3 gap-6 mb-12 border-t border-[#1E2A36]/10 pt-8">
              <div>
                <div className="text-3xl font-light text-[#FF8A00]">5,000+</div>
                <div className="text-xs uppercase tracking-widest text-[#1E2A36]/70 font-light mt-1">Tons Diverted</div>
              </div>

              <div>
                <div className="text-3xl font-light text-[#FF8A00]">200+</div>
                <div className="text-xs uppercase tracking-widest text-[#1E2A36]/70 font-light mt-1">Businesses</div>
              </div>

              <div>
                <div className="text-3xl font-light text-[#FF8A00]">3,500+</div>
                <div className="text-xs uppercase tracking-widest text-[#1E2A36]/70 font-light mt-1">CO₂ Saved</div>
              </div>
            </div>

            {/* Minimal CTAs */}
            <div className="flex space-x-8">
              <Link
                href="/contact"
                className="group inline-flex items-center text-[#1E2A36] hover:text-[#FF8A00] transition-colors duration-300"
              >
                <span className="mr-3 text-sm uppercase tracking-widest font-light">Contact Us</span>
                <span className="h-[1px] w-8 bg-current transition-all duration-300 group-hover:w-12"></span>
              </Link>

              <Link
                href="/coming-soon"
                className="group inline-flex items-center text-[#1E2A36] hover:text-[#FF8A00] transition-colors duration-300"
              >
                <span className="mr-3 text-sm uppercase tracking-widest font-light">Join Network</span>
                <span className="h-[1px] w-8 bg-current transition-all duration-300 group-hover:w-12"></span>
              </Link>
            </div>
          </div>

          {/* Right image area - Takes full width on mobile, 55% on desktop */}
          <div className="w-full md:w-[55%] relative min-h-[50vh] md:min-h-full">
            {/* Main image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                alt="Sustainable Business"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A36]/30 to-transparent"></div>
            </div>

            {/* Elegant company values card */}
            <div className="absolute bottom-12 left-12 max-w-sm">
              <div className="bg-white/90 backdrop-blur-sm p-8 shadow-sm">
                <div className="mb-4 flex items-center">
                  <div className="h-[1px] w-8 bg-[#FF8A00]"></div>
                  <span className="ml-3 text-xs uppercase tracking-widest text-[#1E2A36]/70 font-light">Our Values</span>
                </div>
                <p className="text-sm text-[#1E2A36]/80 leading-relaxed">
                  We believe in sustainability, innovation, and collaboration as the foundation for creating a circular economy that benefits businesses and the environment.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => document.getElementById('values-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-[#FF8A00] text-xs uppercase tracking-widest font-light flex items-center group"
                  >
                    <span className="group-hover:mr-4 mr-2 transition-all duration-300">Explore values</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-12 right-12 w-16 h-16 border border-white/30 rounded-full"></div>
            <div className="absolute top-20 right-20 w-8 h-8 bg-[#FF8A00]/20 rounded-full"></div>
          </div>
        </div>

        {/* Minimal scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#1E2A36]/30 z-20 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest font-light mb-2 text-[#1E2A36]/50">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Main content anchor */}
      <div id="main-content"></div>

      {/* Mission & Vision Section - Asymmetrical layout */}
      <section id="mission-section" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Image - Takes 5 columns on desktop */}
            <div className="md:col-span-5 relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                alt="Nordic Loop Mission"
                fill
                className="object-cover"
              />
            </div>

            {/* Text content - Takes 7 columns on desktop */}
            <div className="md:col-span-7">
              <div className="w-16 h-1 bg-[#FF8A00] mb-6"></div>
              <h2 className="text-3xl font-bold text-[#1E2A36] mb-6">Our Mission & Vision</h2>
              <p className="text-gray-600 mb-6">
                <span className="font-semibold">Our Mission:</span> At Nordic Loop, we revolutionize waste management by creating a seamless marketplace where businesses can trade surplus materials, reducing costs and environmental impact simultaneously.
              </p>
              <p className="text-gray-600 mb-6">
                <span className="font-semibold">Our Vision:</span> We envision a future where waste is no longer seen as a burden but as a valuable resource in a circular economy. By connecting businesses and facilitating the exchange of materials that would otherwise be discarded, we&apos;re building a more sustainable future for generations to come.
              </p>
              <p className="text-gray-600">
                Our platform is designed to make this vision a reality by providing businesses with the tools they need to participate in the circular economy efficiently and profitably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Horizontal cards with icons */}
      <section id="values-section" className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at Nordic Loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1E2A36] mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section - New section not in original */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From our founding to today, we&apos;ve been on a mission to transform waste management.
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>

            {/* Timeline items */}
            <div className="relative">
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center mb-16 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  onMouseEnter={() => setActiveTimelineItem(index)}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div
                      className={`transition-all duration-300 ${activeTimelineItem === index ? 'transform scale-105' : ''}`}
                    >
                      <div className="text-[#FF8A00] font-bold text-xl mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-[#1E2A36] mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div
                      className={`w-6 h-6 rounded-full border-4 border-gray-200 transition-all duration-300 ${
                        activeTimelineItem === index ? 'bg-[#FF8A00] scale-125' : 'bg-white'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-1 bg-gray-200"></div>

            {/* Timeline items */}
            <div className="relative">
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className="pl-16 mb-12 relative"
                  onMouseEnter={() => setActiveTimelineItem(index)}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0">
                    <div
                      className={`w-6 h-6 rounded-full border-4 border-gray-200 transition-all duration-300 ${
                        activeTimelineItem === index ? 'bg-[#FF8A00]' : 'bg-white'
                      }`}
                    ></div>
                  </div>

                  <div className="text-[#FF8A00] font-bold text-xl mb-2">{item.year}</div>
                  <h3 className="text-xl font-semibold text-[#1E2A36] mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Interactive cards */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet the passionate individuals behind Nordic Loop who are dedicated to transforming waste management and promoting sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredTeamMember(index)}
                onMouseLeave={() => setHoveredTeamMember(null)}
              >
                <div className="relative h-[300px]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-all duration-500"
                    style={{
                      transform: hoveredTeamMember === index ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#1E2A36] to-transparent opacity-0 transition-opacity duration-300"
                    style={{
                      opacity: hoveredTeamMember === index ? 0.7 : 0,
                    }}
                  ></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#1E2A36] mb-1">{member.name}</h3>
                  <p className="text-[#FF8A00] font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section - Circular progress indicators */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Through our platform, we&apos;re making a real difference in waste reduction and resource efficiency. Here&apos;s the impact we&apos;ve made so far.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {impactStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  {/* Circular background */}
                  <div className="absolute inset-0 rounded-full bg-[#F5F5F5]"></div>

                  {/* Circular progress */}
                  <div className="absolute inset-0 rounded-full border-8 border-[#FF8A00]"></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="text-3xl font-bold text-[#1E2A36]">{stat.value}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#1E2A36] mb-3 text-center">{stat.label}</h3>
                <p className="text-gray-600 text-center">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New section not in original */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-1 bg-[#FF8A00] mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">What Our Partners Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from businesses that have transformed their approach to waste management with Nordic Loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-start mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E2A36]">{testimonial.author}</h3>
                    <p className="text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Different style */}
      <section className="py-16 bg-[#1E2A36] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Ready to Join the Circular Economy?</h2>
              <p className="text-gray-300 mb-8">
                Whether you have surplus materials to sell or you&apos;re looking for sustainable sourcing options, Nordic Loop can help you reduce costs and environmental impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/coming-soon"
                  className="bg-[#FF8A00] text-white px-8 py-3 rounded-md hover:bg-[#e67e00] transition-colors inline-block font-medium"
                >
                  Join Us Now
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border border-white text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors inline-block font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
                alt="Join Nordic Loop"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#1E2A36]/50"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;