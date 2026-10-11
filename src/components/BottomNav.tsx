import React from 'react';
import { LayoutDashboard, Users, CreditCard, UserCheck, Menu } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenMore: () => void;
  duesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenMore,
  duesCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around border-t border-[#34393e] bg-[#111314]/95 px-2 py-2 backdrop-blur-lg pb-[calc(8px+env(safe-area-inset-bottom))]">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition ${
          currentPage === 'dashboard' ? 'text-[#b9f227]' : 'text-[#929aa1] hover:text-white'
        }`}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('members')}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition ${
          currentPage === 'members' ? 'text-[#b9f227]' : 'text-[#929aa1] hover:text-white'
        }`}
      >
        <Users className="h-5 w-5" />
        <span>Members</span>
      </button>

      <button
        onClick={() => onNavigate('payments')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition ${
          currentPage === 'payments' ? 'text-[#b9f227]' : 'text-[#929aa1] hover:text-white'
        }`}
      >
        <CreditCard className="h-5 w-5" />
        <span>Fees</span>
        {duesCount > 0 && (
          <span className="absolute top-0 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#f05252] text-[8px] font-black text-white">
            !
          </span>
        )}
      </button>

      <button
        onClick={() => onNavigate('attendance')}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition ${
          currentPage === 'attendance' ? 'text-[#b9f227]' : 'text-[#929aa1] hover:text-white'
        }`}
      >
        <UserCheck className="h-5 w-5" />
        <span>Check-in</span>
      </button>

      <button
        onClick={onOpenMore}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition text-[#929aa1] hover:text-white`}
      >
        <Menu className="h-5 w-5" />
        <span>Menu</span>
      </button>
    </nav>
  );
};
