// src/components/ToggleBar.tsx
import React from 'react';
//import './ToggleBar.scss'; // Assuming you have a separate SCSS file for styles

interface ToggleBarProps {
  options: string[];
  activeOption: string;
  onToggle: (option: string) => void;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ options, activeOption, onToggle }) => {
  return (
    <div className="toggle-bar">
      {options.map(option => (
        <button
          key={option}
          className={`toggle-button ${activeOption === option ? 'active' : ''}`}
          onClick={() => onToggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleBar;