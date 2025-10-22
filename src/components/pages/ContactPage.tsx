"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import emailjs from 'emailjs-com';
import logger from '@/utils/logger';

const ContactPage = () => {
  // Initialize EmailJS with key from environment variable
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_CONTACT_PUBLIC_KEY || 'GwpR6HErNwXDhHY8_');
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Loading and success/error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Send email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_CONTACT || 'service_3xw1ha8', // EmailJS service ID
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT || 'template_8ofcv4m', // EmailJS template ID
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          time: new Date().toLocaleString()
        },
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_PUBLIC_KEY || 'GwpR6HErNwXDhHY8_' // EmailJS public key
      );

      // Handle success
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully!'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      // Handle error
      logger.error('Error sending email:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white mt-3">
      {/* Hero Section - Responsive width */}
      <div className="relative h-[40vh] md:h-[50vh] w-full md:max-w-[86%] md:mx-auto overflow-hidden md:rounded-lg">
        <Image
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Nordic Loop Sustainability"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E2A36]/90 to-[#1E2A36]/70"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <div className="w-24 h-1 bg-[#FF8A00] mb-6"></div>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            We&apos;re here to help you transform waste into valuable resources
          </p>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="mx-7 md:max-w-[86%] md:mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Contact Information */}
          <div className="order-2 lg:order-1">
            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[#1E2A36] mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Our team is ready to answer your questions about sustainable material trading and circular economy solutions. Reach out to us through any of the channels below.
              </p>

              <div className="space-y-8">
                {/* Email Card */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1E2A36] mb-1">Email Us</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@nordicloop.se" className="text-[#FF8A00] hover:underline">info@nordicloop.se</a>
                    </p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1E2A36] mb-1">Call Us</h3>
                    <p className="text-gray-600 mb-1">
                      <a href="tel:+46704356584" className="text-[#FF8A00] hover:underline">+46 70 435 6584</a>
                    </p>
                    <p className="text-gray-600">
                      Business Hours:<br />
                      Monday-Friday: 9am - 5pm CET
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-medium text-[#1E2A36] mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/nordic-loop"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Nordic Loop on LinkedIn"
                  className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center text-white hover:bg-[#004182] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <h2 className="text-2xl font-semibold text-[#FF8A00] mb-6">Send Us a Message</h2>

              {/* Status message */}
              {submitStatus && (
                <div className={`p-4 mb-6 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {submitStatus.message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                  />
                </div>

                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                  />
                </div>

                {/* Subject input */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                  />
                </div>

                {/* Message input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you"
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
