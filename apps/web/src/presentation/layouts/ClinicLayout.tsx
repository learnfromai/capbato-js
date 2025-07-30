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
    <div className="min-h-screen relative font-sans" style={{ 
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
      <nav className="fixed top-0 left-0 w-full bg-white px-5 py-2.5 z-[1000] flex items-center gap-4" style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <Link to="/dashboard" className="flex items-center gap-4 no-underline">
          <div 
            className="w-[70px] h-[70px] bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-200"
          />
          <h1 className="text-[22px] m-0 font-normal" style={{ color: '#0b4f6c' }}>
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
              className="w-[45px] h-[45px] rounded-full flex items-center justify-center font-medium text-2xl text-white cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: '#4db6ac',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transform: 'scale(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
              }}
            >
              A
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="fixed top-[100px] left-0 w-[200px] h-full bg-white py-5 z-[999]" style={{
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <ul className="list-none p-0 m-0">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className="flex items-center px-5 py-3 cursor-pointer transition-all duration-300 text-gray-600 relative no-underline border-l-[3px] border-l-transparent"
                  style={{
                    backgroundColor: isActive ? '#e8f5e8' : 'transparent',
                    color: isActive ? '#4db6ac' : '#666',
                    borderLeftColor: isActive ? '#4db6ac' : 'transparent',
                    fontWeight: isActive ? '600' : '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.color = '#4db6ac';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#666';
                    }
                  }}
                >
                  {isActive && (
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-[3px]" 
                      style={{ backgroundColor: '#4db6ac' }}
                    />
                  )}
                  <Icon size={18} className="mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content */}
      <div className="ml-[200px]">
        <div className="max-w-[1200px] mx-auto p-5">
          <div className="bg-white rounded-2xl p-8 min-h-[300px]" style={{
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};