import React from 'react';
import { MenuCategory } from '../../models';
import './MenuCategoryTabs.css';

interface MenuCategoryTabsProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const MenuCategoryTabs: React.FC<MenuCategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="menu-category-tabs">
      {categories.map(category => (
        <button
          key={category.id}
          className={`tab-button ${category.id === activeCategoryId ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default MenuCategoryTabs;
