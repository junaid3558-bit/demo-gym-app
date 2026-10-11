import React from 'react';
import { UserAccount, Branch } from '../types';
import { Bell, Smartphone, Download, User, ChevronDown, Wifi, WifiOff } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  branches: Branch[];
  currentUser: UserAccount;
  onOpenAuthModal: () => void;
  onOpenApkModal: () => void;
  onOpenNotifications: () => void;
  unreadAlertsCount: number;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  selectedBranch,
  onSelectBranch,
  branches,
  currentUser,
  onOpenAuthModal,
  onOpenApkModal,
  onOpenNotifications,
  unreadAlertsCount,
  isOnline,
}) => {
  const getPageTitle = (p: string) => {
    switch (p) {
      case 'dashboard':
        return 'Owner Dashboard';
      case 'members':
        return 'Gym Members (500+ Cap)';
      case 'payments':
        return 'Fees & UPI Billing';
      case 'attendance':
        return 'Check-in & Check-out';
      case 'maintenance':
        return 'Maintenance & Light Bills';
      case 'trainers':
        return 'Trainers & Payroll';
      case 'branches':
        return 'Gym Branches (4 Locations)';
      case 'ai':
        return 'Google Gemini AI Hub';
      case 'reports':
        return 'Excel & Physical Storage';
      case 'settings':
        return 'ERP Settings';
      default:
        return 'Gym Management';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-[#34393e] bg-[#151719]/95 px-4 sm:px-7 backdrop-blur-md">
      {/* Left: Brand & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b9f227] text-[#151719] font-black text-lg md:hidden">
          IC
        </div>
        <div>
          <div className="text-[11px] font-bold text-[#a4abb2] uppercase tracking-wider flex items-center gap-2">
            <span>IronCore Fitness Group</span>
            <span className="hidden sm:inline text-[#34393e]">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#81cf69]">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3" /> Offline Ready
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-amber-400" /> Offline Mode
                </>
              )}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-[#f4f5f6]">
            {getPageTitle(currentPage)}
          </h1>
        </div>
      </div>

      {/* Right: Branch Selector, Notifications, APK Install, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Branch Filter Selector */}
        <div className="relative">
          <select
            value={selectedBranch}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="h-9 rounded-lg border border-[#3a4045] bg-[#202326] px-2.5 sm:px-3 text-xs font-semibold text-[#f4f5f6] hover:border-[#b9f227] focus:border-[#b9f227] focus:outline-none transition cursor-pointer max-w-[130px] sm:max-w-none"
          >
            <option value="all">All Branches (4)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Download App / APK Button */}
        <button
          onClick={onOpenApkModal}
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-[#3a4823] bg-[#252c1d] px-3 py-1.5 text-xs font-black text-[#b9f227] hover:bg-[#2e3724] transition"
          title="Install Native App on Android, iOS or Windows"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>App / APK</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative rounded-lg border border-[#3a4045] bg-[#202326] p-2 text-[#a4abb2] hover:text-white hover:border-[#b9f227] transition"
          title="Urgent Alerts & Follow-ups"
        >
          <Bell className="h-4 w-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f05252] text-[10px] font-black text-white animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Current User Badge & Account Switcher */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 rounded-lg border border-[#3a4045] bg-[#202326] p-1.5 sm:px-2.5 sm:py-1.5 hover:border-[#b9f227] transition group"
          title="Switch User / 10 Google Accounts"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3a4823] text-[#b9f227] font-extrabold text-xs">
            {currentUser.avatarText}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-extrabold text-white leading-tight group-hover:text-[#b9f227] transition truncate max-w-[95px]">
              {currentUser.name}
            </span>
            <span className="block text-[10px] font-semibold text-[#a4abb2]">
              {currentUser.role}
            </span>
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-[#a4abb2]" />
        </button>
      </div>
    </header>
  );
};
