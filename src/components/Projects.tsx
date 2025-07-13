import React from 'react';
import { Award, Users, TrendingUp, Shield } from 'lucide-react';

const Projects = () => {
  const achievements = [
    {
      title: "Customer Service Excellence",
      description: "Consistently maintained high customer satisfaction ratings through dedicated service and problem-solving approach.",
      icon: <Users className="w-12 h-12" />,
      highlights: ["Customer Satisfaction", "Problem Resolution", "Service Quality"],
      category: "Customer Service"
    },
    {
      title: "Infrastructure Monitoring",
      description: "Successfully monitored ODN deployment sites ensuring smooth operations and infrastructure protection.",
      icon: <Shield className="w-12 h-12" />,
      highlights: ["Site Monitoring", "Asset Management", "Quality Assurance"],
      category: "Operations"
    },
    {
      title: "Sales Performance",
      description: "Achieved consistent sales targets through effective customer engagement and product presentation.",
      icon: <TrendingUp className="w-12 h-12" />,
      highlights: ["Sales Achievement", "Customer Engagement", "Product Display"],
      category: "Sales"
    },
    {
      title: "MS Office Certification",
      description: "Obtained official certification from Government of Punjab, demonstrating proficiency in office applications.",
      icon: <Award className="w-12 h-12" />,
      highlights: ["Certified Professional", "Technical Skills", "Government Recognition"],
      category: "Certification"
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Key Achievements
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional accomplishments and notable contributions throughout my career
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-gray-900/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-blue-400 mr-4 group-hover:scale-110 transition-transform duration-300">
                    {achievement.icon}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                      {achievement.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{achievement.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{achievement.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {achievement.highlights.map((highlight, highlightIndex) => (
                    <span
                      key={highlightIndex}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Professional Summary</h3>
            <p className="text-gray-300 leading-relaxed">
              With experience spanning customer service, operations monitoring, and sales, I bring a 
              comprehensive skill set focused on delivering excellence. My commitment to quality, 
              attention to detail, and customer-first approach have consistently driven positive 
              outcomes in every role I've undertaken.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;