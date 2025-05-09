
import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', !isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-netflix-gray hover:bg-opacity-80 transition-colors"
    >
      <i className={`fas fa-${isDark ? 'sun' : 'moon'} text-white`}></i>
    </button>
  );
};

export default ThemeToggle;
