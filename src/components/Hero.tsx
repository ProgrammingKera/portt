import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Github, Linkedin, Mail, MapPin, Phone, Download } from 'lucide-react';

const Hero = () => {
  const [profile, setProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>('/images/as.png');
  const [cvUrl, setCvUrl] = useState<string>('/Abdullah CV (1).pdf');

  useEffect(() => {
    fetchProfile();
    fetchFiles();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle(); 

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (files) {
        // Find latest profile picture
        const profilePic = files.find(file => file.file_type === 'profile_pic');
        if (profilePic) {
          setProfileImage(profilePic.file_url);
        }

        // Find latest CV
        const cv = files.find(file => file.file_type === 'cv');
        if (cv) {
          setCvUrl(cv.file_url);
        }
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };
  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = profile?.name ? `${profile.name.replace(/\s+/g, '_')}_CV.pdf` : 'Abdullah_Hassan_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {profile?.name || "Abdullah Hassan"}
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-gray-300 mb-6 animate-fade-in-up animation-delay-200">
                {profile?.title || "Vigilance Officer"}
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed animate-fade-in-up animation-delay-400">
                {profile?.bio || "Hardworking professional with expertise in customer service, multitasking, and time management. Devoted to giving every customer a positive and memorable experience with strong technical skills."}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up animation-delay-600">
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin size={16} />
                  <span>{profile?.location || "Jhelum, Punjab, Pakistan"}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone size={16} />
                  <span>{profile?.phone || "+92 335 0953159"}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail size={16} />
                  <span>{profile?.email || "abdullahthere1112@gmail.com"}</span>
                </div>
              </div>

              <div className="flex space-x-4 animate-fade-in-up animation-delay-800">
                <button
                  onClick={downloadCV}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                >
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Download CV</span>
                </button>
                <a
                  href="#contact"
                  className="border border-gray-600 hover:border-gray-400 px-4 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-300 hover:bg-gray-800 text-sm sm:text-base"
                >
                  Get In Touch
                </a>
              </div>

              <div className="flex space-x-6 mt-8 animate-fade-in-up animation-delay-1000">
                <a
                  href={`mailto:${profile?.email || "abdullahthere1112@gmail.com"}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                >
                  <Mail size={24} />
                </a>
                <a
                  href={`tel:${profile?.phone?.replace(/\s/g, '') || "+923350953159"}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                >
                  <Phone size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="relative animate-fade-in-right">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 animate-pulse-slow">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <img
                    src={profileImage}
                    alt="Abdullah Hassan"
                    className="w-72 h-72 lg:w-88 lg:h-88 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/as.png';
                    }}
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce-slow opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce-slow opacity-20 animation-delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
