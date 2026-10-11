import React, { useRef, useState } from 'react';
import { Member, PaymentRecord, ExpenseRecord, Trainer, Branch, GymDatabase, GymSettings } from '../types';
import {
  FileSpreadsheet,
  Download,
  Upload,
  HardDrive,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
  FileText,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';

interface ReportsExportViewProps {
  db: GymDatabase;
  onExportMembersCSV: () => void;
  onExportPaymentsCSV: () => void;
  onExportExpensesCSV: () => void;
  onExportAuditCSV: () => void;
  onDownloadFullJsonBackup: () => void;
  onRestoreJsonBackup: (jsonStr: string) => void;
  onResetDemo: () => void;
  onOpenApkModal: () => void;
}

export const ReportsExportView: React.FC<ReportsExportViewProps> = ({
  db,
  onExportMembersCSV,
  onExportPaymentsCSV,
  onExportExpensesCSV,
  onExportAuditCSV,
  onDownloadFullJsonBackup,
  onRestoreJsonBackup,
  onResetDemo,
  onOpenApkModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onRestoreJsonBackup(text);
        setRestoreStatus('✓ Physical backup restored successfully to local storage!');
        setTimeout(() => setRestoreStatus(''), 4000);
      } catch (err: any) {
        alert(`Failed restoring backup: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const totalMembers = db.members.length;
  const totalCollections = db.payments.reduce((a: number, b: PaymentRecord) => a + (b.amount || 0), 0);
  const totalExpenses = db.expenses.reduce((a: number, b: ExpenseRecord) => a + (b.amount || 0), 0);
  const totalSalaries = db.trainers.reduce((a: number, b: Trainer) => a + (b.salary || 0), 0);
  const netProfit = totalCollections - (totalExpenses + totalSalaries);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Excel Sheets & Physical Phone Storage
        </h2>
        <p className="text-xs text-[#a4abb2] mt-0.5">
          Generate production-ready Excel sheets, manage physical phone backups, or install the native APK wrapper.
        </p>
      </div>

      {/* Excel Sheet Generation Center */}
      <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#213523] text-[#81cf69]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Ready-to-Download Excel Sheets</h3>
            <p className="text-xs text-[#a4abb2]">
              Standard CSV format compatible with Microsoft Excel, Google Sheets & Apple Numbers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Members Sheet */}
          <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#b9f227] tracking-wider">
                MEMBERS MASTER
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Gym Members Sheet</h4>
              <p className="text-[11px] text-[#a4abb2] mt-0.5">
                {totalMembers} member records with phone, branch, weights, bodybuilding goals & dues.
              </p>
            </div>
            <button
              onClick={onExportMembersCSV}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#b9f227] py-2 text-xs font-black text-[#151719] hover:brightness-110 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Download Excel
            </button>
          </div>

          {/* Payments Sheet */}
          <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#8bbcff] tracking-wider">
                FEES & BILLS
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Collections & Receipts</h4>
              <p className="text-[11px] text-[#a4abb2] mt-0.5">
                {db.payments.length} transactions, receipt numbers, UPI references & amounts.
              </p>
            </div>
            <button
              onClick={onExportPaymentsCSV}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#3a4045] bg-[#282c30] py-2 text-xs font-bold text-white hover:bg-[#34393e] transition"
            >
              <Download className="h-3.5 w-3.5 text-[#8bbcff]" />
              Download Excel
            </button>
          </div>

          {/* Maintenance & Expenses Sheet */}
          <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#ff9292] tracking-wider">
                OUTFLOWS & BILLS
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Maintenance & Bills</h4>
              <p className="text-[11px] text-[#a4abb2] mt-0.5">
                {db.expenses.length} bills of electricity/light, equipment repairs, rent & parts.
              </p>
            </div>
            <button
              onClick={onExportExpensesCSV}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#3a4045] bg-[#282c30] py-2 text-xs font-bold text-white hover:bg-[#34393e] transition"
            >
              <Download className="h-3.5 w-3.5 text-[#ff9292]" />
              Download Excel
            </button>
          </div>

          {/* P&L Audit Statement */}
          <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#81cf69] tracking-wider">
                FINANCIAL AUDIT
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Full P&L Audit Sheet</h4>
              <p className="text-[11px] text-[#a4abb2] mt-0.5">
                Net profit, gross sales, salary commitments, maintenance & branch balances.
              </p>
            </div>
            <button
              onClick={onExportAuditCSV}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#3a4823] bg-[#232d1b] py-2 text-xs font-extrabold text-[#b9f227] hover:bg-[#2e3c23] transition"
            >
              <Download className="h-3.5 w-3.5" />
              Download Audit
            </button>
          </div>
        </div>
      </div>

      {/* Physical Phone Storage Management Card */}
      <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#30382a] text-[#b9f227]">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Physical Phone Storage Management</h3>
              <p className="text-xs text-[#a4abb2]">
                Your data resides directly in your phone or PC memory. Export full JSON backup or restore anytime.
              </p>
            </div>
          </div>
          <span className="rounded bg-[#2b3328] px-2.5 py-1 text-[11px] font-black text-[#b9f227]">
            NO CLOUD LOCK-IN
          </span>
        </div>

        {restoreStatus && (
          <div className="rounded-xl border border-[#3a4823] bg-[#232b1c] p-3 text-xs font-bold text-[#81cf69] flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{restoreStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-4 space-y-3">
            <h4 className="text-xs font-extrabold text-white">Download Phone Storage Backup</h4>
            <p className="text-xs text-[#a4abb2] leading-relaxed">
              Saves every member, photo, payment, maintenance bill, and branch settings into a portable encrypted `.json` file on your device.
            </p>
            <button
              onClick={onDownloadFullJsonBackup}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#b9f227] px-4 py-2 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
            >
              <Download className="h-4 w-4" />
              Download Physical DB Backup (.json)
            </button>
          </div>

          <div className="rounded-xl border border-[#34393e] bg-[#1d2023] p-4 space-y-3">
            <h4 className="text-xs font-extrabold text-white">Restore from Phone Storage File</h4>
            <p className="text-xs text-[#a4abb2] leading-relaxed">
              Switching phones or restoring on a new tablet? Choose your saved IronCore JSON backup file to instantly reload all records.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#34393e] bg-[#282c30] px-4 py-2 text-xs font-bold text-white hover:bg-[#34393e] transition"
            >
              <Upload className="h-4 w-4 text-[#b9f227]" />
              Select & Restore JSON File
            </button>
          </div>
        </div>

        {/* Reset Demo Option */}
        <div className="pt-4 border-t border-[#34393e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[#a4abb2]">
            Want to start fresh or restore initial sample records across 4 branches?
          </div>
          <button
            onClick={() => {
              if (confirm('Reset all local storage to original sample dataset?')) {
                onResetDemo();
              }
            }}
            className="rounded-lg border border-[#432d2e] bg-[#282021] px-3.5 py-1.5 text-xs font-bold text-[#ff9292] hover:bg-[#352627] transition"
          >
            Reset to Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};
