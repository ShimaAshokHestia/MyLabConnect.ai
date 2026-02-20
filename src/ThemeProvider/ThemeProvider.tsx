import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Theme types
export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * ThemeProvider Component
 *
 * Single source of truth for theme management.
 * Sets BOTH data-theme (custom CSS vars) AND data-bs-theme (Bootstrap)
 * on document.documentElement so all components stay in sync.
 *
 * Priority order:
 *  1. Previously saved user preference (localStorage)
 *  2. OS / browser system preference (prefers-color-scheme)
 *  3. Fallback: 'light'
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'app-theme',
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // 1. Honour an explicit user choice saved previously
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      // 2. Fall back to the OS/browser system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    // 3. SSR / no-window fallback
    return defaultTheme;
  });

  // Apply DOM attributes only — no localStorage write here
  const applyThemeToDom = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.setAttribute('data-bs-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      root.setAttribute('data-bs-theme', 'light');
    }
  };

  // Sync DOM whenever theme state changes
  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  // Listen for OS-level theme changes — only fires when no saved user preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const hasUserPref = localStorage.getItem(storageKey);
      if (!hasUserPref) {
        // Follow system — no localStorage write, just update state -> DOM
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [storageKey]);

  // Manual toggle — saves user preference to localStorage
  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(storageKey, next); // only written on explicit user action
      return next;
    });
  };

  // Explicit set — also saves to localStorage
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook — access theme context from any component
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * ThemeToggle Component — reusable toggle button
 */
interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // Moon icon
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor" />
        </svg>
      ) : (
        // Sun icon
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
};

// CSS for ThemeToggle button
export const themeToggleStyles = `
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  border: 1px solid var(--theme-border);
  background-color: var(--theme-bg-paper);
  color: var(--theme-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  background-color: var(--theme-bg-hover);
  border-color: var(--theme-primary);
}
.theme-toggle:active {
  transform: scale(0.95);
}
.theme-toggle svg {
  transition: transform 0.3s ease;
}
.theme-toggle:hover svg {
  transform: rotate(20deg);
}
`;