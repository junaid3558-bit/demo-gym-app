import React from 'react';
import { PaymentRecord, Member, GymSettings, Branch } from '../types';
import { X, Printer, Download, CheckCircle, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  member?: Member | null;
  settings: GymSettings;
  branch?: Branch | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  member,
  settings,
  branch,
  onClose,
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const branchAddress = branch?.address || settings.address;
  const branchPhone = branch?.phone || settings.phone;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm print:p-0 print:bg-white animate-fade-in">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#34393e] bg-[#202326] shadow-2xl text-[#f4f5f6] print:border-none print:bg-white print:text-black print:shadow-none">
        {/* Header toolbar (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-[#34393e] px-6 py-3.5 bg-[#181a1d] print:hidden">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#2b3328] px-2 py-0.5 text-[11px] font-extrabold text-[#b9f227]">
              OFFICIAL BILL & RECEIPT
            </span>
            <span className="text-xs text-[#a4abb2]">{payment.receiptNo}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-[#b9f227] px-3 py-1.5 text-xs font-bold text-[#151719] hover:brightness-110 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#a4abb2] hover:bg-[#282c30] hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Bill Paper */}
        <div className="p-7 space-y-6 print:p-8 bg-[#1f2225] print:bg-white print:text-black" id="printableReceipt">
          {/* Gym Header */}
          <div className="flex items-start justify-between border-b border-[#34393e] print:border-gray-300 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#b9f227] text-[#151719] font-black text-sm print:border print:border-black">
                  IC
                </div>
                <h1 className="text-xl font-black tracking-tight text-white print:text-black">
                  {settings.gymName}
                </h1>
              </div>
              <p className="text-xs text-[#a4abb2] print:text-gray-600 max-w-sm">{branchAddress}</p>
              <p className="text-xs text-[#a4abb2] print:text-gray-600">
                Helpline: {branchPhone} | GSTIN: {settings.gstNumber}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-md border border-[#3a4823] bg-[#29321e] px-2.5 py-1 text-xs font-extrabold text-[#b9f227] print:border-black print:bg-gray-100 print:text-black">
                {payment.status === 'Paid' ? 'PAID IN FULL' : 'PARTIAL PAYMENT'}
              </span>
              <p className="mt-2 text-xs font-bold text-white print:text-black">Receipt #{payment.receiptNo}</p>
              <p className="text-[11px] text-[#a4abb2] print:text-gray-600">
                Date: {payment.date} {payment.time}
              </p>
            </div>
          </div>

          {/* Member & Plan Info Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#34393e] print:border-gray-300 bg-[#282c30] print:bg-gray-50 p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#a4abb2] print:text-gray-500 tracking-wider">
                Billed To
              </span>
              <p className="text-sm font-extrabold text-white print:text-black">{payment.memberName}</p>
              <p className="text-xs text-[#a4abb2] print:text-gray-600">{member?.phone || 'Phone verified'}</p>
              {member?.bodybuildingGoal && (
                <p className="text-[11px] text-[#b9f227] print:text-gray-700 font-semibold mt-0.5">
                  Goal: {member.bodybuildingGoal}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#a4abb2] print:text-gray-500 tracking-wider">
                Membership Details
              </span>
              <p className="text-xs font-bold text-white print:text-black">{member?.plan || 'General Membership'}</p>
              <p className="text-xs text-[#a4abb2] print:text-gray-600">Branch: {payment.branch}</p>
              {member?.expiryDate && (
                <p className="text-[11px] text-[#a4abb2] print:text-gray-600">
                  Valid Till: <strong>{member.expiryDate}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <div className="border border-[#34393e] print:border-gray-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2a2e33] print:bg-gray-200 text-[#a4abb2] print:text-gray-700">
                <tr>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Description</th>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Payment Mode</th>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#34393e] print:divide-gray-300 text-white print:text-black">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold">Gym Membership Subscription Fee</p>
                    <span className="text-[11px] text-[#a4abb2] print:text-gray-600">
                      Access to state-of-the-art strength floor, cardio equipment & trainer consultation
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{payment.paymentMethod}</span>
                    {payment.upiRef && (
                      <span className="block text-[10px] text-[#a4abb2] print:text-gray-600">
                        Ref: {payment.upiRef}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-sm">
                    {settings.currencySymbol} {payment.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Outstanding */}
          <div className="flex justify-between items-end border-t border-[#34393e] print:border-gray-300 pt-4">
            <div className="space-y-1">
              <p className="text-xs text-[#a4abb2] print:text-gray-600">
                Payment Collector: <strong>{payment.collectedBy}</strong>
              </p>
              {payment.notes && (
                <p className="text-[11px] text-[#a4abb2] print:text-gray-500 italic">
                  Note: {payment.notes}
                </p>
              )}
            </div>

            <div className="text-right space-y-1 min-w-[180px]">
              <div className="flex justify-between text-xs text-[#a4abb2] print:text-gray-600">
                <span>Amount Paid:</span>
                <span className="font-bold text-white print:text-black">
                  {settings.currencySymbol} {payment.amount.toLocaleString('en-IN')}
                </span>
              </div>
              {member && member.dueAmount > 0 && (
                <div className="flex justify-between text-xs text-[#ff9292] print:text-red-600 font-bold">
                  <span>Balance Due:</span>
                  <span>
                    {settings.currencySymbol} {member.dueAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-[#34393e] print:border-gray-300 pt-2 text-[#b9f227] print:text-black">
                <span>Total Received:</span>
                <span>
                  {settings.currencySymbol} {payment.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="flex items-center justify-between border-t border-[#34393e] print:border-gray-300 pt-5">
            <div className="flex items-center gap-2 text-[10px] text-[#a4abb2] print:text-gray-600">
              <CheckCircle className="h-4 w-4 text-[#b9f227] print:text-green-600" />
              <span>Computer generated receipt · Valid without physical seal</span>
            </div>
            <div className="text-center">
              <div className="h-10 w-28 border-b border-dashed border-[#a4abb2] print:border-black flex items-end justify-center pb-1">
                <span className="font-serif italic text-xs text-[#b9f227] print:text-black">M. Junaid</span>
              </div>
              <p className="text-[10px] font-bold text-[#a4abb2] print:text-gray-600 mt-1">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
