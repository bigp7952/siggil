import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  clickable?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "", 
  delay = 0, 
  hover = true,
  clickable = false 
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: -5
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: hover ? {
      y: -8,
      scale: 1.02,
      rotateX: 2,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    } : {},
    tap: clickable ? {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    } : {}
  };

  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        style={{
          transform: 'translateZ(0px)',
          backfaceVisibility: 'hidden'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCard;
