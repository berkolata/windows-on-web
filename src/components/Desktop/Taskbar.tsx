"use client";

import React from 'react';

interface TaskbarProps {
  windows: { id: string; item: { name: string }; isMinimized: boolean }[];
  onWindowClick: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, onWindowClick }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#245edb] flex items-center px-2">
      <button className="bg-[#3c9140] text-white font-bold py-1 px-3 cursor-pointer mr-2">
        Start
      </button>
      {windows.map(window => (
        <button
          key={window.id}
          className={`bg-[#3a6ea5] text-white py-1 px-3 mx-1 cursor-pointer ${window.isMinimized ? 'opacity-50' : ''}`}
          onClick={() => onWindowClick(window.id)}
        >
          {window.item.name}
        </button>
      ))}
    </div>
  );
};

export default Taskbar;