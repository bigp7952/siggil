import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: 'word' | 'letter' | 'line';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  stagger = 0.05,
  type = 'word'
}) => {
  const text = children?.toString() || '';
  
  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const lineVariants = {
    hidden: {
      opacity: 0,
      x: -50
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  if (type === 'letter') {
    return (
      <motion.span
        className={className}
        initial="hidden"
        animate="visible"
        transition={{
          delayChildren: delay,
          staggerChildren: stagger
        }}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {text.split('').map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            style={{ display: 'inline-block' }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (type === 'word') {
    return (
      <motion.span
        className={className}
        initial="hidden"
        animate="visible"
        transition={{
          delayChildren: delay,
          staggerChildren: stagger
        }}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {text.split(' ').map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (type === 'line') {
    return (
      <motion.div
        className={className}
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay,
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedText;

