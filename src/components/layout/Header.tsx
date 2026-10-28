import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Calendar,
  Globe,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getClinicInfo } from '@/api/clinic.api';
import { getContacts } from '@/api/contact.api';
import { Link } from 'react-router-dom';
import { formatHeaderDate } from '@/utils/format';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: clinic } = useQuery({
    queryKey: ['clinic'],
    queryFn: () => getClinicInfo(),
  });

  const { data: contactsData } = useQuery({
    queryKey: ['contacts', 'header'],
    queryFn: () => getContacts({ limit: 5, sort: 'createdAt-desc' }),
  });

  const totalContacts = contactsData?.total ?? 0;
  const recentContacts = contactsData?.data ?? [];

  const today = formatHeaderDate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-8 backdrop-blur-md">
      {/* Left side: Mobile Toggle & Clinic Info */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{clinic?.name || 'MED Clinic'}</span>
        </div>
      </div>

      {/* Right side: Date & Notifications */}
      <div className="flex items-center gap-3">
        {/* Date indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="capitalize">{today}</span>
        </div>

        {/* Real Inquiries / Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
            title="Kelib tushgan murojaatlar"
          >
            <Bell className="h-5 w-5" />
            {totalContacts > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs">
                {totalContacts > 99 ? '99+' : totalContacts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Murojaatlar ({totalContacts})
                </span>
                <Link
                  to="/admin/contacts"
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-emerald-600 font-semibold hover:underline"
                >
                  Barchasini ko'rish
                </Link>
              </div>

              <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
                {recentContacts.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-xs">Yangi murojaatlar yo'q</p>
                ) : (
                  recentContacts.map((msg) => (
                    <Link
                      key={msg.id}
                      to="/admin/contacts"
                      onClick={() => setShowNotifications(false)}
                      className="block p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 transition"
                    >
                      <p className="font-semibold text-slate-800 truncate">{msg.name}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-1">{msg.message}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
