import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  Wrench,
  Award,
  Building2,
  Sparkles,
  FileSpreadsheet,
  Smartphone,
  HardDrive,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  membersCount: number;
  duesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  membersCount,
  duesCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users, badge: `${membersCount}` },
    { id: 'payments', label: 'Fees & Payments', icon: CreditCard, badge: duesCount > 0 ? `${duesCount} Due` : undefined, badgeColor: 'bg-[#3b3020] text-[#ffc56b]' },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'maintenance', label: 'Maintenance & Bills', icon: Wrench },
    { id: 'trainers', label: 'Trainers & Staff', icon: Award },
    { id: 'branches', label: 'Branches (4)', icon: Building2 },
    { id: 'ai', label: 'Gemini AI Advisor', icon: Sparkles, highlight: true },
    { id: 'reports', label: 'Excel & Backup', icon: FileSpreadsheet },
  ];

  return (
    <aside className="hidden md:flex w-[240px] flex-col border-r border-[#34393e] bg-[#111314] p-4 flex-shrink-0 justify-between select-none">
      <div className="space-y-6">
        {/* Brand */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-2 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b9f227] text-[#151719] font-black text-xl shadow-md shadow-[#b9f227]/20 group-hover:scale-105 transition">
            IC
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-white group-hover:text-[#b9f227] transition">
              IronCore Pro
            </div>
            <div className="text-[10px] font-bold text-[#a4abb2] tracking-wider uppercase">
              Gym Management ERP
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#747d84]">
            WORKSPACE
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#282e23] text-[#b9f227]'
                    : item.highlight
                    ? 'text-[#d7ff7d] hover:bg-[#20271c] hover:text-[#b9f227]'
                    : 'text-[#aeb5bb] hover:bg-[#202326] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#b9f227]' : item.highlight ? 'text-[#b9f227]' : 'text-[#aeb5bb]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                      item.badgeColor || (isActive ? 'bg-[#3a4823] text-[#b9f227]' : 'bg-[#282c30] text-[#a4abb2]')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage and APK Footer Card */}
      <div className="space-y-3 pt-4 border-t border-[#34393e]/60">
        <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white mb-1">
            <HardDrive className="h-3.5 w-3.5 text-[#b9f227]" />
            <span>Phone Storage Mode</span>
          </div>
          <p className="text-[11px] text-[#a4abb2] leading-tight">
            Data saved in device memory. Max capacity: <strong className="text-white">500+ members</strong>.
          </p>
        </div>

        <button
          onClick={() => onNavigate('apk')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#3a4823] bg-[#22291b] py-2 text-xs font-extrabold text-[#b9f227] hover:bg-[#2b3521] transition"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Install APK / PWA</span>
        </button>
      </div>
    </aside>
  );
};
