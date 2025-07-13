import React from 'react';
import { Heart, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Abdullah Hassan
            </div>
            <p className="text-gray-400">Customer Service Professional</p>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <a
              href="mailto:abdullahthere1112@gmail.com"
              className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
            >
              <Mail size={24} />
            </a>
            <a
              href="tel:+923350953159"
              className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
            >
              <Phone size={24} />
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm mt-1">
              © 2025 All rights reserved
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h4 className="text-white font-semibold mb-2">Contact</h4>
              <p className="text-gray-400 text-sm">abdullahthere1112@gmail.com</p>
              <p className="text-gray-400 text-sm">+92 335 0953159</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Location</h4>
              <p className="text-gray-400 text-sm">Village Chak Hafizan</p>
              <p className="text-gray-400 text-sm">Jhelum, Punjab, Pakistan</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Languages</h4>
              <p className="text-gray-400 text-sm">English, Urdu</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Professional portfolio showcasing customer service excellence and technical expertise
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;