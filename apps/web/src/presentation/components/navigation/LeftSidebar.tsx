import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const LeftSidebar: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/appointments', label: 'Appointments', icon: 'fas fa-calendar-check' },
    { path: '/patients', label: 'Patients', icon: 'fas fa-users' },
    { path: '/laboratory', label: 'Laboratory', icon: 'fas fa-flask' },
    { path: '/prescriptions', label: 'Prescriptions', icon: 'fas fa-prescription-bottle' },
    { path: '/doctors', label: 'Doctors', icon: 'fas fa-user-md' },
    { path: '/accounts', label: 'Accounts', icon: 'fas fa-users-cog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-[100px] left-0 w-[200px] h-full bg-white shadow-lg z-[999] pt-5">
      <ul className="list-none p-0 m-0">
        {navItems.map(({ path, label, icon }) => (
          <li key={path}>
            <Link
              to={path}
              className={`
                flex items-center px-5 py-3 transition-all duration-300 border-l-3 border-transparent relative
                ${isActive(path) 
                  ? 'bg-green-100 text-teal-500 border-l-teal-500 font-semibold after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[3px] after:bg-teal-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-teal-500'
                }
              `}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <i className={`${icon} w-[18px] mr-3 text-center text-base flex-shrink-0`}></i>
              <span className="text-sm font-medium whitespace-nowrap">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};