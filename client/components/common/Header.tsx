import React from 'react';
import { LogOut } from 'lucide-react';
import { BrainCog, Biohazard } from 'lucide-react';

const Header = () => {
  return (
    <div>
      <div className="min-h-5 bg-neutral-900 text-gray-100 flex flex-col">
      <header className="p-3 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 bg-gray-700 rounded-full flex items-center justify-center">
            <BrainCog size={30} color="#f1e4e4" strokeWidth={2} absoluteStrokeWidth />
          </div>
            <span className="font-semibold text-lg"><p>PD<sup>2</sup></p>
          </span>
        </div>
        <div className="flex items-center space-x-4">

          <button className="flex items-center space-x-1 bg-white text-gray-900 px-3 py-1 rounded">
            <span>Manoj</span>
            <Biohazard className="w-4 h-4" />
          </button>
        </div>
      </header>
    </div>
    </div>
  );
};

export default Header;