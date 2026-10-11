import React, { useState } from 'react';
import { UserAccount, Role } from '../types';
import { Shield, KeyRound, Mail, User, Check, Smartphone, Sparkles, X, Plus, LogOut } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
  onUpdateUsers: (users: UserAccount[]) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
  onUpdateUsers,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<Role>('Gym Owner');
  const [editPhone, setEditPhone] = useState('');
  const [editBranch, setEditBranch] = useState('Central Branch');
  const [editPin, setEditPin] = useState('1234');
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [googleLoginInput, setGoogleLoginInput] = useState('');
  const [pinPromptUser, setPinPromptUser] = useState<UserAccount | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (user: UserAccount, index: number) => {
    setSelectedSlotIndex(index);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPhone(user.phone);
    setEditBranch(user.branch);
    setEditPin(user.pin || '1234');
    setView('edit');
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlotIndex === null) return;

    const initials = editName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'US';

    const updated = [...users];
    updated[selectedSlotIndex] = {
      ...updated[selectedSlotIndex],
      name: editName.trim(),
      email: editEmail.trim(),
      role: editRole,
      phone: editPhone.trim(),
      branch: editBranch,
      pin: editPin.trim() || '1234',
      avatarText: initials,
    };

    onUpdateUsers(updated);
    if (currentUser.id === updated[selectedSlotIndex].id) {
      onSelectUser(updated[selectedSlotIndex]);
    }
    setView('list');
  };

  const handleGoogleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleLoginInput.trim()) return;

    const email = googleLoginInput.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === email);

    if (existing) {
      onSelectUser(existing);
      onClose();
    } else {
      // Find first unassigned or assign to slot
      alert(
        `Gmail "${email}" is not currently in the 10 authorized staff slots. As Owner, you can edit any of the 10 slots below to link this Gmail address.`
      );
    }
  };

  const handleLoginClick = (user: UserAccount) => {
    // Instant switch or PIN check
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#34393e] bg-[#202326] shadow-2xl text-[#f4f5f6]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#34393e] px-6 py-4 bg-[#181a1d]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b9f227] text-[#151719] font-black text-lg">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">10 Authorized Users & Google Login</h2>
              <p className="text-xs text-[#a4abb2]">
                Registered Gmail accounts with role permissions (Owner, Trainer, Receptionist, Member)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#a4abb2] hover:bg-[#282c30] hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active Account Banner */}
        <div className="border-b border-[#34393e] bg-[#1a1d20] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3a4823] text-[#b9f227] font-extrabold text-xs">
              {currentUser.avatarText}
            </div>
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-2">
                Active Session: {currentUser.name}
                <span className="rounded bg-[#2b3328] px-2 py-0.5 text-[10px] font-black text-[#b9f227]">
                  {currentUser.role}
                </span>
              </span>
              <p className="text-[11px] text-[#a4abb2]">
                {currentUser.email} · {currentUser.branch}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[#81cf69] flex items-center gap-1 font-semibold">
            <Check className="h-3 w-3" /> Logged In
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {view === 'list' && (
            <>
              {/* Google Fast Sign In box */}
              <form onSubmit={handleGoogleQuickLogin} className="rounded-xl border border-[#34393e] bg-[#282c30] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google Account</span>
                  </div>
                  <span className="text-[10px] text-[#a4abb2]">Up to 10 authorized users</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={googleLoginInput}
                    onChange={(e) => setGoogleLoginInput(e.target.value)}
                    placeholder="Enter Gmail (e.g. mohammedjunaid3550@gmail.com)"
                    className="flex-1 rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white placeholder-[#747d84] focus:border-[#b9f227] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#b9f227] px-4 py-2 text-xs font-bold text-[#151719] hover:brightness-110 transition"
                  >
                    Login
                  </button>
                </div>
              </form>

              {/* 10 Authorized Accounts Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#a4abb2]">
                    10 Authorized Staff & Management Slots ({users.length}/10)
                  </h3>
                  <span className="text-[11px] text-[#b9f227] font-semibold">
                    Owner can edit any slot
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {users.map((u, idx) => {
                    const isCurrent = currentUser.id === u.id;
                    return (
                      <div
                        key={u.id}
                        className={`rounded-xl border p-3.5 transition flex flex-col justify-between ${
                          isCurrent
                            ? 'border-[#b9f227] bg-[#242921]'
                            : 'border-[#34393e] bg-[#282c30] hover:border-[#4f565d]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#39432c] text-[#b9f227] font-extrabold text-xs">
                              {u.avatarText}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-white leading-tight">
                                  {idx + 1}. {u.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#a4abb2] block truncate max-w-[150px]">
                                {u.email}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                              u.role === 'Gym Owner'
                                ? 'bg-[#3b3020] text-[#ffc56b]'
                                : u.role === 'Trainer'
                                ? 'bg-[#202f42] text-[#8bbcff]'
                                : u.role === 'Receptionist'
                                ? 'bg-[#2b3328] text-[#b9f227]'
                                : 'bg-[#332a38] text-[#d696fc]'
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>

                        <div className="text-[10px] text-[#a4abb2] mb-3 flex items-center justify-between">
                          <span>⌂ {u.branch}</span>
                          <span>☎ {u.phone}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-[#34393e]/60">
                          <button
                            onClick={() => handleLoginClick(u)}
                            className={`flex-1 rounded-lg py-1.5 text-[11px] font-bold transition ${
                              isCurrent
                                ? 'bg-[#b9f227] text-[#151719]'
                                : 'bg-[#34393e] text-white hover:bg-[#434a50]'
                            }`}
                          >
                            {isCurrent ? 'Current User ✓' : 'Switch & Login'}
                          </button>
                          <button
                            onClick={() => handleStartEdit(u, idx)}
                            className="rounded-lg border border-[#3a4045] px-2.5 py-1.5 text-[11px] font-semibold text-[#a4abb2] hover:text-white hover:bg-[#34393e] transition"
                            title="Edit User Profile & Gmail"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {view === 'edit' && selectedSlotIndex !== null && (
            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#34393e]">
                <h3 className="font-extrabold text-sm text-white">
                  Customize User Slot #{selectedSlotIndex + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="text-xs text-[#b9f227] hover:underline"
                >
                  ← Back to Users List
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a4abb2]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a4abb2]">Google Gmail ID *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a4abb2]">Allocated Role *</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as Role)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    <option value="Gym Owner">Gym Owner (Full ERP Control)</option>
                    <option value="Trainer">Trainer (Workout, Diet & Members)</option>
                    <option value="Receptionist">Receptionist (Check-in, Payments & Desk)</option>
                    <option value="Member">Member (View Only)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a4abb2]">Branch Scope *</label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Central Branch">Central Branch</option>
                    <option value="North Branch">North Branch</option>
                    <option value="South Branch">South Branch</option>
                    <option value="West Branch">West Branch</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a4abb2]">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#a4abb2]">Login PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#34393e]">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="rounded-lg border border-[#3a4045] px-4 py-2 text-xs font-semibold text-white hover:bg-[#34393e] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#b9f227] px-5 py-2 text-xs font-bold text-[#151719] hover:brightness-110 transition"
                >
                  Save User Slot
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
