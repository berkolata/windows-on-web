"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FileSystemItem } from '../../types';
import FileList from '../FileSystem/FileList';
import { useFileSystem } from '../../hooks/useFileSystem';

interface WindowProps {
  item: FileSystemItem;
  onClose: () => void;
  onMinimize: () => void;
  zIndex: number;
  onFocus: () => void;
  isMinimized: boolean;
  isActive: boolean;
}

const Window: React.FC<WindowProps> = ({ 
  item, 
  onClose, 
  onMinimize, 
  zIndex, 
  onFocus, 
  isMinimized,
  isActive
}) => {
  const { createNewFolder, createNewTextFile, renameItem, deleteItem } = useFileSystem();
  const [windowContent, setWindowContent] = useState<FileSystemItem>(item);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (windowRef.current) {
      const { innerWidth, innerHeight } = window;
      const width = Math.round(innerWidth * 0.75);
      const height = Math.round(innerHeight * 0.75);
      setSize({ width, height });
      setPosition({ 
        x: Math.round((innerWidth - width) / 2), 
        y: Math.round((innerHeight - height) / 2) 
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing) {
      let newSize = { ...size };
      let newPosition = { ...position };

      switch (resizeDirection) {
        case 'e':
          newSize.width = e.clientX - position.x;
          break;
        case 'w':
          newSize.width = size.width + (position.x - e.clientX);
          newPosition.x = e.clientX;
          break;
        case 's':
          newSize.height = e.clientY - position.y;
          break;
        case 'n':
          newSize.height = size.height + (position.y - e.clientY);
          newPosition.y = e.clientY;
          break;
        case 'se':
          newSize.width = e.clientX - position.x;
          newSize.height = e.clientY - position.y;
          break;
        case 'sw':
          newSize.width = size.width + (position.x - e.clientX);
          newSize.height = e.clientY - position.y;
          newPosition.x = e.clientX;
          break;
        case 'ne':
          newSize.width = e.clientX - position.x;
          newSize.height = size.height + (position.y - e.clientY);
          newPosition.y = e.clientY;
          break;
        case 'nw':
          newSize.width = size.width + (position.x - e.clientX);
          newSize.height = size.height + (position.y - e.clientY);
          newPosition.x = e.clientX;
          newPosition.y = e.clientY;
          break;
      }

      setSize(newSize);
      setPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset]);

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleCreateNewFolder = (name: string) => {
    const newFolder = createNewFolder(name, [windowContent.id]);
    setWindowContent(prev => ({
      ...prev,
      children: [...(prev.children || []), newFolder]
    }));
  };

  const handleCreateNewTextFile = (name: string) => {
    const newFile = createNewTextFile(name, [windowContent.id]);
    setWindowContent(prev => ({
      ...prev,
      children: [...(prev.children || []), newFile]
    }));
  };

  const handleItemClick = (clickedItem: FileSystemItem) => {
    console.log('Clicked item in window:', clickedItem);
  };

  const handleRename = (itemId: string, newName: string) => {
    renameItem(itemId, newName);
    setWindowContent(prev => ({
      ...prev,
      children: prev.children?.map(child => 
        child.id === itemId ? { ...child, name: newName } : child
      )
    }));
  };

  const handleDelete = (itemId: string) => {
    deleteItem(itemId);
    setWindowContent(prev => ({
      ...prev,
      children: prev.children?.filter(child => child.id !== itemId)
    }));
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div 
      ref={windowRef}
      className={`absolute bg-white border-2 ${isActive ? 'border-blue-500' : 'border-gray-400'} shadow-lg overflow-hidden`}
      style={{ 
        zIndex,
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      }}
      onClick={onFocus}
    >
      <div 
        className={`window-header ${isActive ? 'bg-blue-500' : 'bg-gray-400'} text-white p-2 flex justify-between items-center cursor-move`}
        onMouseDown={handleMouseDown}
      >
        <span>{windowContent.name}</span>
        <div>
          <button onClick={onMinimize} className="mx-1">_</button>
          <button onClick={() => setIsMaximized(!isMaximized)} className="mx-1">{isMaximized ? '❐' : '□'}</button>
          <button onClick={onClose} className="mx-1">✕</button>
        </div>
      </div>
      <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 2.5rem)' }}>
        {windowContent.type === 'folder' && (
          <FileList 
            items={windowContent.children || []} 
            onItemClick={handleItemClick}
            onRename={handleRename}
            onDelete={handleDelete}
            onCreateNewFolder={handleCreateNewFolder}
            onCreateNewTextFile={handleCreateNewTextFile}
            isDesktop={false}
          />
        )}
        {windowContent.type === 'file' && <div>{windowContent.content}</div>}
      </div>
      {/* Resize tutamaçları */}
      <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize" onMouseDown={handleResizeStart('n')} />
      <div className="absolute top-0 right-0 w-1 h-full cursor-e-resize" onMouseDown={handleResizeStart('e')} />
      <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize" onMouseDown={handleResizeStart('s')} />
      <div className="absolute top-0 left-0 w-1 h-full cursor-w-resize" onMouseDown={handleResizeStart('w')} />
      <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" onMouseDown={handleResizeStart('nw')} />
      <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={handleResizeStart('ne')} />
      <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={handleResizeStart('sw')} />
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" 
        onMouseDown={handleResizeStart('se')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 5V11H5"
            stroke={isActive ? "#3B82F6" : "#9CA3AF"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Window;