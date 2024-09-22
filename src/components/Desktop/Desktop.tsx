"use client";

import React, { useState } from 'react';
import Taskbar from './Taskbar';
import FileList from '../FileSystem/FileList';
import Window from '../Window/Window';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useWindowManager } from '../../hooks/useWindowManager';
import { FileSystemItem } from '../../types';

const Desktop: React.FC = () => {
  const { currentItems, createNewFolder, createNewTextFile, renameItem, deleteItem, navigateTo, isLoaded, fileSystem } = useFileSystem();
  const { windows, openWindow, closeWindow, minimizeWindow, focusWindow } = useWindowManager();
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      const newWindow = openWindow(item);
      setActiveWindowId(newWindow.id);
    }
  };

  const handleCreateNewFolder = (name: string) => {
    createNewFolder(name);
  };

  const handleCreateNewTextFile = (name: string) => {
    createNewTextFile(name);
  };

  const handleRename = (itemId: string, newName: string) => {
    renameItem(itemId, newName);
  };

  const handleDelete = (itemId: string) => {
    deleteItem(itemId);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen bg-[#3a6ea5] relative overflow-hidden">
      <div className="mt-10">
        <FileList 
          items={fileSystem.items} 
          onItemClick={handleItemClick} 
          onRename={handleRename}
          onDelete={handleDelete}
          onCreateNewFolder={handleCreateNewFolder}
          onCreateNewTextFile={handleCreateNewTextFile}
          isDesktop={true}
        />
      </div>
      {windows.map(window => (
        <Window
          key={window.id}
          item={window.item}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          zIndex={window.zIndex}
          onFocus={() => {
            focusWindow(window.id);
            setActiveWindowId(window.id);
          }}
          isMinimized={window.isMinimized}
          isActive={window.id === activeWindowId}
        />
      ))}
      <Taskbar windows={windows} onWindowClick={(id) => {
        focusWindow(id);
        setActiveWindowId(id);
      }} />
    </div>
  );
};

export default Desktop;