import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../common/Header.tsx';
import SearchBar from './SearchBar.tsx';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images PNG pour le slide
  const heroImages = [
    '/img png siggil/bacalava.png',
    '/img png siggil/dents.png',
    '/img png siggil/hautt.png',
    '/img png siggil/levres.png',
    '/img png siggil/siggil-rose.png',
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Slide automatique des images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change d'image toutes les 4 secondes

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="relative bg-white">
      <Header />

      {/* Hero Section - Clean & Minimal like Mushei */}
      <section className="relative overflow-hidden bg-white" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '48px' }}>
        {/* Image Slide Background - Full coverage */}
        <div className="absolute inset-0 w-full h-full z-0" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Images avec transition fade */}
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: index === currentImageIndex ? 1 : 0,
                zIndex: index === currentImageIndex ? 1 : 0,
              }}
            >
              <img
                src={image}
                alt={`SIGGIL Hero ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  width: '140%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'right top',
                  transform: 'translateX(20%) translateY(-10%)',
                }}
              />
            </div>
          ))}
          {/* Gradient Overlay - Semi-circle white rising from bottom */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ 
              background: 'radial-gradient(ellipse 150% 100% at 50% 100%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 20%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0.3) 80%, rgba(255,255,255,0.05) 95%, transparent 100%)'
            }}
          ></div>
        </div>

        <div className="container-custom relative z-20">
          <div className="grid items-center grid-cols-1 gap-8 lg:gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block mb-4"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-male-red">
                  Nouvelle Collection 2025
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span 
                  className="text-blacksoft"
                  style={{
                    WebkitTextStroke: '1.5px #ffffff',
                    paintOrder: 'stroke fill'
                  }}
                >
                  STREETWEAR
                </span>
                <br />
                <span 
                  className="gradient-text"
                  style={{
                    WebkitTextStroke: '1.5px #ffffff',
                    paintOrder: 'stroke fill'
                  }}
                >
                  URBAIN
                </span>
                <br />
                <span 
                  className="text-blacksoft"
                  style={{
                    WebkitTextStroke: '1.5px #ffffff',
                    paintOrder: 'stroke fill'
                  }}
                >
                  PREMIUM
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-base text-gray-text mb-6 max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                SIGGIL représente plus qu'une marque de vêtements. C'est un mouvement, 
                une culture, une identité urbaine qui s'exprime à travers le streetwear.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link to="/produits" className="btn-primary inline-flex items-center justify-center w-full sm:w-auto">
                  Découvrir la Collection
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/premium" className="btn-gradient inline-flex items-center justify-center w-full sm:w-auto">
                  Collection Premium
                </Link>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                className="max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <SearchBar />
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex items-center gap-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M10.8586 4.71248C11.2178 3.60691 12.7819 3.60691 13.1412 4.71248L14.4246 8.66264C14.5853 9.15706 15.046 9.49182 15.5659 9.49182H19.7193C20.8818 9.49182 21.3651 10.9794 20.4247 11.6626L17.0645 14.104C16.6439 14.4095 16.4679 14.9512 16.6286 15.4456L17.912 19.3958C18.2713 20.5013 17.0059 21.4207 16.0654 20.7374L12.7052 18.2961C12.2846 17.9905 11.7151 17.9905 11.2945 18.2961L7.93434 20.7374C6.99388 21.4207 5.72851 20.5013 6.08773 19.3958L7.37121 15.4456C7.53186 14.9512 7.35587 14.4095 6.93529 14.104L3.57508 11.6626C2.63463 10.9794 3.11796 9.49182 4.28043 9.49182H8.43387C8.95374 9.49182 9.41448 9.15706 9.57513 8.66264L10.8586 4.71248Z"
                          fill="url(#starGradient)"
                        />
                        <defs>
                          <linearGradient id="starGradient" x1="3.07813" y1="3.8833" x2="23.0483" y2="6.90161">
                            <stop offset="0%" stopColor="#ffba00" />
                            <stop offset="100%" stopColor="#ff6c00" />
                          </linearGradient>
                        </defs>
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-text">
                    <span className="text-blacksoft font-semibold">4.9/5</span> • 2k+ Avis
                  </p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div>
                  <p className="text-xl font-bold text-blacksoft mb-0.5">10k+</p>
                  <p className="text-xs text-gray-text">Clients satisfaits</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
