import React, { useState } from 'react';
import { AttendanceRecord, Member, Branch } from '../types';
import {
  UserCheck,
  UserX,
  Search,
  Clock,
  CheckCircle,
  Building2,
  Calendar,
  X,
  AlertTriangle,
} from 'lucide-react';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  members: Member[];
  branches: Branch[];
  selectedBranch: string;
  onCheckIn: (memberId: string, memberName: string, branch: string) => void;
  onCheckOut: (recordId: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  members,
  branches,
  selectedBranch,
  onCheckIn,
  onCheckOut,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [quickCheckinBranch, setQuickCheckinBranch] = useState(
    selectedBranch === 'all' ? 'Central Branch' : selectedBranch
  );

  const todayStr = new Date().toISOString().slice(0, 10);

  const scopedAttendance = attendance.filter((a) => {
    if (selectedBranch !== 'all' && a.branch !== selectedBranch) return false;
    if (!searchTerm) return true;
    return a.memberName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const todayList = scopedAttendance.filter((a) => a.date === todayStr);
  const currentlyInGym = todayList.filter((a) => a.status === 'In Gym');

  const handleQuickCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    const m = members.find((x) => x.id === selectedMemberId);
    if (!m) return;

    if (m.status === 'Expired') {
      alert(`⚠️ Check-in Alert: Member ${m.name}'s membership expired on ${m.expiryDate}. Please collect renewal fees.`);
    }

    onCheckIn(m.id, m.name, quickCheckinBranch);
    setSelectedMemberId('');
  };

  return (
    <div className="space-y-5">
      {/* Metrics: Currently in Gym, Today's Total, Scope */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#a4abb2]">Currently Working Out</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#81cf69] animate-ping" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#81cf69]">
            {currentlyInGym.length} Members
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Live workout sessions in {selectedBranch}
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <span className="text-xs font-bold text-[#a4abb2]">Today's Total Check-ins</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#b9f227]">
            {todayList.length}
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Recorded since morning 05:00 AM
          </span>
        </div>

        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5">
          <span className="text-xs font-bold text-[#a4abb2]">Active Roster Scope</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white">
            {members.filter((m) => selectedBranch === 'all' || m.branch === selectedBranch).length}
          </div>
          <span className="text-[11px] text-[#a4abb2] mt-1 block">
            Eligible gym badge holders
          </span>
        </div>
      </div>

      {/* Fast Check-in Bar */}
      <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg">
        <h3 className="text-sm font-black text-white mb-1">Front Desk Instant Check-in</h3>
        <p className="text-xs text-[#a4abb2] mb-3">
          Select or search member entering the gym floor
        </p>

        <form onSubmit={handleQuickCheckin} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full rounded-xl border border-[#3a4045] bg-[#1e2124] px-3.5 py-2.5 text-xs text-white focus:border-[#b9f227] focus:outline-none"
            >
              <option value="">-- Select Member Entering Gym --</option>
              {members
                .filter((m) => selectedBranch === 'all' || m.branch === selectedBranch)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.branch}) {m.status === 'Due' ? '— ⚠️ Due' : m.status === 'Expired' ? '— ❌ Expired' : '— Active'}
                  </option>
                ))}
            </select>
          </div>

          <div className="sm:w-48">
            <select
              value={quickCheckinBranch}
              onChange={(e) => setQuickCheckinBranch(e.target.value)}
              className="w-full rounded-xl border border-[#3a4045] bg-[#1e2124] px-3.5 py-2.5 text-xs text-white focus:border-[#b9f227] focus:outline-none"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedMemberId}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#b9f227] px-6 py-2.5 text-xs font-black text-[#151719] hover:brightness-110 disabled:opacity-40 transition"
          >
            <UserCheck className="h-4 w-4" />
            Check In
          </button>
        </form>
      </div>

      {/* Attendance Log Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a4abb2]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter attendance by member name..."
              className="w-full rounded-xl border border-[#3a4045] bg-[#202326] pl-9 pr-4 py-2 text-xs text-white placeholder-[#747d84] focus:border-[#b9f227] focus:outline-none"
            />
          </div>
          <span className="text-xs text-[#a4abb2]">
            Total {scopedAttendance.length} check-in sessions
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#34393e] bg-[#202326] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#34393e] bg-[#24282c] text-[#a4abb2]">
                <tr>
                  <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Member Name</th>
                  <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Branch</th>
                  <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 font-extrabold uppercase tracking-wider">In-Time</th>
                  <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Out-Time</th>
                  <th className="py-3 px-4 font-extrabold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#34393e]">
                {scopedAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#25292d] transition">
                    <td className="py-3 px-4 font-bold text-white">{rec.memberName}</td>
                    <td className="py-3 px-4 text-[#a4abb2]">{rec.branch}</td>
                    <td className="py-3 px-4 text-[#a4abb2]">{rec.date}</td>
                    <td className="py-3 px-4 font-mono text-[#81cf69] font-semibold">{rec.inTime}</td>
                    <td className="py-3 px-4 font-mono text-[#a4abb2]">{rec.outTime || '— Working out'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          rec.status === 'In Gym'
                            ? 'bg-[#213523] text-[#81cf69] animate-pulse'
                            : 'bg-[#2b3328] text-[#a4abb2]'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {rec.status === 'In Gym' && (
                        <button
                          onClick={() => onCheckOut(rec.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#3a4045] bg-[#282c30] px-2.5 py-1 text-[11px] font-bold text-[#ff9292] hover:bg-[#3d2525] transition"
                        >
                          <UserX className="h-3.5 w-3.5" />
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {scopedAttendance.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-[#a4abb2]">
                      No attendance sessions recorded yet. Use the check-in bar above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
