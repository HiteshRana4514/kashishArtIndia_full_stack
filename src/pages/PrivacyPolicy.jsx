import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            How we collect, use, and protect your information
          </p>
        </div>
      
        <div className="max-w-4xl mx-auto">
          <p className="mb-4 text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Introduction</h2>
            <p className="text-gray-600">
              At Kashish Art India, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
              and make purchases from us.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Information We Collect</h2>
            <p className="mb-4 text-gray-600">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Personal identification information (Name, email address, phone number, etc.)</li>
              <li>Shipping and billing information</li>
              <li>Payment details (processed securely through our payment processors)</li>
              <li>Browsing behavior and preferences</li>
              <li>Device information (IP address, browser type, etc.)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">How We Use Your Information</h2>
            <p className="mb-4 text-gray-600">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your order or inquiries</li>
              <li>Send you promotional materials and newsletters (if you've opted in)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Cookies and Tracking</h2>
            <p className="text-gray-600">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, 
              or destruction of your personal data. However, no method of transmission over the Internet 
              or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Third-Party Services</h2>
            <p className="text-gray-600">
              We may employ third-party companies and individuals to facilitate our service, provide service on our behalf, 
              or assist us in analyzing how our service is used. These third parties have access to your personal data only 
              to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Rights</h2>
            <p className="mb-4 text-gray-600">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to the processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-gray-600">
              Email: info@kashishartindia.com<br />
              Phone: +91 9835117590
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
