"use client";

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="mt-3">
          <p className="text-base text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      question: "How does the Nordic Loop marketplace work?",
      answer: "Our marketplace connects businesses that generate waste with other businesses that can use those materials. Sellers list their available materials, and buyers can browse, request samples, or place bids. We facilitate secure transactions through our escrow payment system, while shipping arrangements are made directly between the parties involved."
    },
    {
      question: "What is the pricing model for using Nordic Loop?",
      answer: "Nordic Loop offers three pricing tiers: Free Plan (9% commission), Standard Plan (7% commission with more features), and Premium Plan (no commission with full feature access). Each plan is designed to accommodate businesses of different sizes and trading volumes."
    },
    {
      question: "How are shipping and logistics handled?",
      answer: "Shipping and logistics are arranged directly between buyers and sellers. Once a transaction is confirmed, both parties can coordinate the most efficient and cost-effective shipping method. Nordic Loop provides communication tools to facilitate these arrangements but does not handle the physical transportation of materials."
    },
    {
      question: "What types of materials can be traded on the platform?",
      answer: "Nordic Loop supports trading of various industrial surplus materials including plastics, metals, textiles, wood, paper, glass, chemicals, and more. All materials must comply with local regulations regarding waste management and transportation."
    },
    {
      question: "How does the escrow payment system work?",
      answer: "Our escrow system holds the buyer's payment securely until they confirm receipt and acceptance of the materials. This protects both parties: buyers only release payment when satisfied with what they've received, and sellers know the funds are guaranteed once they ship the materials."
    },
    {
      question: "What information do the AI sustainability reports include?",
      answer: "Our AI-powered sustainability reports provide detailed analytics on CO₂ emissions saved, waste diverted from landfills, and resource conservation metrics. These reports can be used for ESG reporting, sustainability initiatives, and demonstrating your company's environmental impact."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white relative">
      {/* Visual connector to contact section */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-gray-50 rotate-45 z-10 hidden md:block"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1E2A36] mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Nordic Loop's B2B waste marketplace.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              toggleOpen={() => toggleFAQ(index)}
            />
          ))}

          {/* Transition element with CTA */}
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 mb-6">
              Still have questions? We're here to help!
            </p>
            <button
              onClick={scrollToContact}
              className="bg-[#FF8A00] text-white px-8 py-3 rounded-lg hover:bg-[#e67e00] transition-colors inline-flex items-center gap-2 font-medium"
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
