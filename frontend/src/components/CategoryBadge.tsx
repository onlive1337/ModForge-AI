import React from 'react';

const categoryColors = {
  Magic: 'bg-purple-100 text-purple-800',
  Technology: 'bg-blue-100 text-blue-800',
  Adventure: 'bg-green-100 text-green-800',
  Utility: 'bg-gray-100 text-gray-800',
  General: 'bg-yellow-100 text-yellow-800',
};

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const colorClass = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  );
};