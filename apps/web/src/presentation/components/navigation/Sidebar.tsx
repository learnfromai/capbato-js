import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FlaskConical, 
  Pill, 
  UserRound, 
  Settings 
} from 'lucide-react';

// Check if we're in demo mode (for testing without auth)
const isDemoMode = () => window.location.pathname.startsWith('/demo');

const getNavItems = () => {
  const basePrefix = isDemoMode() ? '/demo' : '';
  return [
    { path: `${basePrefix}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { path: `${basePrefix}/appointments`, label: 'Appointments', icon: Calendar },
    { path: `${basePrefix}/patients`, label: 'Patients', icon: Users },
    { path: `${basePrefix}/laboratory`, label: 'Laboratory', icon: FlaskConical },
    { path: `${basePrefix}/prescriptions`, label: 'Prescriptions', icon: Pill },
    { path: `${basePrefix}/doctors`, label: 'Doctors', icon: UserRound },
    { path: `${basePrefix}/accounts`, label: 'Accounts', icon: Settings },
  ];
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navItems = getNavItems();

  return (
    <div className="fixed top-[100px] left-0 w-[200px] h-full bg-white shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-[999] py-5">
      <ul className="list-none p-0 m-0">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          
          return (
            <li key={path}>
              <Link
                to={path}
                className={`
                  flex items-center px-5 py-3 cursor-pointer transition-all duration-300 text-[#666] 
                  border-l-[3px] border-transparent relative
                  hover:bg-[#f8f9fa] hover:text-[#4db6ac]
                  ${isActive ? 'bg-[#e8f5e8] text-[#4db6ac] border-l-[#4db6ac] font-semibold' : ''}
                  ${isActive ? 'after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[3px] after:bg-[#4db6ac] after:content-[""]' : ''}
                `}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-[18px] mr-3 text-center flex-shrink-0" size={16} />
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};