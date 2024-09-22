import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onNewFolder?: () => void;
  onNewTextFile?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  isItemMenu: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  x, 
  y, 
  onClose, 
  onNewFolder, 
  onNewTextFile, 
  onRename, 
  onDelete, 
  isItemMenu 
}) => {
  return (
    <div 
      className="absolute bg-white border border-gray-300 shadow-md py-2 rounded"
      style={{ left: x, top: y }}
    >
      {!isItemMenu && (
        <>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={onNewFolder}>New Folder</button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={onNewTextFile}>New Text File</button>
        </>
      )}
      {isItemMenu && (
        <>
          {onRename && (
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={onRename}>Rename</button>
          )}
          {onDelete && (
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={onDelete}>Delete</button>
          )}
        </>
      )}
    </div>
  );
};

export default ContextMenu;