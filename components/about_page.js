'use client';

import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          About Us
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 mb-4">
            Welcome to our creative studio. We are passionate about design and innovation.
          </p>
          
          <p className="text-gray-600 mb-4">
            Our team of experts combines technical expertise with creative vision to deliver
            exceptional results for our clients.
          </p>
          
          <p className="text-gray-600">
            We believe in pushing boundaries and creating memorable experiences through
            thoughtful design and cutting-edge technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
