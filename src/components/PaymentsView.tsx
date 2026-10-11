import React, { useState } from 'react';
import { PaymentRecord, Member, Branch, GymSettings, PaymentMethod } from '../types';
import {
  CreditCard,
  Plus,
  Search,
  QrCode,
  Printer,
  CheckCircle,
  FileText,
  Download,
  IndianRupee,
  Smartphone,
  Banknote,
  X,
} from 'lucide-react';

interface PaymentsViewProps {
  payments: PaymentRecord[];
  members: Member[];
  branches: Branch[];
  settings: GymSettings;
  selectedBranch: string;
  onRecordPayment: (payment: PaymentRecord) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
  onExportCSV: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  members,
  branches,
  settings,
  selectedBranch,
  onRecordPayment,
  onViewReceipt,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(1500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentBranch, setPaymentBranch] = useState(
    selectedBranch === 'all' ? 'Central Branch' : selectedBranch
  );
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentNotes, setPaymentNotes] = useState('');
  const [upiRefInput, setUpiRefInput] = useState('');
  const [collectorName, setCollectorName] = useState('Mohammed Junaid');

  const scopedPayments = payments.filter((p) => {
    if (selectedBranch !== 'all' && p.branch !== selectedBranch) return false;
    if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.memberName.toLowerCase().includes(q) ||
      p.receiptNo.toLowerCase().includes(q) ||
      (p.upiRef && p.upiRef.toLowerCase().includes(q))
    );
  });

  const totalCollected = scopedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const upiCollected = scopedPayments
    .filter((p) => p.paymentMethod === 'UPI')
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const cashCollected = scopedPayments
    .filter((p) => p.paymentMethod === 'Cash')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    const m = members.find((x) => x.id === memberId);
    if (m) {
      setPaymentBranch(m.branch);
      // If member has dues, prepopulate due amount, else standard plan fee
      setPaymentAmount(m.dueAmount > 0 ? m.dueAmount : 1500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = members.find((x) => x.id === selectedMemberId);
    if (!m) {
      alert('Please select a gym member to record this payment.');
      return;
    }

    const currentReceiptNum = `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: PaymentRecord = {
      id: `p_${Date.now()}`,
      receiptNo: currentReceiptNum,
      memberId: m.id,
      memberName: m.name,
      branch: paymentBranch,
      amount: Number(paymentAmount),
      paymentMethod,
      date: paymentDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: Number(paymentAmount) >= m.dueAmount ? 'Paid' : 'Partial',
      upiRef: paymentMethod === 'UPI' ? upiRefInput || `UPI/${Date.now().toString().slice(-8)}` : undefined,
      notes: paymentNotes.trim(),
      collectedBy: collectorName,
    };

    onRecordPayment(newPayment);
    setIsModalOpen(false);
    onViewReceipt(newPayment);
  };

  // Generate UPI payment intent string for QR code
  const currentBranchObj = branches.find((b) => b.name === paymentBranch);
  const targetUpiId = currentBranchObj?.upiId || settings.ownerUpiId;
  const upiPayLink = `upi://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(settings.ownerUpiName)}&am=${paymentAmount}&cu=INR&tn=GymFee`;

  return (
    <div className="space-y-5">
      {/* Top Cards: Total Collected, Cash vs UPI breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <span className="text-xs font-bold text-[#a4abb2]">Total Fees Collected</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#b9f227]">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            {scopedPayments.length} recorded payments in {selectedBranch}
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#a4abb2]">UPI Collections</span>
            <Smartphone className="h-4 w-4 text-[#8bbcff]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#8bbcff]">
            ₹{upiCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Google Pay, PhonePe, Paytm QR scans
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#a4abb2]">Cash Collections</span>
            <Banknote className="h-4 w-4 text-[#81cf69]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#81cf69]">
            ₹{cashCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Physical desk counter cash receipts
          </span>
        </div>
      </div>

      {/* Action and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a4abb2]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member, bill receipt #, UPI ref..."
              className="w-full rounded-xl border border-[#3a4045] bg-[#202326] pl-9 pr-4 py-2 text-xs text-white placeholder-[#747d84] focus:border-[#b9f227] focus:outline-none"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-[#3a4045] bg-[#202326] px-3 py-2 text-xs font-semibold text-white focus:border-[#b9f227] focus:outline-none"
          >
            <option value="all">All Modes</option>
            <option value="UPI">UPI Only</option>
            <option value="Cash">Cash Only</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-[#34393e] bg-[#282c30] px-3 py-2 text-xs font-bold text-white hover:bg-[#34393e] transition"
          >
            <Download className="h-4 w-4 text-[#b9f227]" />
            Export Payments CSV
          </button>

          <button
            onClick={() => {
              setSelectedMemberId(members[0]?.id || '');
              setPaymentAmount(1500);
              setPaymentMethod('UPI');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#b9f227] px-4 py-2 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
          >
            <Plus className="h-4 w-4" />
            Record Fee & Generate Bill
          </button>
        </div>
      </div>

      {/* Payments History Table */}
      <div className="overflow-hidden rounded-2xl border border-[#34393e] bg-[#202326] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#34393e] bg-[#24282c] text-[#a4abb2]">
              <tr>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Receipt #</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Member Name</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Branch</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Date & Time</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Payment Mode</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Amount Paid</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-right">Bill Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#34393e]">
              {scopedPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[#25292d] transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#b9f227]">
                    {p.receiptNo}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-white block">{p.memberName}</span>
                    <span className="text-[10px] text-[#a4abb2]">By: {p.collectedBy}</span>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{p.branch}</td>
                  <td className="py-3 px-4 text-[#a4abb2]">
                    <span>{p.date}</span>
                    <span className="block text-[10px] text-[#747d84]">{p.time}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          p.paymentMethod === 'UPI'
                            ? 'bg-[#202f42] text-[#8bbcff]'
                            : 'bg-[#213523] text-[#81cf69]'
                        }`}
                      >
                        {p.paymentMethod}
                      </span>
                      {p.upiRef && (
                        <span className="text-[10px] text-[#a4abb2] truncate max-w-[100px]" title={p.upiRef}>
                          {p.upiRef}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-black text-white text-sm">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        p.status === 'Paid'
                          ? 'bg-[#213523] text-[#81cf69]'
                          : 'bg-[#3b3020] text-[#ffc56b]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewReceipt(p)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#3a4045] bg-[#282c30] px-2.5 py-1 text-[11px] font-bold text-[#b9f227] hover:bg-[#34393e] transition"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      View Bill
                    </button>
                  </td>
                </tr>
              ))}

              {scopedPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#a4abb2]">
                    No payments found for this branch or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Fee & Instant Bill Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#34393e] bg-[#202326] p-6 shadow-2xl text-[#f4f5f6]">
            <div className="flex items-center justify-between pb-4 border-b border-[#34393e]">
              <div>
                <h3 className="text-base font-extrabold text-white">Record Member Fee Payment</h3>
                <p className="text-xs text-[#a4abb2]">Collect via UPI QR or Cash and generate instant bill</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="pt-4 space-y-4 text-xs">
              {/* Member Selection */}
              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Select Gym Member *</label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.branch}) {m.dueAmount > 0 ? `— Due: ₹${m.dueAmount}` : '— (Active)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount & Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-white">Amount Collected (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none font-bold text-base text-[#b9f227]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash (Counter Cash)</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
                  </select>
                </div>
              </div>

              {/* Live UPI QR Code Banner when UPI is selected */}
              {paymentMethod === 'UPI' && (
                <div className="rounded-xl border border-[#3a4823] bg-[#222a1b] p-4 flex flex-col sm:flex-row items-center gap-4">
                  {/* Dynamic QR Code representation */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white shadow-md">
                    <QrCode className="h-24 w-24 text-black" />
                    <span className="text-[9px] font-black text-black tracking-wider mt-1">SCAN & PAY ₹{paymentAmount}</span>
                  </div>
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="font-extrabold text-sm text-white">Instant UPI QR Payment</span>
                      <span className="rounded bg-[#b9f227] px-1.5 py-0.5 text-[9px] font-black text-black">LIVE</span>
                    </div>
                    <p className="text-[11px] text-[#a4abb2]">
                      UPI ID: <strong className="text-[#b9f227]">{targetUpiId}</strong>
                    </p>
                    <p className="text-[10px] text-[#a4abb2]">
                      Member can scan using Google Pay, PhonePe, Paytm, or BHIM. Amount will auto-fill ₹{paymentAmount}.
                    </p>
                    <input
                      type="text"
                      value={upiRefInput}
                      onChange={(e) => setUpiRefInput(e.target.value)}
                      placeholder="Enter UPI Ref / UTR number (e.g. 4291048201)"
                      className="w-full rounded-lg border border-[#3a4045] bg-[#1a1d20] px-3 py-1.5 text-xs text-white placeholder-[#747d84] mt-2 focus:border-[#b9f227] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Branch & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-[#a4abb2]">Branch *</label>
                  <select
                    value={paymentBranch}
                    onChange={(e) => setPaymentBranch(e.target.value)}
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
                  <label className="font-bold text-[#a4abb2]">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-lg border border-[#3a4045] bg-[#1e2124] px-3 py-2 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-[#a4abb2]">Notes / Receipt Remarks (Optional)</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Quarterly renewal fee deposit"
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
                  Confirm & Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
