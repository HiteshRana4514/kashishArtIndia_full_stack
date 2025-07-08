const About = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About Kashish Art India
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the story behind our passion for art and the journey that led us to create beautiful paintings that celebrate India's rich cultural heritage.
          </p>
        </div>

        {/* Artist Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div
            data-aos="fade-right"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome to Kashish Art India Online Gallery – Where Art Finds Its Soul.
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Kashish Art India is a vibrant online art gallery that embodies the spirit of Indian culture, tradition, and artistic expression. Founded by celebrated artist Aman Chakra, who brings over 38 years of experience in fine arts and curation, the platform is a digital haven for art enthusiasts, collectors, and first-time buyers alike. It offers a carefully curated collection of original artworks that reflect the emotional depth and timeless beauty of Indian art.
              </p>
              <p>
                From classical styles like Madhubani, Pichwai, Kalamkari, Warli, and Patachitra to contemporary creations and custom portraits, each piece at Kashish Art India tells a meaningful story. These works capture the essence of India — its spirituality, festivals, rural simplicity, and natural beauty. More than just a gallery, it is a cultural bridge connecting people to the rich and diverse artistic heritage of India.
              </p>
            </div>
          </div>
          <div
            className="relative"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
              alt="Artist at work"
              className="rounded-xl shadow-lg card-hover"
            />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 gradient-bg rounded-full flex items-center justify-center pulse-glow">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div
          className="bg-gray-50 rounded-2xl p-12 mb-16"
          data-aos="zoom-in"
        >
          <div
            className="text-center mb-8"
            data-aos="fade-up"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Artistic Philosophy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We believe that art has the power to connect people, transcend boundaries, and tell stories that words cannot express.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-16 h-16 bg-kashish-blue rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Passion</h3>
              <p className="text-gray-600">
                Every brushstroke is infused with passion and dedication, creating artworks that resonate with emotion and authenticity.
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="w-16 h-16 bg-kashish-red rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We blend traditional techniques with contemporary approaches, creating unique artworks that honor the past while embracing the future.
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="w-16 h-16 bg-kashish-green rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Heritage</h3>
              <p className="text-gray-600">
                Our work celebrates India's rich cultural heritage, drawing inspiration from its diverse traditions, landscapes, and people.
              </p>
            </div>
          </div>
        </div>

        {/* Inspiration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div
            className="relative"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
              alt="Indian landscape"
              className="rounded-xl shadow-lg card-hover"
            />
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-kashish-red rounded-full flex items-center justify-center pulse-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <div
            data-aos="fade-left"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Objective
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                At Kashish Art India, our goal is to revive and showcase the hidden gems of Indian art that remain overlooked in today’s fast-paced world. We aim to give new life and global recognition to traditional and lesser-known art forms that reflect the depth and diversity of India’s cultural heritage.
              </p>
              <p>
                We believe that true art inspires, uplifts, and connects — going beyond decoration to touch the soul. By bringing together traditional and contemporary art on a single platform, we strive to bridge the gap between artists and art lovers worldwide. Through our exhibitions, collections, and online offerings, we share not just paintings or books, but the spirit and stories of India.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        {/* <div
          className="bg-kashish-blue rounded-2xl p-12 text-white text-center"
          data-aos="zoom-in"
        >
          <h2
            className="text-3xl font-bold mb-6"
            data-aos="fade-up"
          >
            Our Mission
          </h2>
          <p
            className="text-xl mb-8 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            To create beautiful, meaningful artworks that bring joy to homes around the world while celebrating the rich cultural heritage of India. We strive to make art accessible to everyone who appreciates beauty and creativity.
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Paintings Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Years of Experience</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default About 