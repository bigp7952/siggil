import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ 
          opacity: 0,
          rotateX: -15,
          scale: 0.95,
          y: 20
        }}
        animate={{ 
          opacity: 1,
          rotateX: 0,
          scale: 1,
          y: 0
        }}
        exit={{ 
          opacity: 0,
          rotateX: 15,
          scale: 0.95,
          y: -20
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1
        }}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div
          initial={{ 
            opacity: 0,
            filter: 'blur(10px)',
            transform: 'translateZ(-100px)'
          }}
          animate={{ 
            opacity: 1,
            filter: 'blur(0px)',
            transform: 'translateZ(0px)'
          }}
          exit={{ 
            opacity: 0,
            filter: 'blur(10px)',
            transform: 'translateZ(-100px)'
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
