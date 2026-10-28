import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Sparkles,
  BriefcaseMedical,
  CalendarCheck,
  Mail,
  Settings,
  Activity,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/api/appointments.api';
import { getContacts } from '@/api/contact.api';
import { getDoctors } from '@/api/doctors.api';

const menuItems = [
  {
    name: 'Boshqaruv paneli',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Shifokorlar',
    path: '/admin/doctors',
    icon: Stethoscope,
    badgeKey: 'doctors',
  },
  {
    name: 'Mutaxassisliklar',
    path: '/admin/specialties',
    icon: Sparkles,
  },
  {
    name: 'Xizmatlar va Narxlar',
    path: '/admin/services',
    icon: BriefcaseMedical,
  },
  {
    name: 'Qabullar',
    path: '/admin/appointments',
    icon: CalendarCheck,
    badgeKey: 'appointments',
    badgeVariant: 'warning',
  },
  {
    name: 'Murojaatlar',
    path: '/admin/contacts',
    icon: Mail,
    badgeKey: 'contacts',
    badgeVariant: 'info',
  },
  {
    name: 'Klinika sozlamalari',
    path: '/admin/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = useAuth();

  // Fetch real counts for dynamic badges
  const { data: doctorsData } = useQuery({
    queryKey: ['doctors', 'count'],
    queryFn: () => getDoctors({ limit: 1 }),
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments', 'count'],
    queryFn: () => getAppointments({ limit: 1 }),
  });

  const { data: contactsData } = useQuery({
    queryKey: ['contacts', 'count'],
    queryFn: () => getContacts({ limit: 1 }),
  });

  const getBadge = (key?: string) => {
    if (key === 'doctors' && doctorsData?.total) return `${doctorsData.total} ta`;
    if (key === 'appointments' && appointmentsData?.total) {
      return `${appointmentsData.total} ta`;
    }
    if (key === 'contacts' && contactsData?.total) return `${contactsData.total} ta`;
    return null;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-900/40">
              <Activity className="h-5 w-5" />
            </div>

            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight leading-tight">MedAdmin</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                Tibbiyot Markazi
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Klinika Boshqaruvi
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const badge = getBadge(item.badgeKey);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold ring-1 ring-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 shrink-0 transition-colors',
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                      )}
                    />

                    <span className="truncate flex-1">{item.name}</span>

                    {badge && (
                      <span
                        className={cn(
                          'ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0',
                          item.badgeVariant === 'warning'
                            ? 'bg-amber-500/20 text-amber-300'
                            : item.badgeVariant === 'info'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        )}
                      >
                        {badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-emerald-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card */}
        <div className="border-t border-slate-800 p-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-2.5">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/30">
              <User className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">{user?.username || 'Admin'}</p>
              <p className="truncate text-[10px] text-emerald-400 uppercase tracking-wider">{user?.role || 'Administrator'}</p>
            </div>

            <button
              onClick={logout}
              title="Tizimdan chiqish"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

