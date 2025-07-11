import { useState } from "react";
import { apiRequest } from "../utils/api";
import { useToast } from "../components/ToastContext";

const Contact = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Format the data for our API
      const contactData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "Contact Form Inquiry",
        message: `${formData.message}\n\nPhone: ${
          formData.mobile || "Not provided"
        }`,
      };


      // Send data to our backend API
      const response = await apiRequest("/email/contact", "POST", contactData);


      if (response.success) {
        setSubmitSuccess(true);
        toast.success(
          "Thank you for your message! We will get back to you soon."
        );
        setFormData({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitError(
        error.message || "Failed to send your message. Please try again later."
      );
      toast.error("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question about our paintings or want to commission a custom
            piece? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div
            className="bg-white rounded-2xl shadow-lg p-8 card-hover"
            data-aos="fade-right"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Thank you for your message! We have sent you a confirmation
                  email and will get back to you soon.
                </div>
              )}

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {submitError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div data-aos="fade-up" data-aos-delay="200">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div data-aos="fade-up" data-aos-delay="300">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="400">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent transition-all duration-200"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="500">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent transition-all duration-200"
                  placeholder="What is this about?"
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="600">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent transition-all duration-200"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-kashish-blue hover:bg-blue-700"
                } text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center`}
                data-aos="fade-up"
                data-aos-delay="600"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div data-aos="fade-left" data-aos-delay="200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                We're here to help and answer any questions you might have. We
                look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              <div
                className="flex items-start space-x-4"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="w-12 h-12 bg-kashish-blue rounded-lg flex items-center justify-center flex-shrink-0 pulse-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Email
                  </h3>
                  <a
                    className="text-gray-600"
                    href="mailto:info@kashishartindia.com"
                  >
                    info@kashishartindia.com
                  </a>
                </div>
              </div>

              <div
                className="flex items-start space-x-4"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                <div className="w-12 h-12 bg-kashish-red rounded-lg flex items-center justify-center flex-shrink-0 pulse-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Phone
                  </h3>
                  <p className="text-gray-600">+91 9835117590</p>
                  {/* <p className="text-gray-600">+91 98765 43211</p> */}
                </div>
              </div>

              <div
                className="flex items-start space-x-4"
                data-aos="fade-left"
                data-aos-delay="500"
              >
                <div className="w-12 h-12 bg-kashish-green rounded-lg flex items-center justify-center flex-shrink-0 pulse-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Address
                  </h3>
                  <p className="text-gray-600">
                    G 101 Rajhans Residency<br></br> Sector 1, Greater Noida (W){" "}
                    <br></br> 201306, India
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div
              className="bg-white rounded-xl p-6 shadow-sm card-hover"
              data-aos="fade-left"
              data-aos-delay="600"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="bg-white rounded-xl p-6 shadow-sm card-hover"
              data-aos="fade-left"
              data-aos-delay="700"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/AmanChakra"
                  target="_blank"
                  className="w-10 h-10 bg-kashish-blue rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href=" https://www.instagram.com/amanchakra"
                  target="_blank"
                  className="w-10 h-10 bg-kashish-blue rounded-lg flex items-center justify-center text-white hover:bg-pink-600 transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5c3.176 0 5.75-2.574 5.75-5.75v-8.5C22 4.574 19.426 2 16.25 2h-8.5zM12 8a4 4 0 110 8 4 4 0 010-8zm6.5-.25a1 1 0 110 2 1 1 0 010-2zM12 10a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </a>

                <a
                  href="https://www.youtube.com/@achakra"
                  target="_blank"
                  className="w-10 h-10 bg-kashish-blue rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184H4.385A1.385 1.385 0 003 4.57v14.86a1.385 1.385 0 001.385 1.385h15.23A1.385 1.385 0 0021 19.43V4.57a1.385 1.385 0 00-1.385-1.385zm-8.186 13.1V7.716l5.774 4.284-5.774 4.284z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/chakra.aman"
                  target="_blank"
                  className="w-10 h-10 bg-kashish-blue rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="text-center mb-8" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Find Our Studio
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit us at our art studio in Noida. We're located in the vibrant
              Rajhans Residency, easily accessible by public transport.
            </p>
          </div>

          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="relative h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3503.9254753989253!2d77.4417385338684!3d28.57200049974361!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceec0ffc458bf%3A0xd368779c7b6a7ca4!2sRajhans%20Residency%2C%20Noida%20Extension!5e0!3m2!1sen!2sin!4v1751953021001!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Kashish Art Studio Location"
                className="w-full h-full"
              ></iframe>

              {/* Map Overlay with Studio Info */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-kashish-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Kashish Art India
                    </h3>
                    <p className="text-sm text-gray-600">
                      Art Gallery & Studio
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    📍 G 101 Rajhans Residency, Sector 1, Greater Noida (W),
                    201306
                  </p>
                  <p>📞 +91 9835117590</p>
                  <p>🕒 Mon-Fri: 9AM-6PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Directions */}
          {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="bg-white p-6 rounded-xl shadow-sm card-hover text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="w-12 h-12 bg-kashish-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">By Metro</h3>
              <p className="text-gray-600">Nearest station: Colaba Metro Station (5 min walk)</p>
            </div>

            <div 
              className="bg-white p-6 rounded-xl shadow-sm card-hover text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="w-12 h-12 bg-kashish-red rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">By Bus</h3>
              <p className="text-gray-600">Bus routes: 1, 2, 3, 4 (Colaba Bus Stop)</p>
            </div>

            <div 
              className="bg-white p-6 rounded-xl shadow-sm card-hover text-center"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="w-12 h-12 bg-kashish-green rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">By Car</h3>
              <p className="text-gray-600">Parking available at nearby Colaba Parking Complex</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
