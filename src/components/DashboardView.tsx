import React from 'react';
import {
  Member,
  PaymentRecord,
  ExpenseRecord,
  Trainer,
  Branch,
  GymSettings,
} from '../types';
import {
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Award,
  Plus,
  UserCheck,
  Wrench,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface DashboardViewProps {
  members: Member[];
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  trainers: Trainer[];
  branches: Branch[];
  settings: GymSettings;
  selectedBranch: string;
  onNavigate: (page: string) => void;
  onOpenAddMember: () => void;
  onOpenAddPayment: () => void;
  onOpenAddExpense: () => void;
  onOpenWhatsApp: (member: Member) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  members,
  payments,
  expenses,
  trainers,
  branches,
  settings,
  selectedBranch,
  onNavigate,
  onOpenAddMember,
  onOpenAddPayment,
  onOpenAddExpense,
  onOpenWhatsApp,
}) => {
  // Scoped calculation based on selected branch
  const scopedMembers =
    selectedBranch === 'all'
      ? members
      : members.filter((m) => m.branch === selectedBranch);

  const scopedPayments =
    selectedBranch === 'all'
      ? payments
      : payments.filter((p) => p.branch === selectedBranch);

  const scopedExpenses =
    selectedBranch === 'all'
      ? expenses
      : expenses.filter((e) => e.branch === selectedBranch);

  const scopedTrainers =
    selectedBranch === 'all'
      ? trainers
      : trainers.filter((t) => t.branch === selectedBranch);

  // Financial Computations
  const totalCollections = scopedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalExpenses = scopedExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const trainerSalariesTotal = scopedTrainers.reduce((acc, t) => acc + (t.salary || 0), 0);
  const totalOutflow = totalExpenses + trainerSalariesTotal;
  const netProfit = totalCollections - totalOutflow;

  // Member metrics
  const activeMembersCount = scopedMembers.filter(
    (m) => m.status === 'Active' || m.status === 'Expiring'
  ).length;
  const dueMembers = scopedMembers.filter((m) => (m.dueAmount || 0) > 0);
  const totalOutstandingDues = scopedMembers.reduce(
    (acc, m) => acc + (m.dueAmount || 0),
    0
  );

  // New joins this month
  const currentMonthStr = '2026-10';
  const newJoinsThisMonth = scopedMembers.filter(
    (m) => m.joinedDate && m.joinedDate.startsWith(currentMonthStr)
  ).length;

  // Weekly collection bars (illustrative/dynamic representation)
  const barHeights = [45, 65, 52, 85, 60, 95, 75];
  const barDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#34393e] bg-gradient-to-r from-[#202326] via-[#24282c] to-[#1c1f21] p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-[#b9f227] animate-ping" />
            <span className="text-xs font-bold text-[#b9f227] tracking-wider uppercase">
              {selectedBranch === 'all' ? 'All 4 Gym Branches' : selectedBranch}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            IronCore Executive Control
          </h2>
          <p className="text-xs text-[#a4abb2] mt-0.5">
            Real-time physical storage sync · {scopedMembers.length} members loaded (500 max capacity)
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddMember}
            className="flex items-center gap-1.5 rounded-xl bg-[#b9f227] px-3.5 py-2.5 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
          <button
            onClick={onOpenAddPayment}
            className="flex items-center gap-1.5 rounded-xl border border-[#3a4823] bg-[#28321d] px-3.5 py-2.5 text-xs font-bold text-[#b9f227] hover:bg-[#313e24] transition"
          >
            <CreditCard className="h-4 w-4" />
            Collect Fee (UPI/Cash)
          </button>
          <button
            onClick={() => onNavigate('ai')}
            className="flex items-center gap-1.5 rounded-xl border border-[#34393e] bg-[#282c30] px-3.5 py-2.5 text-xs font-bold text-white hover:bg-[#34393e] transition"
          >
            <Sparkles className="h-4 w-4 text-[#b9f227]" />
            Ask Gemini AI
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (4 Columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Members */}
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-[#a4abb2]">
            <span className="font-bold">Active Members</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#30382a] text-[#b9f227]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeMembersCount}
            <span className="text-xs text-[#a4abb2] font-semibold ml-1.5">
              / 500 Cap
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#a4abb2]">
            <span>Total registered: {scopedMembers.length}</span>
            <span className="text-[#81cf69] font-bold">+{newJoinsThisMonth} this mo</span>
          </div>
        </div>

        {/* Total Collections / Sales */}
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-[#a4abb2]">
            <span className="font-bold">Fee Collections (Sales)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#30382a] text-[#b9f227]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-[#b9f227] tracking-tight">
            ₹{totalCollections.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#a4abb2]">
            <span>{scopedPayments.length} transactions</span>
            <span className="text-white font-semibold">UPI & Cash</span>
          </div>
        </div>

        {/* Net Profit & Loss */}
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-[#a4abb2]">
            <span className="font-bold">Net Profit / Margin</span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                netProfit >= 0 ? 'bg-[#213523] text-[#81cf69]' : 'bg-[#3b2323] text-[#ff9292]'
              }`}
            >
              {netProfit >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </div>
          </div>
          <div
            className={`mt-3 text-2xl sm:text-3xl font-black tracking-tight ${
              netProfit >= 0 ? 'text-[#81cf69]' : 'text-[#ff9292]'
            }`}
          >
            ₹{netProfit.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#a4abb2]">
            <span>Bills & Salaries: ₹{totalOutflow.toLocaleString('en-IN')}</span>
            <span className="font-bold text-white">
              {totalCollections > 0
                ? `${Math.round((netProfit / totalCollections) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-[#a4abb2]">
            <span className="font-bold">Outstanding Dues</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b2d1f] text-[#ffc56b]">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-[#ffc56b] tracking-tight">
            ₹{totalOutstandingDues.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#a4abb2]">
            <span>{dueMembers.length} members with dues</span>
            <button
              onClick={() => onNavigate('payments')}
              className="text-[#b9f227] font-bold hover:underline"
            >
              Follow-up →
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Visual Graph + Priority Dues Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Collections Chart & P&L Analysis (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Revenue Chart Card */}
          <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-white">Weekly Collections Overview</h3>
                <p className="text-xs text-[#a4abb2]">Daily fee velocity across {selectedBranch}</p>
              </div>
              <span className="rounded-full bg-[#2b3328] px-2.5 py-1 text-[10px] font-extrabold text-[#b9f227]">
                Current Week
              </span>
            </div>

            {/* SVG / HTML Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-[#34393e]">
              {barHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-[#a4abb2] opacity-0 group-hover:opacity-100 transition">
                    ₹{h * 200}
                  </span>
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-[#8cb91c] to-[#b9f227] group-hover:brightness-125 transition-all cursor-pointer shadow-md"
                  />
                  <span className="text-[10px] font-bold text-[#a4abb2]">
                    {barDays[i]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#a4abb2]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#b9f227]" />
                <span>UPI QR Scans: ~72%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span>Cash Receipts: ~28%</span>
              </div>
            </div>
          </div>

          {/* Maintenance & Expenses Breakdown Quick Card */}
          <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-white">Maintenance, Electricity & Outflows</h3>
                <p className="text-xs text-[#a4abb2]">Light bills, equipment servicing, rent & repairs</p>
              </div>
              <button
                onClick={onOpenAddExpense}
                className="flex items-center gap-1 rounded-lg border border-[#3a4045] bg-[#282c30] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#34393e] transition"
              >
                <Plus className="h-3.5 w-3.5" /> Log Bill
              </button>
            </div>

            <div className="space-y-2.5">
              {scopedExpenses.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between rounded-xl border border-[#34393e] bg-[#1d2023] p-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{exp.title}</span>
                    <span className="text-[11px] text-[#a4abb2]">
                      {exp.category} · {exp.date} · Bill #{exp.billNo}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white block">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#ff9292]">Expense</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Priority Follow-ups & Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Members Requiring Urgent Attention */}
          <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-white">Priority Follow-ups</h3>
                <p className="text-xs text-[#a4abb2]">Unpaid fees & expiring memberships</p>
              </div>
              <button
                onClick={() => onNavigate('members')}
                className="text-xs text-[#b9f227] font-bold hover:underline"
              >
                View all ({dueMembers.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {dueMembers.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-[#34393e] bg-[#1d2023] p-3 flex items-center justify-between gap-3 hover:border-[#4f565d] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#39432c] text-[#b9f227] font-extrabold text-xs">
                      {m.name
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{m.name}</h4>
                      <p className="text-[10px] text-[#a4abb2]">
                        {m.branch} · {m.plan}
                      </p>
                      <span className="text-[11px] font-black text-[#ff9292]">
                        Due: ₹{m.dueAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenWhatsApp(m)}
                      className="rounded-lg bg-[#25d366]/20 border border-[#25d366]/30 p-2 text-[#25d366] hover:bg-[#25d366]/30 transition"
                      title="Send WhatsApp payment reminder"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {dueMembers.length === 0 && (
                <div className="py-8 text-center text-xs text-[#a4abb2]">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[#81cf69] mb-2" />
                  <p className="font-bold text-white">All fees are cleared!</p>
                  <span>No outstanding member dues in this branch scope.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Front Desk Shortcuts */}
          <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
            <h3 className="text-sm font-black text-white mb-1">Front Desk Shortcuts</h3>
            <p className="text-xs text-[#a4abb2] mb-3">Daily receptionist & owner actions</p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenAddMember}
                className="flex items-center gap-2 rounded-xl border border-[#34393e] bg-[#282c30] p-3 text-left hover:border-[#b9f227] transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#30382a] text-[#b9f227]">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Add Member</span>
                  <span className="text-[10px] text-[#a4abb2]">Photo & Goal</span>
                </div>
              </button>

              <button
                onClick={onOpenAddPayment}
                className="flex items-center gap-2 rounded-xl border border-[#34393e] bg-[#282c30] p-3 text-left hover:border-[#b9f227] transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#30382a] text-[#b9f227]">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">UPI / Cash Fee</span>
                  <span className="text-[10px] text-[#a4abb2]">Instant Bill</span>
                </div>
              </button>

              <button
                onClick={() => onNavigate('attendance')}
                className="flex items-center gap-2 rounded-xl border border-[#34393e] bg-[#282c30] p-3 text-left hover:border-[#b9f227] transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#30382a] text-[#b9f227]">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Check-in</span>
                  <span className="text-[10px] text-[#a4abb2]">Fast Log</span>
                </div>
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="flex items-center gap-2 rounded-xl border border-[#34393e] bg-[#282c30] p-3 text-left hover:border-[#b9f227] transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#30382a] text-[#b9f227]">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Excel Sheets</span>
                  <span className="text-[10px] text-[#a4abb2]">Backup DB</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
