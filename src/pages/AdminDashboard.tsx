import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Profile, Skill, Experience, Education, Certificate, FileRecord } from '../lib/supabase';
import { LogOut, User, Award, Briefcase, Plus, Edit, Trash2, Save, X, GraduationCap, Upload, FileText, Image } from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ category: '', name: '', level: 0 });
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    description: ['']
  });
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    score: '',
    completion_date: '',
    id: ''
  });
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    issuer: '',
    date_issued: '',
    id: ''
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const navigate = useNavigate();

  // Get unique categories from existing skills
  const existingCategories = [...new Set(skills.map(skill => skill.category))].filter(cat => cat.trim());

  // Filter categories based on input
  const filteredCategories = existingCategories.filter(category =>
    category.toLowerCase().includes(categoryInput.toLowerCase())
  );
  useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/adminlogin');
      return;
    }
    setUser(user);
  };

  const fetchData = async () => {
    try {
      const [profileRes, skillsRes, experiencesRes, educationRes, certificatesRes, filesRes] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).single(),
        supabase.from('skills').select('*').order('category', { ascending: true }),
        supabase.from('experiences').select('*').order('start_date', { ascending: false }),
        supabase.from('education').select('*').order('completion_date', { ascending: false }),
        supabase.from('certificates').select('*').order('date_issued', { ascending: false }),
        supabase.from('files').select('*').order('created_at', { ascending: false })
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (experiencesRes.data) setExperiences(experiencesRes.data);
      if (educationRes.data) setEducation(educationRes.data);
      if (certificatesRes.data) setCertificates(certificatesRes.data);
      if (filesRes.data) setFiles(filesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any cached data
      setUser(null);
      setProfile(null);
      setSkills([]);
      setExperiences([]);
      
      // Navigate to login page
      navigate('/adminlogin');
    } catch (error) {
      console.error('Error logging out:', error);
      // Force navigation even if logout fails
      navigate('/adminlogin');
    }
  };

  const updateProfile = async () => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', profile.id);
      
      if (error) throw error;
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const addSkill = async () => {
    const skillToAdd = { ...newSkill, category: categoryInput || newSkill.category };
    if (!skillToAdd.name || !skillToAdd.category) return;
    
    try {
      const { error } = await supabase
        .from('skills')
        .insert([skillToAdd]);
      
      if (error) throw error;
      setNewSkill({ category: '', name: '', level: 0 });
      setCategoryInput('');
      setShowCategorySuggestions(false);
      fetchData();
      alert('Skill added successfully!');
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Error adding skill');
    }
  };

  const updateSkill = async (skill: Skill) => {
    try {
      const { error } = await supabase
        .from('skills')
        .update(skill)
        .eq('id', skill.id);
      
      if (error) throw error;
      setEditingSkill(null);
      fetchData();
      alert('Skill updated successfully!');
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Error updating skill');
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
      alert('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill');
    }
  };

  const addExperience = async () => {
    if (!newExperience.title || !newExperience.company) return;
    
    try {
      const { error } = await supabase
        .from('experiences')
        .insert([{ ...newExperience, description: newExperience.description.filter(d => d.trim()) }]);
      
      if (error) throw error;
      setNewExperience({
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ['']
      });
      fetchData();
      alert('Experience added successfully!');
    } catch (error) {
      console.error('Error adding experience:', error);
      alert('Error adding experience');
    }
  };

  const updateExperience = async (experience: Experience) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .update({ ...experience, description: experience.description.filter(d => d.trim()) })
        .eq('id', experience.id);
      
      if (error) throw error;
      setEditingExperience(null);
      fetchData();
      alert('Experience updated successfully!');
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Error updating experience');
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
      alert('Experience deleted successfully!');
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Error deleting experience');
    }
  };

  const addEducation = async () => {
    if (!newEducation.degree || !newEducation.institution) return;
    
    try {
      const { error } = await supabase
        .from('education')
        .insert([newEducation]);
      
      if (error) throw error;
      setNewEducation({ degree: '', institution: '', score: '', completion_date: '', id: '' });
      fetchData();
      alert('Education added successfully!');
    } catch (error) {
      console.error('Error adding education:', error);
      alert('Error adding education');
    }
  };

  const updateEducation = async (edu: Education) => {
    try {
      const { error } = await supabase
        .from('education')
        .update(edu)
        .eq('id', edu.id);
      
      if (error) throw error;
      setEditingEducation(null);
      fetchData();
      alert('Education updated successfully!');
    } catch (error) {
      console.error('Error updating education:', error);
      alert('Error updating education');
    }
  };

  const deleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;
    
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
      alert('Education deleted successfully!');
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Error deleting education');
    }
  };

  const addCertificate = async () => {
    if (!newCertificate.name || !newCertificate.issuer) return;
    
    try {
      const { error } = await supabase
        .from('certificates')
        .insert([newCertificate]);
      
      if (error) throw error;
      setNewCertificate({ name: '', issuer: '', date_issued: '', id: '' });
      fetchData();
      alert('Certificate added successfully!');
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert('Error adding certificate');
    }
  };

  const updateCertificate = async (cert: Certificate) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .update(cert)
        .eq('id', cert.id);
      
      if (error) throw error;
      setEditingCertificate(null);
      fetchData();
      alert('Certificate updated successfully!');
    } catch (error) {
      console.error('Error updating certificate:', error);
      alert('Error updating certificate');
    }
  };

  const deleteCertificate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
      alert('Certificate deleted successfully!');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Error deleting certificate');
    }
  };

  const handleFileUpload = async (file: File, fileType: string) => {
    setUploadError('');
    try {
      // For now, we'll simulate file upload since Supabase Storage bucket doesn't exist
      // In a real implementation, you would need to create the 'portfolio-files' bucket in Supabase Storage
      
      setUploadError('File upload feature requires Supabase Storage bucket setup. Please contact administrator to configure storage.');
      
      // Alternative: You could implement a different file handling strategy here
      // such as converting to base64 and storing in database, or using a different storage service
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file: ' + error.message);
    }
  };

  const deleteFile = async (id: string, fileType: string) => {
    if (!confirm(`Are you sure you want to delete this ${fileType}?`)) return;
    
    try {
      const { error } = await supabase
        .from('files')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
      alert(`${fileType === 'cv' ? 'CV' : 'Profile picture'} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4">
  <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
      Admin Dashboard
    </h1>
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
      <span className="text-gray-300 truncate max-w-[150px] sm:max-w-none">{user?.email}</span>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 w-full sm:w-auto"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  </div>
</header>

        <div className="container mx-auto px-6 py-8">
          <div className="flex space-x-4 mb-8 overflow-x-auto">
  {[
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'files', label: 'Files', icon: Upload }
  ].map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
        activeTab === tab.id
          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
          : 'bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <tab.icon size={16} />
      <span>{tab.label}</span>
    </button>
  ))}
</div>

        <div className="space-y-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              <button
                onClick={() => editingProfile ? updateProfile() : setEditingProfile(true)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {editingProfile ? <Save size={16} /> : <Edit size={16} />}
                <span>{editingProfile ? 'Save' : 'Edit'}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!editingProfile}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!editingProfile}
                  rows={4}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Add New Skill */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Add New Skill</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Category"
                    value={categoryInput}
                    onChange={(e) => {
                      setCategoryInput(e.target.value);
                      setShowCategorySuggestions(true);
                    }}
                    onFocus={() => setShowCategorySuggestions(true)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                  {showCategorySuggestions && filteredCategories.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCategoryInput(category);
                            setShowCategorySuggestions(false);
                          }}
                          className="w-full text-left p-2 hover:bg-gray-700 text-white"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="number"
                  placeholder="Level (0-100)"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <button
                  onClick={addSkill}
                  className="bg-green-500 hover:bg-green-600 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Skills List */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Existing Skills</h3>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-gray-800 p-4 rounded-lg">
                    {editingSkill === skill.id ? (
                      <div className="grid md:grid-cols-5 gap-4 items-center">
                        <input
                          type="text"
                          value={skill.category}
                          onChange={(e) => setSkills(skills.map(s => s.id === skill.id ? { ...s, category: e.target.value } : s))}
                          className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => setSkills(skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s))}
                          className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => setSkills(skills.map(s => s.id === skill.id ? { ...s, level: parseInt(e.target.value) } : s))}
                          className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <button
                          onClick={() => updateSkill(skill)}
                          className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded transition-colors"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingSkill(null)}
                          className="bg-gray-500 hover:bg-gray-600 px-3 py-2 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-blue-400 text-sm">{skill.category}</span>
                          <h4 className="font-semibold">{skill.name}</h4>
                          <div className="w-32 bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingSkill(skill.id)}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteSkill(skill.id)}
                            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {/* Add New Experience */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Add New Experience</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newExperience.location}
                  onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={newExperience.start_date}
                    onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={newExperience.end_date}
                    onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-gray-300">Job Description</label>
{newExperience.description.map((desc, index) => (
  <div key={index} className="flex space-x-2">
    <input
      type="text"
      placeholder={`Description point ${index + 1}`}
      value={desc}
      onChange={(e) => {
        const newDesc = [...newExperience.description];
        newDesc[index] = e.target.value;
        setNewExperience({ ...newExperience, description: newDesc });
      }}
      className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
    />
    {index === newExperience.description.length - 1 && (
      <button
        onClick={() => setNewExperience({
          ...newExperience,
          description: [...newExperience.description, '']
        })}
        className="bg-blue-500 hover:bg-blue-600 px-3 py-3 rounded-lg transition-colors flex-shrink-0"
        style={{ minWidth: '40px', minHeight: '40px' }}
      >
        <Plus size={16} />
      </button>
    )}
  </div>
))}
              </div>
              <button
                onClick={addExperience}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Experience</span>
              </button>
            </div>

            {/* Experience List */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Existing Experience</h3>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-gray-800 p-4 rounded-lg">
                    {editingExperience === exp.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? { ...e, title: e.target.value } : e))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? { ...e, company: e.target.value } : e))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? { ...e, location: e.target.value } : e))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={exp.start_date}
                              onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? { ...e, start_date: e.target.value } : e))}
                              className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <input
                              type="text"
                              value={exp.end_date}
                              onChange={(e) => setExperiences(experiences.map(e => e.id === exp.id ? { ...e, end_date: e.target.value } : e))}
                              className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          {exp.description.map((desc, index) => (
                            <input
                              key={index}
                              type="text"
                              value={desc}
                              onChange={(e) => {
                                const newDesc = [...exp.description];
                                newDesc[index] = e.target.value;
                                setExperiences(experiences.map(e => e.id === exp.id ? { ...e, description: newDesc } : e));
                              }}
                              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateExperience(exp)}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors flex items-center space-x-2"
                          >
                            <Save size={16} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingExperience(null)}
                            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded transition-colors flex items-center space-x-2"
                          >
                            <X size={16} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{exp.title}</h4>
                            <p className="text-blue-400">{exp.company}</p>
                            <p className="text-gray-400 text-sm">{exp.location} • {exp.start_date} - {exp.end_date}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingExperience(exp.id)}
                              className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteExperience(exp.id)}
                              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <ul className="text-gray-300 space-y-1">
                          {exp.description.map((desc, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-400 mr-2 mt-2">•</span>
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            {/* Add New Education */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Add New Education</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Degree/Qualification"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Score/Grade"
                  value={newEducation.score}
                  onChange={(e) => setNewEducation({ ...newEducation, score: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Completion Date"
                  value={newEducation.completion_date}
                  onChange={(e) => setNewEducation({ ...newEducation, completion_date: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <button
                onClick={addEducation}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Education</span>
              </button>
            </div>

            {/* Education List */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Education Records</h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-800 p-4 rounded-lg">
                    {editingEducation === edu.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => setEducation(education.map(e => e.id === edu.id ? { ...e, degree: e.target.value } : e))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => setEducation(education.map(e => e.id === edu.id ? { ...e, institution: e.target.value } : e))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            value={edu.score}
                            onChange={(e) => setEducation(education.map(e => e.id === edu.id ? { ...e, score: e.target.value } : e))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            value={edu.completion_date}
                            onChange={(e) => setEducation(education.map(e => e.id === edu.id ? { ...e, completion_date: e.target.value } : e))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateEducation(edu)}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors flex items-center space-x-2"
                          >
                            <Save size={16} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingEducation(null)}
                            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded transition-colors flex items-center space-x-2"
                          >
                            <X size={16} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-white">{edu.degree}</h4>
                          <p className="text-blue-400">{edu.institution}</p>
                          <p className="text-gray-400 text-sm">Score: {edu.score} • {edu.completion_date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingEducation(edu.id)}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteEducation(edu.id)}
                            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates Section */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Add New Certificate</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Certificate Name"
                  value={newCertificate.name}
                  onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={newCertificate.issuer}
                  onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Date Issued"
                  value={newCertificate.date_issued}
                  onChange={(e) => setNewCertificate({ ...newCertificate, date_issued: e.target.value })}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <button
                onClick={addCertificate}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Certificate</span>
              </button>
            </div>

            {/* Certificates List */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Certificates</h3>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gray-800 p-4 rounded-lg">
                    {editingCertificate === cert.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <input
                            type="text"
                            value={cert.date_issued}
                            onChange={(e) => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, date_issued: e.target.value } : c))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateCertificate(cert)}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors flex items-center space-x-2"
                          >
                            <Save size={16} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingCertificate(null)}
                            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded transition-colors flex items-center space-x-2"
                          >
                            <X size={16} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-white">{cert.name}</h4>
                          <p className="text-blue-400">{cert.issuer}</p>
                          <p className="text-gray-400 text-sm">{cert.date_issued}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCertificate(cert.id)}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteCertificate(cert.id)}
                            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">File Management</h3>
            
            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{uploadError}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Note: To enable file uploads, create a 'portfolio-files' bucket in your Supabase Storage dashboard.
                </p>
              </div>
            )}

            {/* CV Upload */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                CV Management
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload New CV</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadError('File upload feature is currently disabled. Please use the existing CV download link in the portfolio.');
                    }
                  }}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Current CV Files:</h4>
                {files.filter(f => f.file_type === 'cv' && f.is_active).map((file) => (
                  <div key={file.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                    <div>
                      <span className="text-white">{file.file_name}</span>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 ml-2 text-sm">View</a>
                    </div>
                    <button
                      onClick={() => deleteFile(file.id, 'cv')}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Profile Picture */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Profile Picture Management
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload New Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadError('File upload feature is currently disabled. The current profile image is working fine.');
                    }
                  }}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Current Profile Pictures:</h4>
                {files.filter(f => f.file_type === 'profile_pic' && f.is_active).map((file) => (
                  <div key={file.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                    <div className="flex items-center">
                      <img src={file.file_url} alt="Profile" className="w-12 h-12 rounded-full object-cover mr-3" />
                      <span className="text-white">{file.file_name}</span>
                    </div>
                    <button
                      onClick={() => deleteFile(file.id, 'profile_pic')}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {uploadingFile && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400">Uploading file...</p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;