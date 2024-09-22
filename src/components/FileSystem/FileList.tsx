"use client";

import React, { useState } from 'react';
import { FileSystemItem } from '../../types';
import DesktopIcon from '../Desktop/DesktopIcon';
import ContextMenu from '../ContextMenu/ContextMenu';

interface FileListProps {
  items: FileSystemItem[];
  onItemClick: (item: FileSystemItem) => void;
  onRename: (itemId: string, newName: string) => void;
  onDelete: (itemId: string) => void;
  onCreateNewFolder: (name: string) => void;
  onCreateNewTextFile: (name: string) => void;
  isDesktop: boolean;
}

const FileList: React.FC<FileListProps> = ({ 
  items, 
  onItemClick, 
  onRename, 
  onDelete, 
  onCreateNewFolder, 
  onCreateNewTextFile,
  isDesktop
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item?: FileSystemItem } | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleContextMenu = (e: React.MouseEvent, item?: FileSystemItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleItemClick = (e: React.MouseEvent, item: FileSystemItem) => {
    e.stopPropagation();
    setSelectedItem(item.id);
    onItemClick(item);
  };

  const handleNewFolder = () => {
    const name = prompt('Enter new folder name:');
    if (name) {
      onCreateNewFolder(name);
    }
    handleCloseContextMenu();
  };

  const handleNewTextFile = () => {
    const name = prompt('Enter new text file name:');
    if (name) {
      onCreateNewTextFile(name);
    }
    handleCloseContextMenu();
  };

  const handleRename = () => {
    if (contextMenu?.item) {
      const newName = prompt('Enter new name:', contextMenu.item.name);
      if (newName) {
        onRename(contextMenu.item.id, newName);
      }
    }
    handleCloseContextMenu();
  };

  const handleDelete = () => {
    if (contextMenu?.item) {
      if (window.confirm(`Are you sure you want to delete ${contextMenu.item.name}?`)) {
        onDelete(contextMenu.item.id);
      }
    }
    handleCloseContextMenu();
  };

  return (
    <div 
      className={`grid grid-cols-[repeat(auto-fill,128px)] auto-rows-[128px] gap-2 p-4 ${isDesktop ? 'h-screen' : 'h-full'} justify-start content-start`}
      onContextMenu={(e) => handleContextMenu(e)}
      onClick={() => setSelectedItem(null)}
    >
      {items.map((item) => (
        <DesktopIcon 
          key={item.id} 
          name={item.name} 
          icon={item.type === 'folder' ? '📁' : '📄'} 
          isSelected={selectedItem === item.id}
          onClick={(e) => handleItemClick(e, item)}
          onContextMenu={(e) => {
            e.stopPropagation();
            handleContextMenu(e, item);
          }}
          isDesktop={isDesktop} // Bu satırı ekleyin
        />
      ))}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onNewFolder={!contextMenu.item ? handleNewFolder : undefined}
          onNewTextFile={!contextMenu.item ? handleNewTextFile : undefined}
          onRename={contextMenu.item ? handleRename : undefined}
          onDelete={contextMenu.item ? handleDelete : undefined}
          isItemMenu={!!contextMenu.item}
        />
      )}
    </div>
  );
};

export default FileList;