'use client';

import { useEffect, useState } from 'react';
import { updateTheme } from '@/app/dashboard/settings/action';

interface ThemeSelectorProps {
  currentTheme?: string;
  userId: string;
}

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'cupcake', label: 'Cupcake' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'retro', label: 'Retro' },
  { value: 'garden', label: 'Garden' },
];

export default function ThemeSelector({ currentTheme = 'light', userId }: ThemeSelectorProps) {
  const [theme, setTheme] = useState(currentTheme);
  const [saving, setSaving] = useState(false);

  // Apply theme on mount and when it changes
  useEffect(() => {
    // Check localStorage first for immediate theme
    const savedTheme = localStorage.getItem('theme') || currentTheme || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [currentTheme]);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Save to database if user is logged in
    if (userId) {
      setSaving(true);
      try {
        await updateTheme(newTheme, userId);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
      setSaving(false);
    }
  };

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text font-semibold">Theme</span>
      </label>
      <select
        className="select select-bordered w-full"
        value={theme}
        onChange={(e) => handleThemeChange(e.target.value)}
        disabled={saving}
      >
        {themes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      {saving && <span className="text-sm text-gray-500 mt-1">Saving...</span>}
    </div>
  );
}
