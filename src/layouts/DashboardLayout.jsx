import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { cn } from '../utils/cn';

export const DashboardLayout = ({ children }) => {
  const { sidebarOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          sidebarOpen ? 'pl-64' : 'pl-20'
        )}
      >
        {/* Top Header Navbar */}
        <Navbar
          searchVal={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Page Content Panel */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="py-4 px-8 border-t border-gray-150/40 text-center text-xs text-gray-400">
          <p>© 2026 SolveX Flow. All rights reserved. Premium Dashboard UI.</p>
        </footer>
      </div>
    </div>
  );
};
