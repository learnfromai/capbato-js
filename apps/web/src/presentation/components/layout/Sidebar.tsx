import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { path: '/appointments', label: 'Appointments', icon: 'fas fa-calendar-check' },
  { path: '/patients', label: 'Patients', icon: 'fas fa-users' },
  { path: '/laboratory', label: 'Laboratory', icon: 'fas fa-flask' },
  { path: '/prescriptions', label: 'Prescriptions', icon: 'fas fa-prescription-bottle' },
  { path: '/doctors', label: 'Doctors', icon: 'fas fa-user-md' },
  { path: '/accounts', label: 'Accounts', icon: 'fas fa-users-cog' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed top-24 left-0 w-52 h-full bg-white pt-5 shadow-lg z-50">
      <ul className="list-none p-0 m-0">
        {navItems.map(({ path, label, icon }) => {
          const isActive = location.pathname === path;
          
          return (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center py-3 px-5 cursor-pointer transition-all duration-300 border-l-4 relative ${
                  isActive
                    ? 'bg-green-50 text-teal-600 border-l-teal-500 font-semibold'
                    : 'text-gray-600 border-l-transparent hover:bg-gray-50 hover:text-teal-500'
                }`}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <i className={`${icon} w-5 mr-3 text-center text-base flex-shrink-0`} />
                <span className="text-sm font-medium whitespace-nowrap">
                  {label}
                </span>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-teal-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};