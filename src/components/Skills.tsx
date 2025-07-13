import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Award } from 'lucide-react';

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data: skills, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      // Group skills by category
      const grouped = skills?.reduce((acc: any, skill: any) => {
        const category = skill.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      }, {});

      // Convert to array format
      const categories = Object.keys(grouped || {}).map(category => ({
        title: category,
        skills: grouped[category]
      }));

      setSkillCategories(categories);
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Fallback data if database is not accessible
      const fallbackCategories = [
        {
          title: 'Vigilance & Monitoring',
          skills: [
            { name: 'Infrastructure Monitoring', level: 95 },
            { name: 'ODN Deployment Monitoring', level: 90 },
            { name: 'Asset Management', level: 92 },
            { name: 'Field Intelligence Gathering', level: 88 },
            { name: 'Damage Detection', level: 90 }
          ]
        },
        {
          title: 'Professional Skills',
          skills: [
            { name: 'Report Writing', level: 88 },
            { name: 'Attention to Detail', level: 95 },
            { name: 'Communication Skills', level: 90 },
            { name: 'Problem Solving & Decision Making', level: 92 },
            { name: 'Time Management', level: 90 }
          ]
        },
        {
          title: 'Technical & Administrative',
          skills: [
            { name: 'MS Office', level: 85 },
            { name: 'Data Entry', level: 90 },
            { name: 'Fast Typing', level: 85 },
            { name: 'Team Coordination', level: 88 },
            { name: 'Documentation', level: 85 }
          ]
        }
      ];
      setSkillCategories(fallbackCategories);
    }
  };

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional competencies developed through experience and training
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 200}ms` }}
            >
              <h3 className="text-xl font-bold mb-6 text-white">{category.title}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default Skills;