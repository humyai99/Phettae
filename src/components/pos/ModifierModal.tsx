import React, { useState, useEffect } from 'react';
import { MenuItem, ModifierGroup, ModifierOption, OrderLineItem, SelectedModifier } from '../../models';
import './ModifierModal.css';

interface ModifierModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: OrderLineItem) => void;
}

const ModifierModal: React.FC<ModifierModalProps> = ({ item, onClose, onAddToCart }) => {
  const [selectedModifiers, setSelectedModifiers] = useState<Map<string, SelectedModifier[]>>(new Map());
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Pre-select the first option for required, single-choice groups
    const initialSelections = new Map<string, SelectedModifier[]>();
    item.modifier_groups?.forEach(group => {
      if (group.required && !group.allow_multiple && group.options.length > 0) {
        const defaultOption = group.options[0];
        initialSelections.set(group.id, [{
          group_id: group.id,
          group_name: group.name,
          option_id: defaultOption.id,
          option_name: defaultOption.name,
          price_change: defaultOption.price_change,
        }]);
      }
    });
    setSelectedModifiers(initialSelections);
  }, [item]);

  useEffect(() => {
    let currentPrice = item.price;
    selectedModifiers.forEach(mods => {
      mods.forEach(mod => {
        currentPrice += mod.price_change;
      });
    });
    setTotalPrice(currentPrice * quantity);

    // Validation check
    const requiredGroups = item.modifier_groups?.filter(g => g.required) || [];
    const allRequiredSelected = requiredGroups.every(group => {
      const selections = selectedModifiers.get(group.id);
      return selections && selections.length > 0;
    });
    setIsFormValid(allRequiredSelected);

  }, [selectedModifiers, quantity, item]);

  const handleSelection = (group: ModifierGroup, option: ModifierOption) => {
    const newSelections = new Map(selectedModifiers);
    const currentGroupSelections = newSelections.get(group.id) || [];

    if (group.allow_multiple) {
      const existingIndex = currentGroupSelections.findIndex(o => o.option_id === option.id);
      if (existingIndex > -1) {
        currentGroupSelections.splice(existingIndex, 1);
      } else {
        currentGroupSelections.push({ group_id: group.id, group_name: group.name, option_id: option.id, option_name: option.name, price_change: option.price_change });
      }
      newSelections.set(group.id, currentGroupSelections);
    } else {
      newSelections.set(group.id, [{ group_id: group.id, group_name: group.name, option_id: option.id, option_name: option.name, price_change: option.price_change }]);
    }
    setSelectedModifiers(newSelections);
  };

  const handleAddToCartClick = () => {
    const finalModifiers: SelectedModifier[] = [];
    selectedModifiers.forEach(mods => finalModifiers.push(...mods));

    const lineItem: OrderLineItem = {
      id: `${item.id}-${Date.now()}`, // Simple unique ID
      menu_item_id: item.id,
      menu_item_name: item.name,
      quantity,
      base_price: item.price,
      selected_modifiers: finalModifiers,
      line_item_total: totalPrice,
      station: item.station,
      status: 'new',
    };
    onAddToCart(lineItem);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item.name}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {item.modifier_groups?.map(group => (
            <div key={group.id} className="modifier-group">
              <h4>{group.name} {group.required && <span className="required">*</span>}</h4>
              <div className="options-container">
                {group.options.map(option => {
                  const isSelected = selectedModifiers.get(group.id)?.some(o => o.option_id === option.id) || false;
                  return (
                    <label key={option.id} className={`option-label ${isSelected ? 'selected' : ''}`}>
                      <input
                        type={group.allow_multiple ? 'checkbox' : 'radio'}
                        name={group.id}
                        checked={isSelected}
                        onChange={() => handleSelection(group, option)}
                      />
                      <span className="option-name">{option.name}</span>
                      <span className="option-price">(+{option.price_change} THB)</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <div className="quantity-selector">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCartClick}
            disabled={!isFormValid}
          >
            Add to Order - {totalPrice.toLocaleString()} THB
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifierModal;
