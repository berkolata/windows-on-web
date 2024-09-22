import React from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isDesktop?: boolean; // Yeni prop
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  name, 
  icon, 
  isSelected, 
  onClick, 
  onContextMenu,
  isDesktop = false // Varsayılan değer false
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center w-32 h-32 p-2 rounded cursor-pointer ${
        isSelected ? 'bg-blue-700' : isDesktop ? 'hover:bg-blue-500' : 'hover:bg-gray-200'
      }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className={`text-md text-center break-words w-full overflow-hidden line-clamp-2 ${
        isDesktop ? 'text-white' : 'text-black' // Pencere içinde siyah, masaüstünde beyaz
      }`}>
        {name}
      </div>
    </div>
  );
};

export default DesktopIcon;