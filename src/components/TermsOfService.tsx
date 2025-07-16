import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-indigo dark:prose-invert">
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
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
          <p>
            <a href="/" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
              &larr; Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
