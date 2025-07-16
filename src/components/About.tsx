import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-8 py-10">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 mb-6 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About MystiView</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Founded in 2025, MystiView combines ancient palmistry wisdom with cutting-edge AI technology. 
              Our journey began with a simple idea: make the mystical art of palm reading accessible to everyone 
              in a fun, modern way.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              At MystiView, we believe that self-discovery should be both enlightening and entertaining. 
              Our mission is to create a space where technology and tradition meet, offering people a moment 
              of reflection, curiosity, and joy as they explore the unique patterns in their palms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI-powered palm reading tool uses advanced image recognition to analyze the lines, mounts, 
              and patterns in your palm. Drawing from both traditional palmistry concepts and modern 
              psychological insights, our system generates personalized readings that are thoughtful, 
              positive, and engaging.
            </p>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-5 rounded-lg my-8">
              <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Important Note</h3>
              <p className="text-gray-600 dark:text-gray-300">
                MystiView's palm readings are created for entertainment purposes only. While many find our 
                readings insightful and fun, they should not be used as the basis for important life decisions 
                or as a substitute for professional advice.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300">
              MystiView was created by a small, passionate team of developers, designers, and enthusiasts 
              who share a fascination with both technology and the mystical arts. We're constantly working 
              to improve our palm reading algorithms and provide an experience that delights our users.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Join Our Journey</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We're just getting started, and we're excited to have you along for the ride. Try a palm reading, 
              share your experience with friends, and let us know what you think! Your feedback helps us improve 
              and grow.
            </p>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Have questions or feedback? Visit our <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact page</Link>.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 MystiView. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              Privacy Policy
            </Link>
            {" • "}
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              Terms of Service
            </Link>
            {" • "}
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
