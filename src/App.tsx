import React, { useState, useEffect } from 'react';
import {
  loadGymDatabase,
  saveGymDatabase,
  getCurrentUser,
  setCurrentUser,
  exportDatabaseBackup,
  importDatabaseBackup,
  downloadCSV,
  seedScaleMembers,
} from './services/storage';
import {
  GymDatabase,
  UserAccount,
  Member,
  PaymentRecord,
  ExpenseRecord,
  AttendanceRecord,
  Trainer,
  Branch,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { MembersView } from './components/MembersView';
import { PaymentsView } from './components/PaymentsView';
import { AttendanceView } from './components/AttendanceView';
import { MaintenanceView } from './components/MaintenanceView';
import { TrainersPayrollView } from './components/TrainersPayrollView';
import { BranchesView } from './components/BranchesView';
import { AiAssistantView } from './components/AiAssistantView';
import { ReportsExportView } from './components/ReportsExportView';
import { AuthModal } from './components/AuthModal';
import { InstallApkModal } from './components/InstallApkModal';
import { ReceiptModal } from './components/ReceiptModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

export default function App() {
  const [db, setDb] = useState<GymDatabase>(() => loadGymDatabase());
  const [currentUser, setCurrUser] = useState<UserAccount>(() =>
    getCurrentUser(db.users)
  );
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<PaymentRecord | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Preselections for AI
  const [aiPreselectedMember, setAiPreselectedMember] = useState<Member | null>(null);

  // Connectivity
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const updateDatabase = (updater: (prev: GymDatabase) => GymDatabase) => {
    setDb((prev: GymDatabase) => {
      const next = updater(prev);
      saveGymDatabase(next);
      return next;
    });
  };

  // 10 Users Update
  const handleUpdateUsers = (newUsers: UserAccount[]) => {
    updateDatabase((prev) => ({
      ...prev,
      users: newUsers,
    }));
    showToast('User accounts & roles updated');
  };

  const handleSelectUser = (user: UserAccount) => {
    setCurrUser(user);
    setCurrentUser(user);
    showToast(`Logged in as ${user.name} (${user.role})`);
  };

  // Members
  const handleSaveMember = (member: Member) => {
    updateDatabase((prev: GymDatabase) => {
      const idx = prev.members.findIndex((m: Member) => m.id === member.id);
      let newMembers: Member[];
      if (idx >= 0) {
        newMembers = [...prev.members];
        newMembers[idx] = member;
      } else {
        newMembers = [member, ...prev.members];
      }

      // If initial payment was made during creation, add to payments record
      let newPayments = prev.payments;
      if (idx === -1 && member.paidAmount > 0) {
        const initialPayment: PaymentRecord = {
          id: `p_init_${Date.now()}`,
          receiptNo: `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          memberId: member.id,
          memberName: member.name,
          branch: member.branch,
          amount: member.paidAmount,
          paymentMethod: 'UPI',
          date: member.joinedDate,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: member.dueAmount === 0 ? 'Paid' : 'Partial',
          notes: 'Membership joining fee deposit',
          collectedBy: currentUser.name,
        };
        newPayments = [initialPayment, ...prev.payments];
      }

      return {
        ...prev,
        members: newMembers,
        payments: newPayments,
      };
    });
    showToast(`Member "${member.name}" saved to physical storage.`);
  };

  const handleDeleteMember = (id: string) => {
    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      members: prev.members.filter((m: Member) => m.id !== id),
    }));
    showToast('Member removed from local database');
  };

  const handleSeedScaleMembers = () => {
    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      members: seedScaleMembers(prev.members, 40),
    }));
    showToast('Scaled: +40 member records added to physical storage!');
  };

  // Payments
  const handleRecordPayment = (payment: PaymentRecord) => {
    updateDatabase((prev: GymDatabase) => {
      const updatedMembers = prev.members.map((m: Member) => {
        if (m.id === payment.memberId) {
          const newPaid = (m.paidAmount || 0) + payment.amount;
          const newDue = Math.max(0, (m.totalFee || 0) - newPaid);
          const newStatus: Member['status'] = newDue === 0 ? 'Active' : 'Due';
          return {
            ...m,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newStatus,
          };
        }
        return m;
      });

      return {
        ...prev,
        payments: [payment, ...prev.payments],
        members: updatedMembers,
      };
    });
    showToast(`Payment of ₹${payment.amount} recorded! Official bill generated.`);
  };

  const handleViewReceipt = (payment: PaymentRecord) => {
    setActiveReceiptPayment(payment);
    setIsReceiptModalOpen(true);
  };

  // Attendance
  const handleCheckIn = (memberId: string, memberName: string, branch: string) => {
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      memberId,
      memberName,
      branch,
      date: new Date().toISOString().slice(0, 10),
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: currentUser.name,
      status: 'In Gym',
    };

    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      attendance: [newRecord, ...prev.attendance],
      members: prev.members.map((m: Member) =>
        m.id === memberId
          ? {
              ...m,
              lastCheckIn: `${newRecord.date} ${newRecord.inTime}`,
            }
          : m
      ),
    }));
    showToast(`✓ Check-in recorded for ${memberName}`);
  };

  const handleCheckOut = (recordId: string) => {
    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      attendance: prev.attendance.map((a: AttendanceRecord) =>
        a.id === recordId
          ? {
              ...a,
              outTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'Checked Out',
            }
          : a
      ),
    }));
    showToast('Check-out recorded.');
  };

  // Expenses & Maintenance
  const handleAddExpense = (expense: ExpenseRecord) => {
    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      expenses: [expense, ...prev.expenses],
    }));
    showToast(`Maintenance expense of ₹${expense.amount} recorded.`);
  };

  // Trainers & Payroll
  const handleAddTrainer = (trainer: Trainer) => {
    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      trainers: [trainer, ...prev.trainers],
    }));
    showToast(`Trainer ${trainer.name} registered.`);
  };

  const handleRecordSalary = (trainerId: string, amount: number, branch: string) => {
    const t = db.trainers.find((x: Trainer) => x.id === trainerId);
    if (!t) return;

    const salaryExpense: ExpenseRecord = {
      id: `exp_sal_${Date.now()}`,
      billNo: `SAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: `Monthly Salary Payment - ${t.name}`,
      category: 'Trainer & Staff Salary',
      branch: branch || t.branch,
      amount,
      date: new Date().toISOString().slice(0, 10),
      vendor: `Trainer: ${t.name}`,
      paidBy: currentUser.name,
      notes: `Salary cleared for ${t.role} (${t.specialization})`,
    };

    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      expenses: [salaryExpense, ...prev.expenses],
    }));
    showToast(`Salary payment of ₹${amount} recorded as gym expense.`);
  };

  // Branches
  const handleAddBranch = (branch: Branch) => {
    updateDatabase((prev: GymDatabase) => ({
      ...prev,
      branches: [...prev.branches, branch],
    }));
    showToast(`Branch "${branch.name}" created.`);
  };

  // WhatsApp Due Reminder
  const handleOpenWhatsApp = (member: Member) => {
    const currentBranchObj = db.branches.find((b: Branch) => b.name === member.branch);
    const targetUpi = currentBranchObj?.upiId || db.settings.ownerUpiId;
    const msg = `Hello ${member.name}! Greetings from ${db.settings.gymName} (${member.branch}). This is a gentle reminder regarding your outstanding gym membership fee of ₹${member.dueAmount} for ${member.plan}. Please pay via UPI to: ${targetUpi} or at the front desk counter. Thank you! 💪`;
    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // CSV & Excel Exports
  const handleExportMembersCSV = () => {
    downloadCSV(
      'ironcore_gym_members_master.csv',
      [
        'Member Code',
        'Full Name',
        'Phone',
        'Email',
        'Branch',
        'Plan',
        'Bodybuilding Goal',
        'Weight (kg)',
        'Height (cm)',
        'Assigned Coach',
        'Joined Date',
        'Expiry Date',
        'Status',
        'Total Fee (INR)',
        'Paid Amount (INR)',
        'Due Amount (INR)',
      ],
      db.members.map((m: Member) => [
        m.memberCode,
        m.name,
        m.phone,
        m.email,
        m.branch,
        m.plan,
        m.bodybuildingGoal,
        m.weight,
        m.height || '',
        m.trainerName,
        m.joinedDate,
        m.expiryDate,
        m.status,
        m.totalFee,
        m.paidAmount,
        m.dueAmount,
      ])
    );
    showToast('Members Master CSV downloaded');
  };

  const handleExportPaymentsCSV = () => {
    downloadCSV(
      'ironcore_gym_payments_collections.csv',
      [
        'Receipt No',
        'Member Name',
        'Branch',
        'Amount (INR)',
        'Payment Mode',
        'Date',
        'Time',
        'Status',
        'UPI Ref',
        'Collected By',
        'Notes',
      ],
      db.payments.map((p: PaymentRecord) => [
        p.receiptNo,
        p.memberName,
        p.branch,
        p.amount,
        p.paymentMethod,
        p.date,
        p.time,
        p.status,
        p.upiRef || '',
        p.collectedBy,
        p.notes || '',
      ])
    );
    showToast('Payments CSV downloaded');
  };

  const handleExportExpensesCSV = () => {
    downloadCSV(
      'ironcore_gym_maintenance_bills.csv',
      [
        'Bill No',
        'Title',
        'Category',
        'Branch',
        'Amount (INR)',
        'Date',
        'Vendor / Authority',
        'Paid By',
        'Notes',
      ],
      db.expenses.map((e: ExpenseRecord) => [
        e.billNo,
        e.title,
        e.category,
        e.branch,
        e.amount,
        e.date,
        e.vendor,
        e.paidBy,
        e.notes || '',
      ])
    );
    showToast('Maintenance & Expenses CSV downloaded');
  };

  const handleExportAuditCSV = () => {
    const totalRev = db.payments.reduce((a: number, b: PaymentRecord) => a + (b.amount || 0), 0);
    const totalExp = db.expenses.reduce((a: number, b: ExpenseRecord) => a + (b.amount || 0), 0);
    const totalSal = db.trainers.reduce((a: number, b: Trainer) => a + (b.salary || 0), 0);
    const net = totalRev - (totalExp + totalSal);
    const dues = db.members.reduce((a: number, b: Member) => a + (b.dueAmount || 0), 0);

    downloadCSV(
      'ironcore_gym_full_financial_audit.csv',
      ['Metric', 'Value (INR)', 'Details'],
      [
        ['Total Members', db.members.length, 'Loaded in Physical Phone Storage'],
        ['Gross Fee Revenue', totalRev, 'Collected via UPI & Cash'],
        ['Maintenance & Light Bills', totalExp, 'Electricity, AC, repairs, rent'],
        ['Trainer Salary Commitments', totalSal, `${db.trainers.length} coaching staff members`],
        ['Net Operating Profit', net, 'Audited Operating Surplus'],
        ['Outstanding Member Dues', dues, 'Pending fees recovery queue'],
      ]
    );
    showToast('Financial Audit CSV downloaded');
  };

  // Full Backup & Restore
  const handleDownloadFullJsonBackup = () => {
    exportDatabaseBackup(db);
    showToast('Full physical phone storage backup (.json) downloaded');
  };

  const handleRestoreJsonBackup = (jsonStr: string) => {
    const restored = importDatabaseBackup(jsonStr);
    setDb(restored);
    showToast('Database successfully restored from device backup!');
  };

  const handleResetDemo = () => {
    localStorage.removeItem('ironcore_gym_db_v1');
    const fresh = loadGymDatabase();
    setDb(fresh);
    showToast('Database reset to initial sample records.');
  };

  // Notification Counts
  const membersWithDues = db.members.filter((m: Member) => m.dueAmount > 0);
  const expiringMembers = db.members.filter((m: Member) => {
    if (m.status === 'Expiring') return true;
    const diffDays =
      (new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  return (
    <div className="flex min-h-screen bg-[#151719] text-[#f4f5f6]">
      {/* Desktop Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => {
          if (p === 'apk') setIsApkModalOpen(true);
          else setCurrentPage(p);
        }}
        membersCount={db.members.length}
        duesCount={membersWithDues.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentPage={currentPage}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
          branches={db.branches}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenApkModal={() => setIsApkModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadAlertsCount={membersWithDues.length + expiringMembers.length}
          isOnline={isOnline}
        />

        <main className="flex-1 p-4 sm:p-7 max-w-7xl mx-auto w-full pb-28 md:pb-12">
          {currentPage === 'dashboard' && (
            <DashboardView
              members={db.members}
              payments={db.payments}
              expenses={db.expenses}
              trainers={db.trainers}
              branches={db.branches}
              settings={db.settings}
              selectedBranch={selectedBranch}
              onNavigate={setCurrentPage}
              onOpenAddMember={() => setCurrentPage('members')}
              onOpenAddPayment={() => setCurrentPage('payments')}
              onOpenAddExpense={() => setCurrentPage('maintenance')}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {currentPage === 'members' && (
            <MembersView
              members={db.members}
              trainers={db.trainers}
              branches={db.branches}
              settings={db.settings}
              selectedBranch={selectedBranch}
              currentUser={currentUser}
              onSaveMember={handleSaveMember}
              onDeleteMember={handleDeleteMember}
              onSeedScaleMembers={handleSeedScaleMembers}
              onOpenAiWorkout={(m) => {
                setAiPreselectedMember(m);
                setCurrentPage('ai');
              }}
              onOpenWhatsApp={handleOpenWhatsApp}
              onOpenBillForMember={(m: Member) => {
                // Find latest payment or create receipt view
                const p = db.payments.find((x: PaymentRecord) => x.memberId === m.id);
                if (p) handleViewReceipt(p);
                else {
                  // Direct to payment recording
                  setCurrentPage('payments');
                }
              }}
            />
          )}

          {currentPage === 'payments' && (
            <PaymentsView
              payments={db.payments}
              members={db.members}
              branches={db.branches}
              settings={db.settings}
              selectedBranch={selectedBranch}
              onRecordPayment={handleRecordPayment}
              onViewReceipt={handleViewReceipt}
              onExportCSV={handleExportPaymentsCSV}
            />
          )}

          {currentPage === 'attendance' && (
            <AttendanceView
              attendance={db.attendance}
              members={db.members}
              branches={db.branches}
              selectedBranch={selectedBranch}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          )}

          {currentPage === 'maintenance' && (
            <MaintenanceView
              expenses={db.expenses}
              branches={db.branches}
              selectedBranch={selectedBranch}
              currentUser={currentUser}
              onAddExpense={handleAddExpense}
              onExportCSV={handleExportExpensesCSV}
            />
          )}

          {currentPage === 'trainers' && (
            <TrainersPayrollView
              trainers={db.trainers}
              branches={db.branches}
              selectedBranch={selectedBranch}
              currentUser={currentUser}
              onAddTrainer={handleAddTrainer}
              onRecordSalary={handleRecordSalary}
            />
          )}

          {currentPage === 'branches' && (
            <BranchesView
              branches={db.branches}
              members={db.members}
              payments={db.payments}
              expenses={db.expenses}
              trainers={db.trainers}
              currentUser={currentUser}
              onSelectBranch={(bName) => {
                setSelectedBranch(bName);
                setCurrentPage('dashboard');
                showToast(`Switched view to ${bName}`);
              }}
              onAddBranch={handleAddBranch}
            />
          )}

          {currentPage === 'ai' && (
            <AiAssistantView
              members={db.members}
              payments={db.payments}
              expenses={db.expenses}
              branches={db.branches}
              settings={db.settings}
              selectedBranch={selectedBranch}
              preselectedMemberForWorkout={aiPreselectedMember}
              preselectedMemberForReminder={membersWithDues[0] || null}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsExportView
              db={db}
              onExportMembersCSV={handleExportMembersCSV}
              onExportPaymentsCSV={handleExportPaymentsCSV}
              onExportExpensesCSV={handleExportExpensesCSV}
              onExportAuditCSV={handleExportAuditCSV}
              onDownloadFullJsonBackup={handleDownloadFullJsonBackup}
              onRestoreJsonBackup={handleRestoreJsonBackup}
              onResetDemo={handleResetDemo}
              onOpenApkModal={() => setIsApkModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenMore={() => setIsNotificationsOpen(true)}
        duesCount={membersWithDues.length}
      />

      {/* 10 Users & Google Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={db.users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onUpdateUsers={handleUpdateUsers}
      />

      {/* Install App & APK Modal */}
      <InstallApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Official Receipt / Bill Modal */}
      <ReceiptModal
        payment={activeReceiptPayment}
        member={
          activeReceiptPayment
            ? db.members.find((m: Member) => m.id === activeReceiptPayment.memberId)
            : null
        }
        settings={db.settings}
        branch={
          activeReceiptPayment
            ? db.branches.find((b: Branch) => b.name === activeReceiptPayment.branch)
            : null
        }
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {/* Urgent Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        membersWithDues={membersWithDues}
        expiringMembers={expiringMembers}
        trainers={db.trainers}
        onOpenWhatsApp={handleOpenWhatsApp}
        onNavigateToPayments={() => setCurrentPage('payments')}
        onNavigateToTrainers={() => setCurrentPage('trainers')}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#b9f227] px-4 py-2 text-xs font-black text-[#151719] shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
