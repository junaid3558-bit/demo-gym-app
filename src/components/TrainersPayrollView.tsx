import React, { useState } from 'react';
import { Trainer, Branch, UserAccount } from '../types';
import { Award, Plus, Phone, Mail, Building2, CheckCircle, Clock, X, DollarSign } from 'lucide-react';

interface TrainersPayrollViewProps {
  trainers: Trainer[];
  branches: Branch[];
  selectedBranch: string;
  currentUser: UserAccount;
  onAddTrainer: (trainer: Trainer) => void;
  onRecordSalary: (trainerId: string, amount: number, branch: string) => void;
}

export const TrainersPayrollView: React.FC<TrainersPayrollViewProps> = ({
  trainers,
  branches,
  selectedBranch,
  currentUser,
  onAddTrainer,
  onRecordSalary,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Senior Strength Coach');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBranch, setFormBranch] = useState(
    selectedBranch === 'all' ? 'Central Branch' : selectedBranch
  );
  const [formSalary, setFormSalary] = useState<number>(28000);
  const [formSpecialization, setFormSpecialization] = useState('Classic Physique & Hypertrophy');

  const scopedTrainers = trainers.filter(
    (t) => selectedBranch === 'all' || t.branch === selectedBranch
  );

  const totalPayroll = scopedTrainers.reduce((acc, t) => acc + (t.salary || 0), 0);
  const totalAssigned = scopedTrainers.reduce((acc, t) => acc + (t.assignedMembers || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrainer: Trainer = {
      id: `tr_${Date.now()}`,
      name: formName.trim(),
      role: formRole.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@ironcore.com`,
      branch: formBranch,
      salary: Number(formSalary),
      status: 'Present',
      assignedMembers: 0,
      specialization: formSpecialization.trim(),
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    onAddTrainer(newTrainer);
    setIsModalOpen(false);
    setFormName('');
    setFormPhone('');
  };

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <span className="text-xs font-bold text-[#a4abb2]">Active Staff & Coaches</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white">
            {scopedTrainers.length} Trainers
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Across {selectedBranch}
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <span className="text-xs font-bold text-[#a4abb2]">Monthly Salary Commitment</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#ffc56b]">
            ₹{totalPayroll.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Payroll budget for October 2026
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <span className="text-xs font-bold text-[#a4abb2]">Assigned Member Clients</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#b9f227]">
            {totalAssigned} Members
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Personal & specialized bodybuilding coaching
          </span>
        </div>
      </div>

      {/* Header and Add Trainer button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white">Coaching Staff & Trainer Profiles</h3>
          <p className="text-xs text-[#a4abb2]">Assign members, track attendance, and clear monthly salaries</p>
        </div>

        {currentUser.role === 'Gym Owner' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#b9f227] px-4 py-2 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
          >
            <Plus className="h-4 w-4" />
            Add Trainer
          </button>
        )}
      </div>

      {/* Trainer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scopedTrainers.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#39432c] text-[#b9f227] font-black text-sm">
                    {t.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{t.name}</h4>
                    <span className="text-[11px] text-[#a4abb2] block">{t.role}</span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    t.status === 'Present'
                      ? 'bg-[#213523] text-[#81cf69]'
                      : 'bg-[#3b3020] text-[#ffc56b]'
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#a4abb2]">Specialization:</span>
                  <span className="font-bold text-[#b9f227] text-right truncate max-w-[150px]">
                    {t.specialization}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a4abb2]">Branch:</span>
                  <span className="text-white font-semibold">{t.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a4abb2]">Assigned Clients:</span>
                  <span className="text-white font-bold">{t.assignedMembers} members</span>
                </div>
                <div className="flex justify-between border-t border-[#34393e] pt-1.5 mt-1">
                  <span className="text-[#a4abb2]">Monthly Salary:</span>
                  <strong className="text-white text-sm">
                    ₹{t.salary.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#34393e] flex items-center justify-between">
              <span className="text-[11px] text-[#a4abb2]">☎ {t.phone}</span>

              {currentUser.role === 'Gym Owner' && (
                <button
                  onClick={() => {
                    if (confirm(`Record salary payment of ₹${t.salary.toLocaleString('en-IN')} for ${t.name}? This will record as an expense.`)) {
                      onRecordSalary(t.id, t.salary, t.branch);
                    }
                  }}
                  className="rounded-lg bg-[#b9f227] px-3 py-1.5 text-[11px] font-black text-[#151719] hover:brightness-110 transition"
                >
                  Clear Salary
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Trainer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#34393e] bg-[#202326] p-6 shadow-2xl text-[#f4f5f6]">
            <div className="flex items-center justify-between pb-4 border-b border-[#34393e]">
              <h3 className="text-base font-extrabold text-white">Add Trainer or Staff Member</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Branch *</label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Monthly Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formSalary}
                    onChange={(e) => setFormSalary(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Bodybuilding Specialization</label>
                <input
                  type="text"
                  value={formSpecialization}
                  onChange={(e) => setFormSpecialization(e.target.value)}
                  placeholder="e.g. Classic Physique & Powerlifting"
                  className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                />
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
                  Add Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
