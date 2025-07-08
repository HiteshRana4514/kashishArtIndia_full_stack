import React from 'react';

const TermsConditions = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Terms and conditions for using our website and services
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <p className="mb-4 text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Introduction</h2>
            <p className="text-gray-600">
              These Terms and Conditions ("Terms") govern your use of the Kashish Art India website and services. 
              By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of these 
              Terms, please do not use our website.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Use of Website</h2>
            <p className="mb-4 text-gray-600">
              Permission is granted to temporarily download one copy of the materials on Kashish Art India's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, 
              you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on Kashish Art India's website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Product Information</h2>
            <p className="text-gray-600">
              We make every effort to display the colors and details of our products as accurately as possible. 
              However, we cannot guarantee that your computer monitor's display will accurately reflect the actual colors of the products. 
              The paintings shown on our website are handmade, and each piece may have slight variations that make them unique.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pricing and Payment</h2>
            <p className="mb-4 text-gray-600">
              All prices are listed in Indian Rupees (INR) unless otherwise specified. We reserve the right to change prices at any time. 
              Payment must be made in full before the delivery of products.
            </p>
            <p className="text-gray-600">
              We accept various payment methods including credit/debit cards and other electronic payment methods as specified 
              during the checkout process. All payments are processed securely through our payment processors.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping and Delivery</h2>
            <p className="mb-4 text-gray-600">
              We ship our products within India and internationally. Shipping costs and estimated delivery times will be provided 
              during the checkout process. Customs duties and taxes may apply for international orders and are the responsibility of the customer.
            </p>
            <p className="text-gray-600">
              While we strive to ensure safe delivery of all products, we cannot be held responsible for delays or issues caused by 
              shipping carriers or customs authorities.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Returns and Refunds</h2>
            <p className="mb-4 text-gray-600">
              We accept returns within 7 days of delivery if the product is damaged during shipping or not as described. 
              To be eligible for a return, please contact us with details and photographs of the issue.
            </p>
            <p className="text-gray-600">
              Refunds will be processed within 14 days after receiving and inspecting the returned item. 
              Original shipping costs are non-refundable unless the return is due to our error.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Intellectual Property</h2>
            <p className="text-gray-600">
              All content on this website, including text, graphics, logos, images, audio clips, digital downloads, and data compilations, 
              is the property of Kashish Art India or its content suppliers and is protected by international copyright laws. 
              Reproduction is prohibited without written permission.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Limitation of Liability</h2>
            <p className="text-gray-600">
              Kashish Art India shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting 
              from the use or inability to use our products or services. We do not guarantee that our website will be free from errors, 
              defects, malware, or viruses.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the website. 
              Your continued use of the website after any changes indicates your acceptance of the modified Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Governing Law</h2>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at:
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

export default TermsConditions;
