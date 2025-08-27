import React from 'react';
import { MenuItem } from '../../models';
import './MenuItemCard.css';

interface MenuItemCardProps {
  item: MenuItem;
  onSelectItem: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelectItem }) => {
  return (
    <div className="menu-item-card" onClick={() => onSelectItem(item)}>
      <div className="item-info">
        <h4 className="item-name">{item.name}</h4>
        <p className="item-price">{item.price.toLocaleString()} THB</p>
      </div>
    </div>
  );
};

export default MenuItemCard;
