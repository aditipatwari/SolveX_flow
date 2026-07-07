import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Zap,
  ChevronDown,
  Layers,
  LogOut,
  Wind,
  Car,
  Activity,
  ShieldAlert,
  Smile,
  Wrench
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

// Mapping icons to string keys
const iconMap = {
  Wind,
  Car,
  Activity,
  ShieldAlert,
  Smile,
  Wrench
};

export const Sidebar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    currentTemplate,
    changeTemplate,
    templatesList,
    user
  } = useApp();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: `${currentTemplate.terminology.servicePlural} & Dispatch`, to: '/jobs', icon: ClipboardList },
    { name: currentTemplate.terminology.customer, to: '/customers', icon: Users },
    { name: currentTemplate.terminology.technician, to: '/specialists', icon: UserCheck },
    { name: 'Automations', to: '/automation', icon: Zap },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const ServiceIcon = iconMap[currentTemplate.icon] || Layers;

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Sidebar Header / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-9 w-9 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary-600/20">
            <span className="text-white font-bold text-lg select-none">S</span>
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="font-bold text-gray-900 text-sm leading-tight tracking-tight">SolveX Flow</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Automate SaaS</span>
            </motion.div>
          )}
        </div>

        {/* Collapse Toggle Desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center h-6 w-6 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Workspace Selector Dropdown */}
      <div className="p-3 border-b border-gray-50 relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => sidebarOpen && setDropdownOpen(!dropdownOpen)}
          className={cn(
            'w-full flex items-center justify-between gap-2 p-2 rounded-lg transition-all duration-200 text-left border border-transparent',
            sidebarOpen ? 'hover:bg-gray-50 hover:border-gray-100' : 'cursor-default'
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md flex-shrink-0">
              <ServiceIcon className="h-4 w-4" />
            </div>
            {sidebarOpen && (
              <div className="truncate">
                <p className="text-xs font-semibold text-gray-800 leading-none">{currentTemplate.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{currentTemplate.title}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', dropdownOpen && 'rotate-180')} />
          )}
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {dropdownOpen && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-3 right-3 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden"
            >
              <div className="p-1.5 max-h-60 overflow-y-auto">
                <p className="text-[10px] font-bold text-gray-400 px-2 py-1.5 uppercase tracking-wider">Switch Template</p>
                {templatesList.map((tmpl) => {
                  const Icon = iconMap[tmpl.icon] || Layers;
                  const isSelected = tmpl.id === currentTemplate.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        changeTemplate(tmpl.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-lg text-left text-xs transition-colors',
                        isSelected ? 'bg-primary-50 text-primary-900 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                      )}
                    >
                      <span className={cn('p-1.5 rounded-md', isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 text-gray-500')}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="truncate">
                        <p className="leading-tight">{tmpl.name}</p>
                        <p className="text-[10px] text-gray-400 font-normal truncate mt-0.5">{tmpl.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border border-transparent',
                isActive
                  ? 'bg-primary-50/60 text-primary-700 font-semibold border-primary-50/30'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer - User profile */}
      <div className="p-3 border-t border-gray-50 flex-shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 border border-gray-100/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover border border-white shadow-2xs flex-shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-gray-800 leading-tight truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{user.role}</p>
              </div>
            </div>
            
            <button
              className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border border-white shadow-2xs"
            />
          </div>
        )}
      </div>
    </aside>
  );
};
