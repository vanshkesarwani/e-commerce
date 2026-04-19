import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top part of the footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo and Brand Info */}
          <div>
            <h4 className="font-serif text-2xl mb-4 text-white">Shoe Paradise</h4>
            <p className="text-sm opacity-80">
              Step into comfort and style. Your one-stop shop for all footwear needs.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-2 hover:text-yellow-400 transition duration-300 ease-in-out">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="hover:text-yellow-400 transition duration-300 ease-in-out">About Us</li>
              <li className="hover:text-yellow-400 transition duration-300 ease-in-out">Contact</li>
              <li className="hover:text-yellow-400 transition duration-300 ease-in-out">Shop Now</li>
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div>
            <h4 className="font-serif text-lg mb-2 hover:text-yellow-400 transition duration-300 ease-in-out">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="hover:text-yellow-400 transition duration-300 ease-in-out">Help</li>
              <li className="hover:text-yellow-400 transition duration-300 ease-in-out">Returns</li>
              <li className="hover:text-yellow-400 transition duration-300 ease-in-out">Order Tracking</li>
              <li className="hover:text-yellow-400 transition duration-300 ease-in-out">Shipping Rates</li>
            </ul>
          </div>

          {/* Column 4 - Connect with Us */}
          <div>
            <h4 className="font-serif text-lg mb-2 hover:text-yellow-400 transition duration-300 ease-in-out">
              Connect with Us
            </h4>
            <ul className="flex space-x-4 text-sm opacity-80">
              <li>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300 ease-in-out">
                  <FaFacebook size={24} />
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300 ease-in-out">
                  <FaTwitter size={24} />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300 ease-in-out">
                  <FaInstagram size={24} />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300 ease-in-out">
                  <FaLinkedin size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom part of the footer */}
        <div className="mt-10 text-center text-sm opacity-70">
          <p className="transform transition duration-500 hover:scale-110">
            &copy; {new Date().getFullYear()} Shoe Paradise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
