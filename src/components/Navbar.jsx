import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SearchBar } from './SearchBar';
import { NotificationBell } from './NotificationBell';

export const Navbar = ({ searchVal, onSearchChange }) => {
  const { sidebarOpen, setSidebarOpen, currentTemplate } = useApp();

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 transition-all duration-200">
      <div className="flex items-center gap-4 flex-1">
        {/* Toggle Sidebar Button Mobile/Tablet */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand/Service contextual name (shown on mobile, hidden on larger screens if sidebar is visible) */}
        <div className="flex items-center gap-2 select-none">
          <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold bg-gray-50 border border-gray-150 rounded text-gray-600">
            {currentTemplate.name}
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 justify-center max-w-lg mx-auto">
          <SearchBar value={searchVal} onChange={onSearchChange} />
        </div>
      </div>

      {/* Right Navbar actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <NotificationBell />

        {/* Mini Separator */}
        <span className="h-5 w-px bg-gray-100" />

        {/* AI Knowledge Hub Link */}
        <Link
          to="/knowledge"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors hidden sm:block animate-fadeIn"
          title="AI Knowledge Hub"
        >
          <BookOpen className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
};
