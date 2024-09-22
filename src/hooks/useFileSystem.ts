"use client";

import { useState, useEffect, useCallback } from 'react';
import { FileSystemState, FileSystemItem } from '../types';
import initialFileSystem from '../data/initialFileSystem.json';

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemState>(initialFileSystem as FileSystemState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFileSystem = localStorage.getItem('fileSystem');
      if (savedFileSystem) {
        setFileSystem(JSON.parse(savedFileSystem));
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
    }
  }, [fileSystem, isLoaded]);

  const getItemById = useCallback((id: string, items: FileSystemItem[] = fileSystem.items): FileSystemItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = getItemById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }, [fileSystem]);

  const createNewFolder = (name: string, parentPath: string[] = []) => {
    const newFolder: FileSystemItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      children: []
    };

    setFileSystem(prev => {
      const updateItems = (items: FileSystemItem[], currentPath: string[]): FileSystemItem[] => {
        if (currentPath.length === 0) {
          return [...items, newFolder];
        }
        return items.map(item => {
          if (item.id === currentPath[0]) {
            return {
              ...item,
              children: [...(item.children || []), newFolder]
            };
          }
          return item;
        });
      };

      return {
        ...prev,
        items: updateItems(prev.items, parentPath)
      };
    });

    return newFolder;
  };

  const createNewTextFile = (name: string, parentPath: string[] = []) => {
    const newFile: FileSystemItem = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      content: ''
    };

    setFileSystem(prev => {
      const updateItems = (items: FileSystemItem[], currentPath: string[]): FileSystemItem[] => {
        if (currentPath.length === 0) {
          return [...items, newFile];
        }
        return items.map(item => {
          if (item.id === currentPath[0]) {
            return {
              ...item,
              children: [...(item.children || []), newFile]
            };
          }
          return item;
        });
      };

      return {
        ...prev,
        items: updateItems(prev.items, parentPath)
      };
    });

    return newFile;
  };

  const getCurrentItems = (): FileSystemItem[] => {
    let currentItems = fileSystem.items;
    for (const pathPart of fileSystem.currentPath) {
      const folder = currentItems.find(item => item.id === pathPart);
      if (folder && folder.type === 'folder') {
        currentItems = folder.children || [];
      } else {
        break;
      }
    }
    return currentItems;
  };

  const renameItem = (itemId: string, newName: string) => {
    setFileSystem(prev => {
      const updateItems = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map(item => {
          if (item.id === itemId) {
            return { ...item, name: newName };
          } else if (item.children) {
            return { ...item, children: updateItems(item.children) };
          }
          return item;
        });
      };

      return {
        ...prev,
        items: updateItems(prev.items)
      };
    });
  };

  const navigateTo = (folderId: string) => {
    setFileSystem(prev => ({
      ...prev,
      currentPath: [...prev.currentPath, folderId]
    }));
  };

  const navigateUp = () => {
    setFileSystem(prev => ({
      ...prev,
      currentPath: prev.currentPath.slice(0, -1)
    }));
  };

  const deleteItem = (itemId: string) => {
    setFileSystem(prev => {
      const deleteFromItems = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.filter(item => {
          if (item.id === itemId) {
            return false;
          }
          if (item.children) {
            item.children = deleteFromItems(item.children);
          }
          return true;
        });
      };

      return {
        ...prev,
        items: deleteFromItems(prev.items)
      };
    });
  };

  return {
    currentItems: getCurrentItems(),
    currentPath: fileSystem.currentPath,
    createNewFolder,
    createNewTextFile,
    renameItem,
    navigateTo,
    navigateUp,
    isLoaded,
    fileSystem,
    deleteItem,
    getItemById
  };
};