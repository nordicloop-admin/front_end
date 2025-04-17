"use client";

import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const ContactFormSection = () => {
  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('GwpR6HErNwXDhHY8_');
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
        'service_3xw1ha8', // Your EmailJS service ID
        'template_8ofcv4m', // Your EmailJS template ID
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          time: new Date().toLocaleString()
        },
        'GwpR6HErNwXDhHY8_' // Your EmailJS public key
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
      console.error('Error sending email:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {/* Status message */}
            {submitStatus && (
              <div className={`p-3 mb-4 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {submitStatus.message}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name input */}
              <div>
                <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>

              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>

              {/* Subject input */}
              <div>
                <label htmlFor="subject" className="block text-sm text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>

              {/* Message input */}
              <div>
                <label htmlFor="message" className="block text-sm text-gray-600 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#FF8A00] text-white py-3 px-4 rounded-md hover:bg-[#e67e00] transition-colors text-center font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send A Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;