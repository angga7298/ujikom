import { useState, useEffect } from 'react';
import gktw2 from '../assets/gktw2.png';
import gktw3 from '../assets/gktw3.png'; // Import yang ini juga
import gktw1 from '../assets/gktw1.png';
// Data untuk slide
const slides = [
  {
    image: gktw3,
    title: 'LANCIA MARTINI RACING',
    subtitle: 'ITALIAN LEGEND',
    description: 'Warisan balap Italia dengan strip Martini iconic.',
    specs: ['4WD TURBO', '2.0L I4', '300+ HP'],
    color: 'from-blue-400 to-cyan-500',
    brandColor: 'bg-blue-500/20 border-blue-500/40',
    number: '037'
  },
  {
    image: gktw1,
    title: 'MITSUBISHI LANCER EVOLUTION',
    subtitle: 'JAPANESE ICON',
    description: 'Raja rally dengan AYC system dan 4WD canggih.',
    specs: ['ACTIVE YAW', '4G63 TURBO', '280+ HP'],
    color: 'from-red-500 to-orange-600',
    brandColor: 'bg-red-500/20 border-red-500/40',
    number: '500'
  },
  {
    image: gktw2,
    title: 'TOYOTA YARIS WRC',
    subtitle: 'MODERN DOMINATOR',
    description: 'Penerus legacy dengan hybrid technology.',
    specs: ['HYBRID 4WD', '1.6L TURBO', '380+ HP'],
    color: 'from-white to-gray-300',
    brandColor: 'bg-white/10 border-white/30',
    number: 'CCT'
  }
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const getImagePosition = () => {
    switch(currentSlide) {
      case 0: return 'justify-start';
      case 1: return 'justify-center';
      case 2: return 'justify-end';
      default: return 'justify-center';
    }
  };

  return (
    <section className="mt-8 relative w-full h-screen overflow-hidden bg-black">
      {/* Carbon Fiber Background - FIXED */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='carbon' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect width='20' height='20' fill='%23000'/%3E%3Cpath d='M0 0h20v20H0z' stroke='%23111' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23carbon)'/%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Animated racing lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse"></div>
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row h-full relative z-10">
        
        {/* LEFT: Gambar Mobil */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center p-4 lg:p-8">
          <div className={`relative w-full h-full flex items-center ${getImagePosition()}`}>
            <div className="relative group transform transition-all duration-1000">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-auto h-full max-h-64 lg:max-h-[85vh] object-contain transform transition-all duration-700 group-hover:scale-105"
                style={{ 
                  filter: `drop-shadow(0 0 60px rgba(220, 38, 38, 0.6)) 
                           drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))
                           brightness(1.2)`
                }}
              />
              
              <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} opacity-10 blur-3xl scale-125 -z-10 transition-all duration-1000`}></div>
              
              <div className="absolute -bottom-10 -right-10 lg:-bottom-20 lg:-right-20">
                <div className="text-9xl lg:text-[180px] font-black text-white/5 select-none">
                  {slides[currentSlide].number}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent opacity-30 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center p-4 lg:p-12">
          <div className="max-w-2xl w-full">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${slides[currentSlide].brandColor} border backdrop-blur-sm mb-6 lg:mb-8`}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span className="text-xs font-mono tracking-widest text-white/80">
                {slides[currentSlide].subtitle}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 leading-none">
              <div className={`bg-gradient-to-r ${slides[currentSlide].color} bg-clip-text text-transparent`}>
                {slides[currentSlide].title.split(' ')[0]}
              </div>
              <div className="text-white/90">
                {slides[currentSlide].title.split(' ').slice(1).join(' ')}
              </div>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 lg:mb-12 max-w-lg">
              {slides[currentSlide].description}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 lg:mb-12">
              {slides[currentSlide].specs.map((spec, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {spec}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {index === 0 ? 'DRIVETRAIN' : index === 1 ? 'ENGINE' : 'POWER'}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-black/50 border border-gray-800 rounded">
                <span className="text-xs text-gray-400">
                  {currentSlide === 0 ? '1980s LEGEND' : currentSlide === 1 ? '1990s ICON' : '2020s CHAMPION'}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="flex flex-col items-center group"
          >
            <div className={`h-1 transition-all duration-500 ${
              index === currentSlide 
                ? `w-12 bg-gradient-to-r ${slide.color}` 
                : 'w-4 bg-gray-800 group-hover:bg-gray-600'
            }`}></div>
            <span className={`text-xs mt-2 transition-all duration-300 ${
              index === currentSlide ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'
            }`}>
              {slide.title.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 p-3 lg:p-4 rounded-full bg-black/50 border border-gray-800 hover:border-red-600/50 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hidden lg:block"
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 p-3 lg:p-4 rounded-full bg-black/50 border border-gray-800 hover:border-red-600/50 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hidden lg:block"
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Current Slide Info */}
      <div className="absolute top-6 lg:top-8 left-6 lg:left-8">
        <div className="text-sm text-gray-500 font-mono">
          <span className="text-white">0{currentSlide + 1}</span>
          <span className="mx-1">/</span>
          <span>0{slides.length}</span>
        </div>
      </div>

      {/* RPM Gauge */}
      <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className={`w-1 h-4 transition-all duration-300 ${
                  i <= (currentSlide + 1) * 2 
                    ? `bg-gradient-to-t ${slides[currentSlide].color}` 
                    : 'bg-gray-800'
                }`}
              ></div>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-mono">RPM</span>
        </div>
      </div>

      {/* Corner Text */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-8 text-right">
        <div className="text-[10px] text-gray-600 uppercase tracking-widest">
          Rally Motorsport
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {currentSlide === 0 ? 'Stratos HF' : currentSlide === 1 ? 'Evo VIII' : 'GR Yaris'}
        </div>
      </div>
    </section>
  );
};

export default Slider;