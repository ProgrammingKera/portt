import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Shield, ShoppingBag } from 'lucide-react';

const Experience = () => {
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      const formattedExperiences = data?.map((exp: any) => ({
        ...exp,
        period: `${exp.start_date} - ${exp.end_date}`,
        icon: exp.title.toLowerCase().includes('vigilance') ? <Shield className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />
      })) || [];

      setExperiences(formattedExperiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      // Fallback data if database is not accessible
      const fallbackExperiences = [
        {
          id: '1',
          title: 'Vigilance Officer',
          company: 'Storm Fiber Powered by Cybernet Pvt. Ltd.',
          location: 'Punjab, Pakistan',
          start_date: 'Nov 2022',
          end_date: 'Present',
          period: 'Nov 2022 - Present',
          icon: <Shield className="w-6 h-6" />,
          description: [
            'Monitored ODN deployment sites, ensuring smooth construction and safeguarding infrastructure',
            'Maintained records of installed assets and reported damages or irregularities promptly',
            'Gathered field intelligence on competitor activities and submitted detailed progress reports',
            'Ensured compliance with safety standards and operational procedures'
          ]
        },
        {
          id: '2',
          title: 'Salesman',
          company: 'Punjab Baker',
          location: 'Pakistan',
          start_date: 'Feb 2021',
          end_date: 'Nov 2021',
          period: 'Feb 2021 - Nov 2021',
          icon: <ShoppingBag className="w-6 h-6" />,
          description: [
            'Inspected baking equipment in accordance with cleanliness and safety standards',
            'Designed appealing product displays to maintain unique presentation',
            'Met with customers to discuss needed bakery items and take orders',
            'Maintained high customer satisfaction through excellent service delivery'
          ]
        }
      ];
      setExperiences(fallbackExperiences);
    }
  };

  return (
    <section id="experience" className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My career journey and key achievements in customer service and operations
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>

            {experiences.map((exp, index) => (
              <div
                key={index}
                className="relative flex items-start mb-12 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Timeline dot with icon */}
                <div className="absolute left-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <div className="text-white">
                    {exp.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="ml-24 bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 w-full">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                      <h4 className="text-blue-400 font-semibold">{exp.company}</h4>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0">
                      <div className="flex items-center text-gray-400 mb-1">
                        <Calendar size={16} className="mr-2" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <MapPin size={16} className="mr-2" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  <ul className="text-gray-300 space-y-2">
                    {exp.description.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-blue-400 mr-2 mt-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;