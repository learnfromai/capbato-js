export interface NavigationItem {
  id: string;
  path: string;
  label: string;
  icon: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'Activity'
  },
  {
    id: 'appointments',
    path: '/appointments',
    label: 'Appointments',
    icon: 'CalendarCheck'
  },
  {
    id: 'patients',
    path: '/patients',
    label: 'Patients',
    icon: 'Users'
  },
  {
    id: 'laboratory',
    path: '/laboratory',
    label: 'Laboratory',
    icon: 'TestTube'
  },
  {
    id: 'prescriptions',
    path: '/prescriptions',
    label: 'Prescriptions',
    icon: 'Pill'
  },
  {
    id: 'doctors',
    path: '/doctors',
    label: 'Doctors',
    icon: 'UserRound'
  },
  {
    id: 'accounts',
    path: '/accounts',
    label: 'Accounts',
    icon: 'Settings'
  }
];