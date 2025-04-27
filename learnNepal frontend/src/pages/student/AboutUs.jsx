import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About LearnNepal
            </h1>
            <p className="text-xl mb-8">
              Empowering Nepali students through accessible, quality education
            </p>
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg flex items-center mx-auto hover:bg-blue-50">
              Start Learning <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At LearnNepal, we believe that education is a fundamental right
              for every individual in Nepal. Our mission is to make quality
              education accessible to all Nepali students, regardless of their
              geographical location or economic background.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Founded in 2020, LearnNepal has quickly grown into one of the
              country leading digital learning platforms, connecting students
              with exceptional educational resources and opportunities.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-6">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Quality Education
                  </h3>
                  <p className="text-gray-600">
                    We provide carefully curated educational content aligned
                    with Nepal curriculum, developed by experienced educators.
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-6">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Inclusive Learning
                  </h3>
                  <p className="text-gray-600">
                    Our platform is designed to be accessible to all students,
                    including those in remote areas and with different learning
                    needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Interactive Courses
                </h3>
                <p className="text-gray-600">
                  Engaging lessons with multimedia content across all subjects
                  for grades 1-12.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Expert Tutors
                </h3>
                <p className="text-gray-600">
                  One-on-one tutoring sessions with qualified teachers to
                  address individual learning needs.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Learning Community
                </h3>
                <p className="text-gray-600">
                  Connect with fellow students across Nepal to collaborate and
                  grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-10">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-4xl font-bold mb-2">150+</p>
                <p className="text-lg">Schools</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">25,000+</p>
                <p className="text-lg">Students</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">500+</p>
                <p className="text-lg">Tutors</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">75+</p>
                <p className="text-lg">Districts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 mb-10 text-center">
              Passionate educators and innovators dedicated to transforming
              education in Nepal
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">
                    Nischal Basnet
                  </h3>
                  <p className="text-blue-600 mb-4">Founder & CEO</p>
                  <p className="text-gray-600 text-sm">
                    Former educator with a passion for technology and equal
                    access to education.
                  </p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">
                    Sita Thapa
                  </h3>
                  <p className="text-blue-600 mb-4">Academic Director</p>
                  <p className="text-gray-600 text-sm">
                    Curriculum expert with over 15 years of experience in
                    educational programming.
                  </p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">
                    Bijay Poudel
                  </h3>
                  <p className="text-blue-600 mb-4">Tech Lead</p>
                  <p className="text-gray-600 text-sm">
                    Software engineer committed to creating intuitive learning
                    experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Get In Touch</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                      <div>
                        <p className="text-gray-800">Naya Baneshwor</p>
                        <p className="text-gray-600">Kathmandu, Nepal</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <p className="text-gray-800">+977 1-4444444</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <p className="text-gray-800">info@learnnepal.com</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Send us a message</h3>
                  <form>
                    <div className="mb-4">
                      <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                      <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                      <textarea rows="4" placeholder="Your Message" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-4">LearnNepal</h3>
                <p className="text-gray-400 max-w-xs">
                  Empowering Nepali students through accessible, quality
                  education.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Courses
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Tutors
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Resources
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Support</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Facebook</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Instagram</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Twitter</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8">
              <p className="text-gray-400 text-center">
                &copy; {new Date().getFullYear()} LearnNepal. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
