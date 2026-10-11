import React from 'react';
import { Member, Trainer, ExpenseRecord } from '../types';
import { X, AlertCircle, Calendar, MessageCircle, CreditCard, Award, CheckCircle } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  membersWithDues: Member[];
  expiringMembers: Member[];
  trainers: Trainer[];
  onOpenWhatsApp: (member: Member) => void;
  onNavigateToPayments: () => void;
  onNavigateToTrainers: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  membersWithDues,
  expiringMembers,
  trainers,
  onOpenWhatsApp,
  onNavigateToPayments,
  onNavigateToTrainers,
}) => {
  if (!isOpen) return null;

  const totalAlerts = membersWithDues.length + expiringMembers.length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#1b1e21] border-l border-[#34393e] flex flex-col text-[#f4f5f6] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#34393e] px-5 py-4 bg-[#16181a]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b3020] text-[#ffc56b]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Notifications & Alerts</h2>
              <p className="text-[11px] text-[#a4abb2]">{totalAlerts} items requiring attention</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Outstanding Fee Dues */}
          {membersWithDues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase text-[#ff9292] tracking-wider px-1">
                <span>Fee Dues Pending ({membersWithDues.length})</span>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToPayments();
                  }}
                  className="text-[11px] text-[#b9f227] hover:underline normal-case"
                >
                  Collect Fees →
                </button>
              </div>
              <div className="space-y-2">
                {membersWithDues.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-[#432d2e] bg-[#282021] p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <span className="text-[11px] text-[#a4abb2]">
                        {m.branch} · {m.plan}
                      </span>
                      <p className="text-xs font-black text-[#ff9292] mt-0.5">
                        Due: ₹{m.dueAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenWhatsApp(m)}
                      className="flex items-center gap-1 rounded-lg bg-[#25d366]/20 border border-[#25d366]/40 px-2.5 py-1.5 text-[11px] font-bold text-[#25d366] hover:bg-[#25d366]/30 transition"
                      title="Send WhatsApp Due Reminder"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Remind
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expiring Memberships */}
          {expiringMembers.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-extrabold uppercase text-[#ffc56b] tracking-wider px-1">
                Expiring Within 7 Days ({expiringMembers.length})
              </div>
              <div className="space-y-2">
                {expiringMembers.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-[#4a3f28] bg-[#29251c] p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <span className="text-[11px] text-[#a4abb2]">
                        {m.branch} · Expires on <strong>{m.expiryDate}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenWhatsApp(m)}
                      className="flex items-center gap-1 rounded-lg bg-[#3a4823] px-2.5 py-1.5 text-[11px] font-bold text-[#b9f227] hover:brightness-110 transition"
                    >
                      Renew
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trainer Payroll Alerts */}
          <div className="space-y-2 pt-2 border-t border-[#34393e]">
            <div className="flex items-center justify-between text-xs font-extrabold uppercase text-[#8bbcff] tracking-wider px-1">
              <span>Trainer Payroll Review</span>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTrainers();
                }}
                className="text-[11px] text-[#b9f227] hover:underline normal-case"
              >
                View Payroll →
              </button>
            </div>
            <div className="rounded-xl border border-[#2b3644] bg-[#1c232d] p-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <Award className="h-4 w-4 text-[#8bbcff]" />
                <span>Monthly Staff Payroll</span>
              </div>
              <p className="text-[11px] text-[#a4abb2]">
                {trainers.length} active coaches & receptionists. Total monthly commitment: ₹
                {trainers.reduce((acc, t) => acc + t.salary, 0).toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#34393e] bg-[#16181a] p-4 text-center">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-[#34393e] bg-[#202326] py-2 text-xs font-bold text-white hover:bg-[#282c30] transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
