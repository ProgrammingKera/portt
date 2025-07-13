import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/923350953159"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="Contact via WhatsApp"
        >
          <MessageCircle size={24} />
        </a>
      </div>

      <section id="contact" className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Let's discuss opportunities or just connect professionally
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="animate-fade-in-left mx-auto lg:mx-0">
            <h3 className="text-2xl font-bold mb-8 text-white">Contact Information</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              I'm always interested in hearing about new opportunities and professional connections. 
              Whether you have a question about my experience or want to discuss potential collaboration, 
              feel free to reach out!
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Email</h4>
                  <a 
                    href="mailto:abdullahthere1112@gmail.com"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    abdullahthere1112@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Phone Numbers</h4>
                  <div className="space-y-1">
                    <a 
                      href="tel:+923350953159" 
                      className="text-gray-400 hover:text-blue-400 transition-colors block"
                    >
                      +92 335 0953159
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Address</h4>
                  <p className="text-gray-400">
                    Village Chak Hafizan, P.O Chak Daulat<br />
                    Jhelum, Punjab, Pakistan
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Languages</h4>
              <div className="flex space-x-4">
                <span className="text-gray-300">🇬🇧 English</span>
                <span className="text-gray-300">🇵🇰 Urdu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default Contact;