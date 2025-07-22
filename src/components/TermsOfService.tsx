import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-4">Last updated: July 16, 2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to MystiView. These Terms of Service ("Terms") govern your use of our website
          and services. By using MystiView, you agree to these Terms in full. If you disagree
          with these Terms or any part of them, you must not use our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Service Description</h2>
        <p>
          MystiView provides an AI-powered palm reading service for entertainment purposes only.
          Our service uses artificial intelligence to analyze images of palms uploaded by users
          and generates personalized readings based on patterns detected in those images.
        </p>
        <p className="mt-4">
          <strong>Important Disclaimer</strong>: The palm readings provided by MystiView are for
          entertainment purposes only and should not be considered as professional advice, medical
          diagnosis, or treatment recommendation. Our AI system provides generalized interpretations
          and should not be used for making important life decisions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Obligations</h2>
        <p>As a user of MystiView, you agree:</p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>To provide only your own palm images or images you have permission to use</li>
          <li>Not to use our service for any illegal or unauthorized purpose</li>
          <li>Not to attempt to disrupt or compromise the security of our service</li>
          <li>Not to upload content that is offensive, harmful, or violates others' rights</li>
          <li>To be at least 13 years of age to use this service</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          MystiView and its original content, features, and functionality are owned by us and
          are protected by international copyright, trademark, and other intellectual property laws.
        </p>
        <p className="mt-2">
          By uploading palm images to our service, you grant us a non-exclusive, worldwide, royalty-free
          license to use, store, and process those images solely for the purpose of providing our service to you.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
        <p>
          MystiView is provided on an "as is" and "as available" basis. We make no warranties, 
          expressed or implied, regarding the reliability, accuracy, or availability of our service.
        </p>
        <p className="mt-2">
          In no event shall MystiView be liable for any indirect, incidental, special, consequential,
          or punitive damages arising out of or related to your use of our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. When we do, we will revise
          the "last updated" date at the top of this page. We encourage users to frequently
          check this page for any changes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
          <a href="mailto:mystiview@gmail.com" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 ml-1">
            mystiview@gmail.com
          </a>
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

export default TermsOfService;
