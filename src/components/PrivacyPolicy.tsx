import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-indigo dark:prose-invert">
        <p className="text-lg mb-4">Last updated: July 16, 2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to MystiView ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you about how we look after your personal data when you visit our website and tell
          you about your privacy rights and how the law protects you.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
        <p>
          When you use our palm reading service, we collect the following data:
        </p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Images you upload for analysis (palm images)</li>
          <li>Browser type and version</li>
          <li>Usage data (how you interact with our service)</li>
          <li>IP address and approximate location (country level only)</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
        <p>We use your data to:</p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Provide our AI palm reading service</li>
          <li>Improve our algorithm and service quality</li>
          <li>Analyze usage patterns to enhance user experience</li>
          <li>Ensure technical functionality and security of our service</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention</h2>
        <p>
          We retain your palm images for a maximum of 24 hours to provide the service,
          after which they are automatically deleted from our servers. Analysis results may be
          retained in anonymized form for service improvement purposes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Third-Party Services</h2>
        <p>
          We use the following third-party services:
        </p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>OpenAI API for image analysis</li>
          <li>Google Analytics for website analytics</li>
          <li>ElevenLabs and Google Cloud for text-to-speech conversion</li>
        </ul>
        <p>
          Each third-party service has their own privacy policies governing the use of your data.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
        <p>
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Right to access your data</li>
          <li>Right to correct inaccurate data</li>
          <li>Right to delete your data</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
