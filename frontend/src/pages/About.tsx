import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Trophy, 
  Flag, 
  Users, 
  Camera, 
  Zap, 
  Award, 
  Heart,
  ChevronRight,
  Calendar,
  MapPin,
  type LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
// Definisikan tipe untuk tab
type TabType = 'mission' | 'vision' | 'values';

// Definisikan interface untuk konten tab
interface TabContent {
  title: string;
  content: string;
  icon: LucideIcon;
}

const About = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mission');

  // Stats data
  const stats = [
    { value: '500+', label: 'Gallery Photos', icon: Camera, color: 'text-rally-red' },
    { value: '50+', label: 'Events Covered', icon: Flag, color: 'text-rally-amber' },
    { value: '10+', label: 'Years Experience', icon: Calendar, color: 'text-rally-red' },
    { value: '1000+', label: 'Community Members', icon: Users, color: 'text-rally-amber' },
  ];

  // Team members
  const teamMembers = [
    { 
      name: 'Alex Rossi', 
      role: 'Founder & Lead Photographer',
      experience: '15 years in motorsport photography',
      specialty: 'WRC & Rallycross',
      imageColor: 'from-rally-red to-red-600'
    },
    { 
      name: 'Mika Hakkinen', 
      role: 'Video & Content Director',
      experience: 'Former rally co-driver',
      specialty: 'Onboard footage & documentaries',
      imageColor: 'from-blue-500 to-cyan-600'
    },
    { 
      name: 'Sophie Laurent', 
      role: 'Community Manager',
      experience: 'Motorsport journalist',
      specialty: 'Event coverage & interviews',
      imageColor: 'from-purple-500 to-pink-600'
    },
    { 
      name: 'Carlos Sanchez', 
      role: 'Technical Director',
      experience: 'Photography tech specialist',
      specialty: 'Equipment & workflow optimization',
      imageColor: 'from-green-500 to-emerald-600'
    },
  ];

  // Features
  const features = [
    {
      icon: Camera,
      title: 'Professional Photography',
      description: 'High-resolution images captured by experienced motorsport photographers using top-tier equipment.',
      color: 'border-rally-red/30 hover:border-rally-red'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Live coverage from major rally events with regular uploads during competitions.',
      color: 'border-rally-amber/30 hover:border-rally-amber'
    },
    {
      icon: Trophy,
      title: 'Exclusive Content',
      description: 'Behind-the-scenes access, driver interviews, and rare moments from the rally world.',
      color: 'border-rally-red/30 hover:border-rally-red'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Platform built by enthusiasts, for enthusiasts. Share, discuss, and celebrate rally culture.',
      color: 'border-rally-amber/30 hover:border-rally-amber'
    },
  ];

  // Tabs content dengan tipe yang jelas
  const tabContent: Record<TabType, TabContent> = {
    mission: {
      title: "Our Mission",
      content: "To capture and share the raw energy, passion, and beauty of rally motorsport through stunning photography and engaging content. We believe every corner, jump, and finish line tells a story worth preserving.",
      icon: Flag
    },
    vision: {
      title: "Our Vision",
      content: "To become the definitive digital archive of rally history, connecting fans worldwide with the sports most exhilarating moments while supporting the growth of rally culture globally.",
      icon: Trophy
    },
    values: {
      title: "Our Values",
      content: "Passion for motorsport, commitment to quality, respect for the community, and innovation in content creation. We operate with the same dedication and precision as the teams we photograph.",
      icon: Heart
    }
  };

  // Dapatkan konten tab aktif
  const activeTabContent = tabContent[activeTab];
  const ActiveTabIcon = activeTabContent.icon; // Simpan ikon dalam variabel

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-rally-red rounded-full animate-pulse"></div>
               
                <div className="w-3 h-3 bg-rally-amber rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  WHERE PASSION
                </span>
                <span className="block">
                  <span className="text-rally-red">MEETS</span>
                  <span className="bg-gradient-to-r from-rally-amber to-yellow-400 bg-clip-text text-transparent"> PIXELS</span>
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                RallyGallery is the ultimate destination for rally motorsport enthusiasts, 
                showcasing breathtaking photography from events worldwide. We capture the 
                speed, skill, and spirit that define this incredible sport.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                   <Link
                  to="/" // Ganti dengan path halaman gallery Anda
                  className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-rally-red via-red-600 to-rally-red hover:from-red-600 hover:via-rally-red hover:to-red-600 text-white font-black rounded-lg shadow-lg shadow-rally-red/30 hover:shadow-rally-red/50 transform hover:scale-105 transition-all duration-300 text-sm uppercase tracking-wider"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Explore Gallery</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                
                <button className="group relative overflow-hidden px-8 py-3 bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700 hover:border-gray-600 text-white font-black rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-sm uppercase tracking-wider">
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Join Community</span>
                    <Users className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-rally-red/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-rally-amber/10 to-transparent rounded-full blur-3xl"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="relative group overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <stat.icon className={`w-10 h-10 mb-4 ${stat.color}`} />
                    <div className="text-3xl font-black mb-2">{stat.value}</div>
                    <div className="text-gray-400 font-bold text-sm uppercase tracking-wider">{stat.label}</div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rally-red to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission/Vision/Values Tabs */}
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {(Object.keys(tabContent) as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-rally-red to-red-600 text-white shadow-lg shadow-rally-red/30'
                        : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {tabContent[tab].title}
                  </button>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl p-8 lg:p-12 backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-rally-red/20 to-red-600/20 rounded-lg">
                    <ActiveTabIcon className="w-8 h-8 text-rally-red" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-4">{activeTabContent.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{activeTabContent.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  WHY
                </span>
                <span className="text-rally-red"> CHOOSE </span>
                <span className="bg-gradient-to-r from-rally-amber to-yellow-400 bg-clip-text text-transparent">
                  RALLYGALLERY?
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We combine technical expertise with genuine passion for rally motorsport
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`group bg-gradient-to-br from-gray-900/50 to-black/50 border ${feature.color} rounded-xl p-6 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-gray-800 to-black rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-rally-amber" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">
                <span className="text-rally-red">MEET THE</span>
                <span className="bg-gradient-to-r from-rally-amber to-yellow-400 bg-clip-text text-transparent"> CREW</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The passionate team behind the lenses and screens
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`relative w-24 h-24 mb-6 bg-gradient-to-br ${member.imageColor} rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <Users className="w-12 h-12 text-white" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rally-amber border-2 border-gray-900 rounded-full"></div>
                    </div>
                    
                    <h3 className="text-xl font-black mb-2">{member.name}</h3>
                    <div className="px-3 py-1 bg-gradient-to-r from-rally-red/20 to-red-600/20 rounded-full mb-3">
                      <span className="text-rally-red text-sm font-bold">{member.role}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center justify-center space-x-2">
                        <Award className="w-4 h-4 text-rally-amber" />
                        <span>{member.experience}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="w-4 h-4 text-rally-red" />
                        <span>Specialty: {member.specialty}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rally-amber to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl p-8 lg:p-12">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rally-red to-transparent"></div>
                
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-black mb-6">
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      READY TO EXPERIENCE
                    </span>
                    <span className="block">
                      <span className="text-rally-red">THE THRILL OF</span>
                      <span className="bg-gradient-to-r from-rally-amber to-yellow-400 bg-clip-text text-transparent"> RALLY?</span>
                    </span>
                  </h2>
                  
                  <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of rally enthusiasts and explore our growing collection of 
                    breathtaking motorsport photography. New content added weekly!
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <button className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-rally-red via-red-600 to-rally-red hover:from-red-600 hover:via-rally-red hover:to-red-600 text-white font-black rounded-lg shadow-lg shadow-rally-red/30 hover:shadow-rally-red/50 transform hover:scale-105 transition-all duration-300 text-sm uppercase tracking-wider">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span>Browse Gallery</span>
                        <Camera className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                      </span>
                    </button>
                    
                    <button className="group relative overflow-hidden px-8 py-3 bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700 hover:border-gray-600 text-white font-black rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-sm uppercase tracking-wider">
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span>Contact Us</span>
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rally-amber to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      
        
    </div>
  );
};

export default About;