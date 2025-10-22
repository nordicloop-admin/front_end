"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WasteValueSection from "../../components/sections/WasteValueSection";
import FeaturesSection from "../../components/sections/FeaturesSection";
import AnalyticsSection from "../../components/sections/AnalyticsSection";
import StatsSection from "../../components/sections/StatsSection";


// Define interfaces for data structures
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  phone?: string;
}

const AboutPage = () => {
  // State for interactive elements
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);
  const [hoveredTeamMember, setHoveredTeamMember] = useState<number | null>(null);

  // Timeline data
  const timelineItems = [
    {
      year: 'September 2024',
      title: 'The Beginning',
      description: 'Nordic Loop was founded with a vision to transform waste management in the Nordic region.',
    },
    {
      year: 'December 2024',
      title: 'National Recognition',
      description: 'Selected among the Top 20 Startup Ideas in Sweden 2024 by Venture Cup.',
    },
    {
      year: 'May 2025',
      title: 'MVP Launch',
      description: 'Development and launch of the MVP and onboarding of the first clients.',
    },
    {
      year: 'September 2025',
      title: 'Market Presence',
      description: 'Established as a recognized player in the circular economy, gaining market visibility and reaching 20 active clients.',
    },
  ];

  // Team data
  const teamMembers: TeamMember[] = [
    {
      name: 'Shaya Rahimian',
      role: 'CEO & Co-founder',
      bio: 'Shaya brings over 3 years of experience in marketing and campaign management. With a deep understanding of the circular economy, negotiation, advertisement, and marketing strategies he has spearheaded the creation of Nordic Loop\'s platform, leading the company\'s strategic growth and market entry in Sweden.',
      image: '/images/About/Shaya.jpeg',
      email: 'shaya.rahimian@nordicloop.se',
      phone: '+46 70 435 6584',
    },
    {
      name: 'Nicola Valenti',
      role: 'COO & Co-founder',
      bio: 'Nicola leads the operations, communications, and customer Success team, focusing on client onboarding, user satisfaction, and support services. He ensures that clients derive maximum value from the Nordic Loop platform. He also brings extensive experience in digital marketing and brand strategy.',
      image: '/images/About/Nicola Valenti Coo & Co-founder.jpeg',
      email: 'nicola.valenti@nordicloop.se',
      phone: '+46 737553358',
    },
    {
      name: 'Elin Bergman',
      role: 'Board member and industry expert',
      bio: 'Elin Bergman is known for being the "Circular Economy Queen of Sweden", is named LinkedIn Top Green Voice and is a recognized international TEDx and keynote speaker. She works as a Circular Impact Officer, Vice Chair and spokesperson of the Swedish circular economy business network Cradlenet, and is also one of the co-founders of the international circular economy initiatives Nordic Circular Hotspot and the Circular Economy Coalition. She has recently started the Circular Handshake initiative to make the retail sector circular. For many years she worked as circular economy expert at WWF Sweden, where she developed the international circular economy network Baltic Stewardship Initiative, to enable the recirculation of nutrients in the Baltic Sea region in the agri-food sector.',
      image: '/images/About/Elin Bergman.webp',
    },
    {
      name: 'Raissa Uwase',
      role: 'Technical Lead',
      bio: 'With extensive experience across multiple tech companies, Raissa brings deep expertise in developing complex, enterprise-scale systems. Her background in leading challenging technical projects makes her an ideal leader for Nordic Loop\'s technology development.',
      image: '/images/About/Raissa Uwase Technical Lead.jpeg',
    },
    {
      name: 'Olivier Karera',
      role: 'Software Engineer',
      bio: 'Olivier is a software engineer at Nordic Loop, focusing on the development and maintenance of the platform. He is responsible for building the features that enable businesses to participate in the circular economy, ensuring the system is both robust and user-friendly.',
      image: '/images/About/Olivier Karera software engineer.png',
    },
  ];

  // Values data
  const _values = [
    {
      title: 'Sustainability',
      description: 'We are committed to environmental stewardship and promoting sustainable business practices toward SDGs 12 and 13.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We constantly seek new solutions and approaches to waste management challenges and circular economy.',
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
  const _testimonials = [
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
      <section className="relative w-full overflow-hidden bg-white mt-6 md:mt-8">
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
        
        {/* Team Section - Interactive cards */}
      <section className="py-16 bg-[#F5F5F5] mx-7 md:max-w-[86%] md:mx-auto">
        <div className="px-4 md:px-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet the passionate individuals behind Nordic Loop who are dedicated to transforming waste management and promoting sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                onMouseEnter={() => setHoveredTeamMember(index)}
                onMouseLeave={() => setHoveredTeamMember(null)}
              >
                
                <div className="px-6 pb-10">
                  <div className="relative h-[300px] my-6 md:my-8">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={`object-cover transition-all duration-500 ${member.name === 'Nicola Valenti' || member.name === 'Olivier Karera'   ? 'object-center' : 'object-[center_20%]'}`}
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
                  <h3 className="text-xl font-semibold text-[#1E2A36] mb-1">{member.name}</h3>
                  <p className="text-[#FF8A00] font-medium mb-2">{member.role}</p>
                  {member.email && (
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Email:</span> {member.email}
                    </p>
                  )}
                  {member.phone && (
                    <p className="text-gray-600 text-sm mb-4">
                      <span className="font-medium">Phone:</span> {member.phone}
                    </p>
                  )}
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* Minimal scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#1E2A36]/30 z-20 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest font-light mb-2 text-[#1E2A36]/50">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div> */}
      </section>

      {/* Main content anchor */}
      <div id="main-content" className="mb-6 md:mb-8"></div>

      <WasteValueSection />
      <FeaturesSection />
      <AnalyticsSection />
      <StatsSection />

      {/* Mission & Vision Section - Asymmetrical layout */}
      

      {/* Values Section - Horizontal cards with icons */}
      {/* <section id="values-section" className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-7">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at Nordic Loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg flex flex-col items-center text-center h-full border border-gray-100">
                <div className="w-16 h-16 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1E2A36] mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Timeline Section - New section not in original */}
      <section className="py-16 md:py-24 mx-7 md:max-w-[86%] md:mx-auto">
        <div>
          <div className="text-center mb-16">
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

      

      {/* Impact Section - Circular progress indicators */}
      <section className="py-16 md:py-24 mx-7 md:max-w-[86%] md:mx-auto">
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Our Goals</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Through our platform, we&apos;re making a real difference in waste reduction and resource efficiency. Here&apos;s the impact we want to make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {impactStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6 my-6 md:my-8">
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
      {/* <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-7">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">What Our Partners Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from businesses that have transformed their approach to waste management with Nordic Loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border border-gray-100">
                <div className="flex items-start mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 my-2">
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
      </section> */}

      {/* CTA Section - Different style */}
      <section className="py-16 bg-[#1E2A36] text-white mb-16 md:bg-gray-100 md:max-w-[86%] md:mx-auto">
        <div className="px-6 md:px-12 md:bg-[#1E2A36] md:rounded-lg md:py-16 md:-my-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Ready to Join the Circular Economy?</h2>
              <p className="text-gray-300 mb-8">
                Whether you have surplus materials to sell or you&apos;re looking for sustainable sourcing options, Nordic Loop can help you reduce costs and environmental impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="bg-[#FF8A00] text-white px-8 py-3 rounded hover:bg-[#e67e00] transition-colors inline-block font-medium"
                >
                  Join Us Now
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border border-white text-white px-8 py-3 rounded hover:bg-white/10 transition-colors inline-block font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden my-6 md:my-8">
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


