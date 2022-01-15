import React from 'react';

type Theme = 'light' | 'dark';
const themes: Array<Theme> = ['light', 'dark'];

type ThemeContextType = {
  theme: Theme | null;
  setTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);
ThemeContext.displayName = 'ThemeContext';

const prefersLightMQ = '(prefers-color-scheme: light)';
const getPreferredTheme = () =>
  window.matchMedia(prefersLightMQ).matches ? 'light' : 'dark';

const ThemeProvider: React.FunctionComponent<{
  specifiedTheme?: Theme | null;
}> = ({ children, specifiedTheme }) => {
  const [theme, setTheme] = React.useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) {
        return specifiedTheme;
      }
      return null;
    }

    // there's no way for us to know what the theme should be in this context
    // the client will have to figure it out before hydration.
    if (typeof window !== 'object') return null;

    return getPreferredTheme();
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useTheme };
