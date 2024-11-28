import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, BarChart2 } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <BarChart2 className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">EnergyMonitor</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <FileText className="w-4 h-4 mr-1" />
                Reports
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}