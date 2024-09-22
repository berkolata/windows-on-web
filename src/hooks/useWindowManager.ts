"use client";

import { useState } from 'react';
import { FileSystemItem } from '../types';

interface WindowState {
  id: string;
  item: FileSystemItem;
  isMinimized: boolean;
  zIndex: number;
}

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(0);

  const openWindow = (item: FileSystemItem): WindowState => {
    const newWindow = { 
      id: `window-${Date.now()}`, 
      item, 
      isMinimized: false, 
      zIndex: maxZIndex + 1 
    };
    setWindows(prev => [...prev, newWindow]);
    setMaxZIndex(prev => prev + 1);
    return newWindow;
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(window => window.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, isMinimized: !window.isMinimized } : window
    ));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(window => 
      window.id === id 
        ? { ...window, zIndex: maxZIndex + 1, isMinimized: false }
        : window
    ));
    setMaxZIndex(prev => prev + 1);
  };

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow
  };
};