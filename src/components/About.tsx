import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Clock, Target, Award, GraduationCap } from 'lucide-react';

const About = () => {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, skillsRes, educationRes, certificatesRes] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).single(),
        supabase.from('skills').select('*').order('category', { ascending: true }),
        supabase.from('education').select('*').order('completion_date', { ascending: false }),
        supabase.from('certificates').select('*').order('date_issued', { ascending: false })
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (educationRes.data) setEducation(educationRes.data);
      if (certificatesRes.data) setCertificates(certificatesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback data if database is not accessible
      const fallbackSkills = [
        { name: 'Infrastructure Monitoring', category: 'Vigilance & Monitoring' },
        { name: 'Customer Service', category: 'Professional Skills' },
        { name: 'MS Office', category: 'Technical & Administrative' },
        { name: 'Time Management', category: 'Professional Skills' },
        { name: 'Problem Solving', category: 'Professional Skills' }
      ];
      setSkills(fallbackSkills);
      
      const fallbackEducation = [
        { degree: 'Intermediate (FSC)', institution: 'F.G Inter College Jhelum Cantt', score: '716/1100', completion_date: 'July 2020' },
        { degree: 'Matriculation (Science)', institution: 'F.G Public School No.1 Boys Jhelum Cantt', score: '844/1100', completion_date: 'Nov 2018' }
      ];
      setEducation(fallbackEducation);
      
      const fallbackCertificates = [
        { name: 'MS Office Certification', issuer: 'Government of the Punjab - Trade Testing Board Lahore', date_issued: '2021' }
      ];
      setCertificates(fallbackCertificates);
    }
  };

  const highlights = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Vigilance Operations",
      description: "Expert in monitoring and safeguarding infrastructure operations"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Management",
      description: "Efficient multitasking and deadline management skills"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Field Operations",
      description: "Experience in monitoring, reporting, and quality assurance"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Technical Skills",
      description: "MS Office certified with strong data entry capabilities"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional with strong customer service background and technical expertise
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <h3 className="text-2xl font-bold mb-6 text-white">My Professional Journey</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {profile?.bio || "I am a hardworking professional with extensive experience in customer service, multitasking, and time management. My career has been focused on delivering exceptional customer experiences while maintaining high standards of quality and efficiency."}
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              With experience in both technical monitoring roles and customer-facing positions, 
              I bring a unique combination of technical skills and interpersonal abilities. 
              I am committed to continuous learning and professional development.
            </p>
            
            

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Core Competencies</h4>
              <div className="flex flex-wrap gap-3">
                {skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full text-sm text-green-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-right">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-blue-400 mb-4">{item.icon}</div>
                <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications Section */}
        <div className="mt-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education Section */}
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold mb-8 text-white flex items-center">
                <GraduationCap className="w-8 h-8 mr-3 text-blue-400" />
                Education Background
              </h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-white">{edu.degree}</h4>
                      <span className="text-blue-400 font-semibold text-sm bg-blue-500/10 px-3 py-1 rounded-full">
                        {edu.completion_date}
                      </span>
                    </div>
                    <p className="text-blue-400 font-medium mb-2">{edu.institution}</p>
                    <div className="flex items-center">
                      <span className="text-gray-300 text-sm">Score: </span>
                      <span className="text-green-400 font-semibold ml-1">{edu.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="animate-fade-in-up animation-delay-200">
              <h3 className="text-2xl font-bold mb-8 text-white flex items-center">
                <Award className="w-8 h-8 mr-3 text-purple-400" />
                Professional Certifications
              </h3>
              <div className="space-y-6">
                {certificates.map((cert, index) => (
                  <div key={index} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-white">{cert.name}</h4>
                      <span className="text-purple-400 font-semibold text-sm bg-purple-500/10 px-3 py-1 rounded-full">
                        {cert.date_issued}
                      </span>
                    </div>
                    <p className="text-purple-400 font-medium">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;