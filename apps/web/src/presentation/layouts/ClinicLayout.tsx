import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Flask, 
  Pill, 
  Stethoscope, 
  Settings 
} from 'lucide-react';

interface ClinicLayoutProps {
  children: React.ReactNode;
}

export const ClinicLayout: React.FC<ClinicLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/laboratory', label: 'Laboratory', icon: Flask },
    { path: '/prescriptions', label: 'Prescriptions', icon: Pill },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope },
    { path: '/accounts', label: 'Accounts', icon: Settings },
  ];

  return (
    <div className="min-h-screen relative" style={{ 
      background: 'linear-gradient(to bottom right, rgb(109, 174, 218), #4db6ac)',
      paddingTop: '100px'
    }}>
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{
          background: 'inherit',
          filter: 'blur(10px)'
        }}
      />

      {/* Header/Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white px-5 py-2.5 shadow-md z-[1000] flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-4 no-underline">
          <img 
            src="/api/placeholder/70/70" 
            alt="Logo" 
            className="w-[70px] h-[70px] object-cover rounded-lg"
          />
          <h1 className="text-[22px] text-[#0b4f6c] m-0 font-normal">
            M.G. Amores Medical Clinic
          </h1>
        </Link>
        
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <div className="font-bold text-blue-600">ADMIN</div>
            <div className="text-gray-500 text-sm">admin</div>
          </div>
          <div className="relative">
            <div 
              className="w-[45px] h-[45px] rounded-full flex items-center justify-center font-medium text-2xl text-white bg-blue-600 shadow-sm cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200"
            >
              A
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="fixed top-[100px] left-0 w-[200px] h-full bg-white py-5 shadow-sm z-[999]">
        <ul className="list-none p-0 m-0">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center px-5 py-3 cursor-pointer transition-all duration-300 text-gray-600 border-l-[3px] border-l-transparent relative no-underline ${
                  location.pathname === path
                    ? 'bg-[#e8f5e8] text-[#4db6ac] border-l-[#4db6ac] font-semibold'
                    : 'hover:bg-gray-50 hover:text-[#4db6ac]'
                }`}
              >
                {location.pathname === path && (
                  <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#4db6ac]" />
                )}
                <Icon size={18} className="mr-3 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="ml-[200px]">
        <div className="max-w-[1200px] mx-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
};