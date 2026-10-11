import React, { useState } from 'react';
import { Branch, Member, PaymentRecord, ExpenseRecord, Trainer, UserAccount } from '../types';
import { Building2, Plus, MapPin, Phone, Users, TrendingUp, DollarSign, QrCode, X } from 'lucide-react';

interface BranchesViewProps {
  branches: Branch[];
  members: Member[];
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  trainers: Trainer[];
  currentUser: UserAccount;
  onSelectBranch: (branchName: string) => void;
  onAddBranch: (branch: Branch) => void;
}

export const BranchesView: React.FC<BranchesViewProps> = ({
  branches,
  members,
  payments,
  expenses,
  trainers,
  currentUser,
  onSelectBranch,
  onAddBranch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [manager, setManager] = useState('');
  const [upi, setUpi] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: Branch = {
      id: `b_${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `BR-0${branches.length + 1}`,
      address: address.trim(),
      phone: phone.trim(),
      managerName: manager.trim(),
      upiId: upi.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@upi`,
    };
    onAddBranch(newB);
    setIsModalOpen(false);
    setName('');
    setAddress('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Gym Branches (4 Locations)</h2>
          <p className="text-xs text-[#a4abb2]">
            Multi-branch management with dedicated UPI IDs, staffing and physical member rosters
          </p>
        </div>

        {currentUser.role === 'Gym Owner' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#b9f227] px-4 py-2 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </button>
        )}
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => {
          const bMembers = members.filter((m) => m.branch === b.name);
          const bPayments = payments.filter((p) => p.branch === b.name);
          const bExpenses = expenses.filter((e) => e.branch === b.name);
          const bStaff = trainers.filter((t) => t.branch === b.name);

          const totalRev = bPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
          const totalExp = bExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
          const net = totalRev - totalExp;

          return (
            <div
              key={b.id}
              className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#30382a] text-[#b9f227] text-xl font-black">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-white">{b.name}</h3>
                        <span className="rounded bg-[#282c30] px-1.5 py-0.5 text-[10px] font-mono text-[#a4abb2]">
                          {b.code}
                        </span>
                      </div>
                      <p className="text-xs text-[#a4abb2] flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-[#b9f227]" />
                        {b.address}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#213523] px-2.5 py-0.5 text-[10px] font-extrabold text-[#81cf69]">
                    Active
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-2.5">
                    <span className="text-[10px] text-[#a4abb2] block">Members</span>
                    <strong className="text-sm font-black text-white">{bMembers.length}</strong>
                  </div>
                  <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-2.5">
                    <span className="text-[10px] text-[#a4abb2] block">Collections</span>
                    <strong className="text-sm font-black text-[#b9f227]">
                      ₹{totalRev.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-2.5">
                    <span className="text-[10px] text-[#a4abb2] block">Bills & Exp</span>
                    <strong className="text-sm font-black text-[#ff9292]">
                      ₹{totalExp.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-2.5">
                    <span className="text-[10px] text-[#a4abb2] block">Coaches</span>
                    <strong className="text-sm font-black text-white">{bStaff.length} Staff</strong>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#a4abb2]">
                  <span>Manager: <strong className="text-white">{b.managerName}</strong></span>
                  <span className="flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-[#b9f227]" />
                    UPI: <strong className="text-[#b9f227]">{b.upiId}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#34393e] flex items-center justify-between">
                <span className="text-xs font-bold text-[#81cf69]">
                  Net Operating Margin: ₹{net.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => onSelectBranch(b.name)}
                  className="rounded-xl bg-[#b9f227] px-4 py-1.5 text-xs font-black text-[#151719] hover:brightness-110 transition"
                >
                  Filter View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#34393e] bg-[#202326] p-6 shadow-2xl text-[#f4f5f6]">
            <div className="flex items-center justify-between pb-4 border-b border-[#34393e]">
              <h3 className="text-base font-extrabold text-white">Add New Gym Branch Location</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Branch Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. East Branch"
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Branch Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="EB-05"
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Full Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 10, Ring Road, Hyderabad"
                  className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Manager Name</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="Branch Manager"
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Branch UPI ID</label>
                  <input
                    type="text"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    placeholder="ironcore.east@upi"
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#34393e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#3a4045] px-4 py-2 text-xs font-semibold text-white hover:bg-[#282c30]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#b9f227] px-6 py-2 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
