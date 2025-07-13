import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Award, Star, TrendingUp, Zap } from 'lucide-react';

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

  const getCategoryIcon = (title: string) => {
    if (title.toLowerCase().includes('vigilance') || title.toLowerCase().includes('monitoring')) {
      return <Award className="w-8 h-8" />;
    } else if (title.toLowerCase().includes('professional')) {
      return <Star className="w-8 h-8" />;
    } else if (title.toLowerCase().includes('technical')) {
      return <Zap className="w-8 h-8" />;
    }
    return <TrendingUp className="w-8 h-8" />;
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ];
    return gradients[index % gradients.length];
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-green-400 to-emerald-500';
    if (level >= 80) return 'from-blue-400 to-cyan-500';
    if (level >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-800/50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Professional competencies developed through experience and continuous learning
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 150}ms` }}
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-transparent transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                {/* Category Header */}
                <div className="flex items-center mb-8">
                  <div className={`w-14 h-14 bg-gradient-to-r ${getCategoryGradient(categoryIndex)} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {getCategoryIcon(category.title)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
                      {category.title}
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mt-2 group-hover:w-20 transition-all duration-300"></div>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div 
                      key={skillIndex}
                      className="group/skill"
                      style={{ animationDelay: `${(categoryIndex * 150) + (skillIndex * 100)}ms` }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                          {skill.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-bold bg-gradient-to-r ${getSkillColor(skill.level)} bg-clip-text text-transparent`}>
                            {skill.level}%
                          </span>
                          {skill.level >= 90 && (
                            <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="relative">
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover/skill:shadow-lg`}
                            style={{ 
                              width: `${skill.level}%`,
                              animationDelay: `${(categoryIndex * 200) + (skillIndex * 100)}ms`
                            }}
                          >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                        </div>
                        
                        {/* Glow Effect */}
                        <div 
                          className={`absolute top-0 h-3 bg-gradient-to-r ${getSkillColor(skill.level)} rounded-full opacity-0 group-hover/skill:opacity-30 blur-sm transition-all duration-300`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Stats */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Skills Count</span>
                    <span className="text-blue-400 font-semibold">{category.skills.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-400">Avg. Level</span>
                    <span className="text-purple-400 font-semibold">
                      {Math.round(category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-10 rounded-3xl border border-gray-700/50 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Continuous Learning & Growth
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto">
                I believe in continuous improvement and staying updated with the latest industry practices. 
                My commitment to excellence drives me to constantly enhance my skills and deliver outstanding results.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  { label: 'Years Experience', value: '3+' },
                  { label: 'Skills Mastered', value: '15+' },
                  
                  { label: 'Certifications', value: '5+' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
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

export default Skills;
