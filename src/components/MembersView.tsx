import React, { useState } from 'react';
import {
  Member,
  Trainer,
  Branch,
  BodybuildingGoal,
  MembershipPlan,
  GymSettings,
  UserAccount,
} from '../types';
import {
  Search,
  Plus,
  Filter,
  Download,
  Camera,
  Upload,
  Sparkles,
  MessageCircle,
  FileText,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Dumbbell,
  Scale,
  X,
  Layers,
} from 'lucide-react';

interface MembersViewProps {
  members: Member[];
  trainers: Trainer[];
  branches: Branch[];
  settings: GymSettings;
  selectedBranch: string;
  currentUser: UserAccount;
  onSaveMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onSeedScaleMembers: () => void;
  onOpenAiWorkout: (member: Member) => void;
  onOpenWhatsApp: (member: Member) => void;
  onOpenBillForMember: (member: Member) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  trainers,
  branches,
  settings,
  selectedBranch,
  currentUser,
  onSaveMember,
  onDeleteMember,
  onSeedScaleMembers,
  onOpenAiWorkout,
  onOpenWhatsApp,
  onOpenBillForMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBranch, setFormBranch] = useState(
    selectedBranch === 'all' ? 'Central Branch' : selectedBranch
  );
  const [formPlan, setFormPlan] = useState<MembershipPlan>('Monthly (₹1,500)');
  const [formTrainerName, setFormTrainerName] = useState('Vikram Rathore');
  const [formWeight, setFormWeight] = useState<number>(75);
  const [formHeight, setFormHeight] = useState<number>(175);
  const [formGoal, setFormGoal] = useState<BodybuildingGoal>('Classic Physique');
  const [formJoinedDate, setFormJoinedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [formPaidAmount, setFormPaidAmount] = useState<number>(1500);
  const [formTotalFee, setFormTotalFee] = useState<number>(1500);
  const [formEmergency, setFormEmergency] = useState('');
  const [formMedical, setFormMedical] = useState('');
  const [formPhoto, setFormPhoto] = useState<string>('');

  // Auto calculate fee on plan change
  const handlePlanChange = (plan: MembershipPlan) => {
    setFormPlan(plan);
    let fee = 1500;
    if (plan.includes('4,200')) fee = 4200;
    else if (plan.includes('7,500')) fee = 7500;
    else if (plan.includes('13,500')) fee = 13500;
    else if (plan.includes('3,500')) fee = 3500;
    else if (plan.includes('18,000')) fee = 18000;
    setFormTotalFee(fee);
    setFormPaidAmount(fee);
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormBranch(selectedBranch === 'all' ? 'Central Branch' : selectedBranch);
    setFormPlan('Monthly (₹1,500)');
    setFormTotalFee(1500);
    setFormPaidAmount(1500);
    setFormWeight(75);
    setFormHeight(175);
    setFormGoal('Classic Physique');
    setFormJoinedDate(new Date().toISOString().slice(0, 10));
    setFormEmergency('');
    setFormMedical('');
    setFormPhoto('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormName(m.name);
    setFormPhone(m.phone);
    setFormEmail(m.email);
    setFormBranch(m.branch);
    setFormPlan(m.plan as MembershipPlan);
    setFormTrainerName(m.trainerName);
    setFormWeight(m.weight);
    setFormHeight(m.height || 175);
    setFormGoal(m.bodybuildingGoal);
    setFormJoinedDate(m.joinedDate);
    setFormTotalFee(m.totalFee);
    setFormPaidAmount(m.paidAmount);
    setFormEmergency(m.emergencyContact || '');
    setFormMedical(m.medicalNotes || '');
    setFormPhoto(m.photoUrl || '');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto expiry calculation based on plan
    let days = 30;
    if (formPlan.includes('Quarterly')) days = 90;
    else if (formPlan.includes('Half-Yearly')) days = 180;
    else if (formPlan.includes('Annual') || formPlan.includes('18,000')) days = 365;

    const start = new Date(formJoinedDate);
    const exp = new Date(start);
    exp.setDate(exp.getDate() + days);

    const paid = Number(formPaidAmount || 0);
    const total = Number(formTotalFee || 0);
    const due = Math.max(0, total - paid);

    let status: Member['status'] = 'Active';
    if (exp < new Date()) status = 'Expired';
    else if (due > 0) status = 'Due';

    const memberToSave: Member = {
      id: editingMember ? editingMember.id : `m_${Date.now()}`,
      memberCode: editingMember
        ? editingMember.memberCode
        : `IC-${formBranch.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      branch: formBranch,
      plan: formPlan,
      joinedDate: formJoinedDate,
      expiryDate: exp.toISOString().slice(0, 10),
      status,
      totalFee: total,
      paidAmount: paid,
      dueAmount: due,
      trainerName: formTrainerName,
      weight: Number(formWeight || 70),
      height: Number(formHeight || 170),
      bodybuildingGoal: formGoal,
      photoUrl: formPhoto,
      emergencyContact: formEmergency.trim(),
      medicalNotes: formMedical.trim(),
    };

    onSaveMember(memberToSave);
    setIsModalOpen(false);
  };

  // Filter members
  const filtered = members
    .filter((m) => selectedBranch === 'all' || m.branch === selectedBranch)
    .filter((m) => {
      const query = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(query) ||
        m.phone.toLowerCase().includes(query) ||
        m.memberCode.toLowerCase().includes(query) ||
        m.bodybuildingGoal.toLowerCase().includes(query)
      );
    })
    .filter((m) => {
      if (statusFilter === 'all') return true;
      return m.status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter((m) => {
      if (goalFilter === 'all') return true;
      return m.bodybuildingGoal === goalFilter;
    });

  const canEdit = currentUser.role === 'Gym Owner' || currentUser.role === 'Receptionist';

  return (
    <div className="space-y-5">
      {/* Header and 500 Capacity Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">Member Roster</h2>
            <span className="rounded-full bg-[#2b3328] px-2.5 py-0.5 text-xs font-black text-[#b9f227]">
              {members.length} / {settings.maxMembersLimit} Capacity
            </span>
          </div>
          <p className="text-xs text-[#a4abb2] mt-0.5">
            Complete member records, bodybuilding categories, photos & payment status stored locally.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {members.length < 500 && (
            <button
              onClick={onSeedScaleMembers}
              className="flex items-center gap-1.5 rounded-xl border border-[#34393e] bg-[#282c30] px-3 py-2 text-xs font-bold text-white hover:bg-[#34393e] transition"
              title="Add 40 Realistic Members to scale up towards 500 capacity"
            >
              <Layers className="h-3.5 w-3.5 text-[#b9f227]" />
              Scale +40 Members
            </button>
          )}

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-xl bg-[#b9f227] px-4 py-2 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a4abb2]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, member ID, bodybuilding goal..."
            className="w-full rounded-xl border border-[#3a4045] bg-[#202326] pl-9 pr-4 py-2 text-xs text-white placeholder-[#747d84] focus:border-[#b9f227] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#3a4045] bg-[#202326] px-3 py-2 text-xs font-semibold text-white focus:border-[#b9f227] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="due">Fees Due</option>
          <option value="expiring">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>

        <select
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          className="rounded-xl border border-[#3a4045] bg-[#202326] px-3 py-2 text-xs font-semibold text-white focus:border-[#b9f227] focus:outline-none"
        >
          <option value="all">All Goals</option>
          <option value="Classic Physique">Classic Physique</option>
          <option value="Hypertrophy / Muscle Building">Hypertrophy / Muscle</option>
          <option value="Men's Physique">Men's Physique</option>
          <option value="Weight Loss & Shred">Weight Loss & Shred</option>
          <option value="Powerlifting & Strength">Powerlifting</option>
        </select>
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-2xl border border-[#34393e] bg-[#202326] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#34393e] bg-[#24282c] text-[#a4abb2]">
              <tr>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Member</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Goal & Weight</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Branch / Trainer</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Plan & Validity</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Balance Due</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#34393e]">
              {filtered.map((m) => {
                const initials = m.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                const bmi = m.height
                  ? (m.weight / Math.pow(m.height / 100, 2)).toFixed(1)
                  : null;

                return (
                  <tr key={m.id} className="hover:bg-[#25292d] transition">
                    {/* Member Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="h-9 w-9 rounded-xl object-cover border border-[#34393e]"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#39432c] text-[#b9f227] font-black text-xs">
                            {initials}
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-white block leading-tight">
                            {m.name}
                          </span>
                          <span className="text-[11px] text-[#a4abb2] block">
                            {m.phone} · <span className="text-[#747d84]">{m.memberCode}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Bodybuilding Goal & Weight */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="inline-block rounded bg-[#2b3328] px-2 py-0.5 text-[10px] font-extrabold text-[#b9f227]">
                          {m.bodybuildingGoal}
                        </span>
                        <div className="text-[11px] text-[#a4abb2] flex items-center gap-2">
                          <span>
                            ⚖ <strong>{m.weight} kg</strong>
                          </span>
                          {bmi && <span>BMI: {bmi}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Branch & Trainer */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-white block">{m.branch}</span>
                        <span className="text-[11px] text-[#a4abb2]">
                          Coach: {m.trainerName || 'Unassigned'}
                        </span>
                      </div>
                    </td>

                    {/* Plan & Expiry */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{m.plan}</span>
                        <span className="text-[11px] text-[#a4abb2]">
                          Exp: {m.expiryDate}
                        </span>
                      </div>
                    </td>

                    {/* Balance Due */}
                    <td className="py-3 px-4">
                      {m.dueAmount > 0 ? (
                        <div>
                          <span className="font-black text-[#ff9292] block">
                            ₹{m.dueAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#a4abb2]">
                            Paid: ₹{m.paidAmount}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-[#81cf69]">
                          Cleared (₹0)
                        </span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          m.status === 'Active'
                            ? 'bg-[#213523] text-[#81cf69]'
                            : m.status === 'Expiring'
                            ? 'bg-[#3b3020] text-[#ffc56b]'
                            : m.status === 'Due'
                            ? 'bg-[#3d2525] text-[#ff9292]'
                            : 'bg-[#34393e] text-[#a4abb2]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Gemini AI Workout Plan */}
                        <button
                          onClick={() => onOpenAiWorkout(m)}
                          className="rounded-lg p-1.5 text-[#b9f227] hover:bg-[#343e26] transition"
                          title="Generate AI Workout & Diet Routine with Gemini"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>

                        {/* WhatsApp Reminder if Due */}
                        {m.dueAmount > 0 && (
                          <button
                            onClick={() => onOpenWhatsApp(m)}
                            className="rounded-lg p-1.5 text-[#25d366] hover:bg-[#25d366]/20 transition"
                            title="Send WhatsApp Payment Reminder"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        )}

                        {/* View & Invoice */}
                        <button
                          onClick={() => setViewingMember(m)}
                          className="rounded-lg p-1.5 text-[#a4abb2] hover:text-white hover:bg-[#34393e] transition"
                          title="View Profile Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="rounded-lg p-1.5 text-[#a4abb2] hover:text-white hover:bg-[#34393e] transition"
                            title="Edit Member"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}

                        {currentUser.role === 'Gym Owner' && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove member "${m.name}"?`)) {
                                onDeleteMember(m.id);
                              }
                            }}
                            className="rounded-lg p-1.5 text-[#a4abb2] hover:text-[#ff9292] hover:bg-[#3d2525] transition"
                            title="Delete Member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#a4abb2]">
                    No members match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Member Profile Drawer/Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#34393e] bg-[#202326] p-6 shadow-2xl text-[#f4f5f6]">
            <div className="flex items-start justify-between pb-4 border-b border-[#34393e]">
              <div className="flex items-center gap-3">
                {viewingMember.photoUrl ? (
                  <img
                    src={viewingMember.photoUrl}
                    alt={viewingMember.name}
                    className="h-14 w-14 rounded-2xl object-cover border border-[#34393e]"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#39432c] text-[#b9f227] font-black text-xl">
                    {viewingMember.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-white">{viewingMember.name}</h3>
                  <p className="text-xs text-[#a4abb2]">{viewingMember.phone} · {viewingMember.memberCode}</p>
                  <span className="inline-block mt-1 rounded bg-[#2b3328] px-2 py-0.5 text-[10px] font-extrabold text-[#b9f227]">
                    {viewingMember.bodybuildingGoal}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#34393e] bg-[#282c30] p-3">
                  <span className="text-[10px] text-[#a4abb2] uppercase font-bold">Body Metrics</span>
                  <p className="font-extrabold text-white mt-1">Weight: {viewingMember.weight} kg</p>
                  <p className="text-[#a4abb2]">Height: {viewingMember.height || '175'} cm</p>
                </div>
                <div className="rounded-xl border border-[#34393e] bg-[#282c30] p-3">
                  <span className="text-[10px] text-[#a4abb2] uppercase font-bold">Fee Account</span>
                  <p className="font-extrabold text-white mt-1">Total: ₹{viewingMember.totalFee}</p>
                  <p className={viewingMember.dueAmount > 0 ? 'text-[#ff9292] font-bold' : 'text-[#81cf69]'}>
                    Due: ₹{viewingMember.dueAmount}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#34393e] bg-[#282c30] p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#a4abb2]">Branch:</span>
                  <strong className="text-white">{viewingMember.branch}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a4abb2]">Trainer:</span>
                  <strong className="text-white">{viewingMember.trainerName || 'Unassigned'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a4abb2]">Joined Date:</span>
                  <span className="text-white">{viewingMember.joinedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a4abb2]">Expiry Date:</span>
                  <strong className="text-[#b9f227]">{viewingMember.expiryDate}</strong>
                </div>
                {viewingMember.medicalNotes && (
                  <div className="pt-2 border-t border-[#34393e]">
                    <span className="text-[#a4abb2]">Medical / Injury Notes:</span>
                    <p className="text-white mt-0.5">{viewingMember.medicalNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-[#34393e]">
              <button
                onClick={() => {
                  setViewingMember(null);
                  onOpenAiWorkout(viewingMember);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#b9f227] py-2 text-xs font-black text-[#151719] hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" />
                AI Workout Routine
              </button>
              {viewingMember.dueAmount > 0 && (
                <button
                  onClick={() => {
                    setViewingMember(null);
                    onOpenWhatsApp(viewingMember);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#25d366]/20 border border-[#25d366]/40 px-3 py-2 text-xs font-bold text-[#25d366] hover:bg-[#25d366]/30"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </button>
              )}
              <button
                onClick={() => setViewingMember(null)}
                className="rounded-xl border border-[#34393e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#282c30]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#34393e] bg-[#202326] p-6 shadow-2xl text-[#f4f5f6]">
            <div className="flex items-center justify-between pb-4 border-b border-[#34393e]">
              <h3 className="text-base font-extrabold text-white">
                {editingMember ? 'Edit Gym Member' : 'Register New Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="pt-4 space-y-4 text-xs">
              {/* Photo Upload & Preview */}
              <div className="flex items-center gap-4 rounded-xl border border-[#34393e] bg-[#282c30] p-3">
                {formPhoto ? (
                  <img
                    src={formPhoto}
                    alt="Member Preview"
                    className="h-16 w-16 rounded-xl object-cover border border-[#b9f227]"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#39432c] text-[#b9f227] font-black">
                    <Camera className="h-6 w-6" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="font-bold text-white block">Member Photo (Stored Locally)</span>
                  <p className="text-[11px] text-[#a4abb2]">
                    Upload photo or take picture from mobile camera
                  </p>
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#3a4045] bg-[#202326] px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer hover:border-[#b9f227] transition">
                    <Upload className="h-3.5 w-3.5 text-[#b9f227]" />
                    <span>Choose Photo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mohammed Junaid"
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. 98765 01234"
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Email (Optional)</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="member@gmail.com"
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Gym Branch *</label>
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

              {/* Fitness & Bodybuilding Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-[#34393e]">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Current Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Height (cm)</label>
                  <input
                    type="number"
                    value={formHeight}
                    onChange={(e) => setFormHeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Chosen Bodybuilding Goal *</label>
                  <select
                    value={formGoal}
                    onChange={(e) => setFormGoal(e.target.value as BodybuildingGoal)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    <option value="Classic Physique">Classic Physique</option>
                    <option value="Hypertrophy / Muscle Building">Hypertrophy / Muscle</option>
                    <option value="Men's Physique">Men's Physique</option>
                    <option value="Weight Loss & Shred">Weight Loss & Shred</option>
                    <option value="Powerlifting & Strength">Powerlifting & Strength</option>
                    <option value="General Fitness & Stamina">General Fitness</option>
                    <option value="Crossfit & Conditioning">Crossfit & Conditioning</option>
                  </select>
                </div>
              </div>

              {/* Plan, Fee & Trainer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-[#34393e]">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Membership Plan *</label>
                  <select
                    value={formPlan}
                    onChange={(e) => handlePlanChange(e.target.value as MembershipPlan)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    <option value="Monthly (₹1,500)">Monthly (₹1,500)</option>
                    <option value="Quarterly (₹4,200)">Quarterly (₹4,200)</option>
                    <option value="Half-Yearly (₹7,500)">Half-Yearly (₹7,500)</option>
                    <option value="Annual (₹13,500)">Annual (₹13,500)</option>
                    <option value="Personal Training (₹3,500/mo)">Personal Training (₹3,500/mo)</option>
                    <option value="VIP All-Branch Pass (₹18,000/yr)">VIP All-Branch Pass (₹18,000/yr)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Assigned Trainer</label>
                  <select
                    value={formTrainerName}
                    onChange={(e) => setFormTrainerName(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    {trainers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.branch})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={formJoinedDate}
                    onChange={(e) => setFormJoinedDate(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>
              </div>

              {/* Fee Paid Today & Due Calculation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-xl border border-[#34393e] bg-[#282c30] p-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-white">Fee Paid Today (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Outstanding Due (Auto-calculated)</label>
                  <div className="h-9 flex items-center px-3 rounded-lg border border-[#3a4045] bg-[#1b1d20] text-xs font-black text-[#ff9292]">
                    ₹{Math.max(0, formTotalFee - formPaidAmount).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Medical / Injury Notes (Optional)</label>
                <input
                  type="text"
                  value={formMedical}
                  onChange={(e) => setFormMedical(e.target.value)}
                  placeholder="e.g. Mild shoulder pain, avoid behind-the-neck presses"
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
                  {editingMember ? 'Save Changes' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
