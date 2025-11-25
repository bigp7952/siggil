import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: {
    name: string;
    image: string;
    count: string;
    path: string;
    description: string;
  };
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={category.path}>
        <div className="relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 hover:border-red-500/50 transition-colors">
          {/* Image de la catégorie */}
          <div className="aspect-square relative overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Contenu de la carte */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="text-center">
                <h3 className="text-white font-bold text-lg md:text-xl mb-2">{category.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{category.description}</p>
                <p className="text-red-400 text-xs font-medium">{category.count}</p>
              </div>
            </div>
            
            {/* Badge de catégorie */}
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {category.name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
