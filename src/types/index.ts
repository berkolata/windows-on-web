// src/types/index.ts

export interface FileSystemItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    children?: FileSystemItem[]; // Klasörler için alt öğeler
    content?: string;
}

export interface FileSystemState {
    items: FileSystemItem[];
    currentPath: string[];
}