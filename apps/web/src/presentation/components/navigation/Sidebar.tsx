import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { NavigationItem, navigationItems } from './NavigationTypes';
import { cn } from '../../../lib/utils';

interface SidebarNavItemProps {
  item: NavigationItem;
  isActive: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isActive }) => {
  // Dynamically get the icon component
  const IconComponent = Icons[item.icon as keyof typeof Icons] as LucideIcon;

  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 border-l-3 border-transparent',
        'hover:bg-gray-50 hover:text-teal-600',
        isActive && 'bg-green-50 text-teal-600 border-l-teal-600 font-semibold'
      )}
      data-testid={`nav-${item.id}`}
    >
      {IconComponent && (
        <IconComponent 
          className="h-4 w-4 flex-shrink-0" 
          aria-hidden="true"
        />
      )}
      <span className="nav-text">{item.label}</span>
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        'fixed top-[100px] left-0 w-[200px] h-[calc(100vh-100px)] bg-white shadow-lg z-50',
        className
      )}
    >
      <nav className="h-full">
        <ul className="flex flex-col">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <SidebarNavItem item={item} isActive={isActive} />
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};