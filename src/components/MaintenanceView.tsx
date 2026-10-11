import React, { useState } from 'react';
import { ExpenseRecord, Branch, ExpenseCategory, UserAccount } from '../types';
import {
  Wrench,
  Zap,
  Plus,
  Search,
  Download,
  Building,
  TrendingDown,
  FileText,
  DollarSign,
  X,
  AlertCircle,
} from 'lucide-react';

interface MaintenanceViewProps {
  expenses: ExpenseRecord[];
  branches: Branch[];
  selectedBranch: string;
  currentUser: UserAccount;
  onAddExpense: (expense: ExpenseRecord) => void;
  onExportCSV: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  expenses,
  branches,
  selectedBranch,
  currentUser,
  onAddExpense,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Electricity / Light Bill');
  const [formBranch, setFormBranch] = useState(
    selectedBranch === 'all' ? 'Central Branch' : selectedBranch
  );
  const [formAmount, setFormAmount] = useState<number>(5000);
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formVendor, setFormVendor] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const scopedExpenses = expenses.filter((e) => {
    if (selectedBranch !== 'all' && e.branch !== selectedBranch) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.vendor.toLowerCase().includes(q) ||
      e.billNo.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  });

  const totalExpense = scopedExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const electricityTotal = scopedExpenses
    .filter((e) => e.category === 'Electricity / Light Bill')
    .reduce((acc, e) => acc + (e.amount || 0), 0);
  const equipmentTotal = scopedExpenses
    .filter((e) => e.category === 'Equipment Repair & Maintenance')
    .reduce((acc, e) => acc + (e.amount || 0), 0);
  const rentTotal = scopedExpenses
    .filter((e) => e.category === 'Gym Rent')
    .reduce((acc, e) => acc + (e.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBillNo = `EXP-${formBranch.slice(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`;

    const newExpense: ExpenseRecord = {
      id: `exp_${Date.now()}`,
      billNo: newBillNo,
      title: formTitle.trim(),
      category: formCategory,
      branch: formBranch,
      amount: Number(formAmount),
      date: formDate,
      vendor: formVendor.trim() || 'Direct Vendor',
      paidBy: currentUser.name,
      notes: formNotes.trim(),
    };

    onAddExpense(newExpense);
    setIsModalOpen(false);
    setFormTitle('');
    setFormVendor('');
    setFormNotes('');
  };

  return (
    <div className="space-y-5">
      {/* Top Expense KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <span className="text-xs font-bold text-[#a4abb2]">Total Maintenance & Bills</span>
          <div className="mt-2 text-xl sm:text-2xl font-black text-[#ff9292]">
            ₹{totalExpense.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#a4abb2] mt-1 block">
            {scopedExpenses.length} bills in {selectedBranch}
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#a4abb2]">Electricity / Light Bills</span>
            <Zap className="h-4 w-4 text-[#ffc56b]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-[#ffc56b]">
            ₹{electricityTotal.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#a4abb2] mt-1 block">
            Commercial power & high-bay gym LED
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#a4abb2]">Equipment Repairs</span>
            <Wrench className="h-4 w-4 text-[#8bbcff]" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-[#8bbcff]">
            ₹{equipmentTotal.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#a4abb2] mt-1 block">
            Treadmills, cables, bench welding
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#a4abb2]">Premises Rent</span>
            <Building className="h-4 w-4 text-white" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-white">
            ₹{rentTotal.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#a4abb2] mt-1 block">
            Monthly commercial leases
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a4abb2]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bill #, title, vendor, category..."
              className="w-full rounded-xl border border-[#3a4045] bg-[#202326] pl-9 pr-4 py-2 text-xs text-white placeholder-[#747d84] focus:border-[#b9f227] focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#3a4045] bg-[#202326] px-3 py-2 text-xs font-semibold text-white focus:border-[#b9f227] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Electricity / Light Bill">Electricity / Light Bill</option>
            <option value="Equipment Repair & Maintenance">Equipment Repair</option>
            <option value="Gym Rent">Gym Rent</option>
            <option value="AC / HVAC Servicing">AC Servicing</option>
            <option value="Cleaning & Housekeeping">Cleaning & Water</option>
            <option value="Trainer & Staff Salary">Staff Salary</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-[#34393e] bg-[#282c30] px-3 py-2 text-xs font-bold text-white hover:bg-[#34393e] transition"
          >
            <Download className="h-4 w-4 text-[#b9f227]" />
            Export Bills CSV
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#b9f227] px-4 py-2 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
          >
            <Plus className="h-4 w-4" />
            Add Expense / Bill
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-hidden rounded-2xl border border-[#34393e] bg-[#202326] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#34393e] bg-[#24282c] text-[#a4abb2]">
              <tr>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Bill #</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Expense Title</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Branch</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Vendor / Dept</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#34393e]">
              {scopedExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-[#25292d] transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">{e.billNo}</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-white block">{e.title}</span>
                    {e.notes && (
                      <span className="text-[10px] text-[#a4abb2] block italic truncate max-w-xs">
                        {e.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded bg-[#282c30] border border-[#3a4045] px-2 py-0.5 text-[10px] font-bold text-[#f4f5f6]">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#a4abb2] font-semibold">{e.branch}</td>
                  <td className="py-3 px-4 text-[#a4abb2]">{e.vendor}</td>
                  <td className="py-3 px-4 text-[#a4abb2]">{e.date}</td>
                  <td className="py-3 px-4 text-right font-black text-sm text-[#ff9292]">
                    ₹{e.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}

              {scopedExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#a4abb2]">
                    No maintenance records found for this branch or category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Maintenance Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#34393e] bg-[#202326] p-6 shadow-2xl text-[#f4f5f6]">
            <div className="flex items-center justify-between pb-4 border-b border-[#34393e]">
              <div>
                <h3 className="text-base font-extrabold text-white">Log Maintenance Expense or Bill</h3>
                <p className="text-xs text-[#a4abb2]">Light bills, repairs, rent and gym operational expenses</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Expense Title / Description *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Electricity Bill - October 2026"
                  className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    <option value="Electricity / Light Bill">Electricity / Light Bill</option>
                    <option value="Equipment Repair & Maintenance">Equipment Repair & Maintenance</option>
                    <option value="Gym Rent">Gym Rent</option>
                    <option value="Trainer & Staff Salary">Trainer & Staff Salary</option>
                    <option value="AC / HVAC Servicing">AC / HVAC Servicing</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Cleaning & Housekeeping">Cleaning & Housekeeping</option>
                    <option value="Supplements & Merchandise">Supplements & Merchandise</option>
                    <option value="Marketing & Promotions">Marketing & Promotions</option>
                    <option value="Other Operational">Other Operational</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-white">Bill Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none font-bold text-base text-[#ff9292]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Bill Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Vendor / Contractor Company</label>
                <input
                  type="text"
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  placeholder="e.g. TSSPDCL Electricity Board / ProFit Gym Equipment"
                  className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Notes & Remarks</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Covered cardio hall duct servicing and capacitor change"
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
                  Save Maintenance Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
