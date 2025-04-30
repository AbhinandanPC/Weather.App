import React from 'react';

const AccessibilityControls = ({ accessibility, setAccessibility }) => {
  const toggleHighContrast = () => {
    setAccessibility({
      ...accessibility,
      highContrast: !accessibility.highContrast
    });
  };

  const changeFontSize = (size) => {
    setAccessibility({
      ...accessibility,
      fontSize: size
    });
  };

  return (
    <div className="accessibility-controls">
      <button onClick={toggleHighContrast} aria-pressed={accessibility.highContrast}>
        {accessibility.highContrast ? 'Disable' : 'Enable'} High Contrast
      </button>
      <div className="font-size-controls">
        <span>Text Size:</span>
        <button onClick={() => changeFontSize('small')} aria-pressed={accessibility.fontSize === 'small'}>A</button>
        <button onClick={() => changeFontSize('medium')} aria-pressed={accessibility.fontSize === 'medium'}>A</button>
        <button onClick={() => changeFontSize('large')} aria-pressed={accessibility.fontSize === 'large'}>A</button>
      </div>
    </div>
  );
};

export default AccessibilityControls;