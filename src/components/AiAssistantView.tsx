import React, { useState } from 'react';
import { Member, PaymentRecord, ExpenseRecord, GymSettings, Branch } from '../types';
import {
  Sparkles,
  Dumbbell,
  TrendingUp,
  MessageCircle,
  Send,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AiAssistantViewProps {
  members: Member[];
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  branches: Branch[];
  settings: GymSettings;
  selectedBranch: string;
  preselectedMemberForWorkout?: Member | null;
  preselectedMemberForReminder?: Member | null;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  members,
  payments,
  expenses,
  branches,
  settings,
  selectedBranch,
  preselectedMemberForWorkout,
  preselectedMemberForReminder,
}) => {
  const [activeTab, setActiveTab] = useState<'advisor' | 'workout' | 'reminder' | 'chat'>(
    preselectedMemberForWorkout ? 'workout' : preselectedMemberForReminder ? 'reminder' : 'advisor'
  );

  // Business Advisor State
  const [advisorAnalysis, setAdvisorAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Workout & Diet State
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    preselectedMemberForWorkout?.id || members[0]?.id || ''
  );
  const [workoutPlan, setWorkoutPlan] = useState<string>('');
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);

  // Fee Reminder State
  const dueMembers = members.filter((m) => m.dueAmount > 0);
  const [reminderMemberId, setReminderMemberId] = useState<string>(
    preselectedMemberForReminder?.id || dueMembers[0]?.id || members[0]?.id || ''
  );
  const [reminderTone, setReminderTone] = useState('Polite & Friendly');
  const [remindersText, setRemindersText] = useState<string>('');
  const [isGeneratingReminder, setIsGeneratingReminder] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; time: string }[]
  >([
    {
      role: 'assistant',
      text: `Hello! I am your IronCore AI Assistant powered by Google Gemini. I have real-time access to your gym data across ${branches.length} branches. Ask me to audit your net profit, write marketing offers, draft fee reminders, or plan bodybuilding diets for members!`,
      time: 'Just now',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Run AI Advisor
  const handleRunAdvisor = async () => {
    setIsAnalyzing(true);
    try {
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

      const totalRev = scopedPayments.reduce((a, b) => a + (b.amount || 0), 0);
      const totalExp = scopedExpenses.reduce((a, b) => a + (b.amount || 0), 0);
      const totalDues = scopedMembers.reduce((a, b) => a + (b.dueAmount || 0), 0);

      const res = await fetch('/api/ai/gym-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: selectedBranch,
          stats: {
            totalMembers: scopedMembers.length,
            activeMembers: scopedMembers.filter((m) => m.status === 'Active').length,
            dueMembers: scopedMembers.filter((m) => m.dueAmount > 0).length,
            totalRevenue: totalRev,
            totalExpenses: totalExp,
            netProfit: totalRev - totalExp,
            totalDues,
          },
          recentExpenses: scopedExpenses.slice(0, 5).map((e) => ({
            title: e.title,
            amount: e.amount,
            category: e.category,
          })),
          topDues: scopedMembers
            .filter((m) => m.dueAmount > 0)
            .slice(0, 5)
            .map((m) => ({ name: m.name, due: m.dueAmount, plan: m.plan })),
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAdvisorAnalysis(data.analysis);
      } else {
        setAdvisorAnalysis(
          'Could not retrieve analysis from Gemini AI. Check server connection.'
        );
      }
    } catch (err: any) {
      setAdvisorAnalysis(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run AI Workout Plan
  const handleGenerateWorkout = async () => {
    const m = members.find((x) => x.id === selectedMemberId);
    if (!m) return;

    setIsGeneratingWorkout(true);
    try {
      const res = await fetch('/api/ai/workout-diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: m.name,
          weight: m.weight,
          height: m.height,
          bodybuildingGoal: m.bodybuildingGoal,
          plan: m.plan,
          medicalNotes: m.medicalNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setWorkoutPlan(data.plan);
      } else {
        setWorkoutPlan('Failed to generate plan. Please try again.');
      }
    } catch (err: any) {
      setWorkoutPlan(`Error: ${err.message}`);
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  // Run AI Fee Reminder
  const handleGenerateReminder = async () => {
    const m = members.find((x) => x.id === reminderMemberId);
    if (!m) return;

    setIsGeneratingReminder(true);
    try {
      const res = await fetch('/api/ai/fee-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: m.name,
          dueAmount: m.dueAmount || 1500,
          plan: m.plan,
          expiryDate: m.expiryDate,
          branch: m.branch,
          tone: reminderTone,
          upiId: settings.ownerUpiId,
        }),
      });

      const data = await res.json();
      if (data.success && data.reminders) {
        setRemindersText(data.reminders);
      } else {
        setRemindersText('Failed to draft reminder.');
      }
    } catch (err: any) {
      setRemindersText(`Error: ${err.message}`);
    } finally {
      setIsGeneratingReminder(false);
    }
  };

  // Run Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    const newChat = [
      ...chatMessages,
      {
        role: 'user' as const,
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setChatMessages(newChat);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          gymContext: {
            gymName: settings.gymName,
            branchesCount: branches.length,
            totalMembers: members.length,
            selectedBranch,
            totalCollected: payments.reduce((a, b) => a + (b.amount || 0), 0),
          },
        }),
      });

      const data = await res.json();
      const reply = data.success && data.reply ? data.reply : 'Unable to answer right now.';
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Error connecting to Gemini AI: ${err.message}`,
          time: 'Now',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#34393e] bg-gradient-to-r from-[#202326] via-[#242b1f] to-[#1a2115] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-[#b9f227] animate-ping" />
            <span className="text-xs font-bold text-[#b9f227] tracking-wider uppercase">
              Google Gemini 3.8 Flash AI Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            IronCore Intelligent Assistant
          </h2>
          <p className="text-xs text-[#a4abb2] mt-0.5">
            Automate gym management, generate IFBB bodybuilding routines, optimize net profit & recover fee dues.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#81cf69] bg-[#213523] px-3 py-1.5 rounded-xl border border-[#2e4730]">
          <ShieldCheck className="h-4 w-4" />
          <span>Server-side Secure SDK</span>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="flex border-b border-[#34393e] bg-[#1a1d20] rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'advisor'
              ? 'border-[#b9f227] text-[#b9f227] bg-[#242a1f]'
              : 'border-transparent text-[#a4abb2] hover:text-white'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Business & Profit Advisor
        </button>

        <button
          onClick={() => setActiveTab('workout')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'workout'
              ? 'border-[#b9f227] text-[#b9f227] bg-[#242a1f]'
              : 'border-transparent text-[#a4abb2] hover:text-white'
          }`}
        >
          <Dumbbell className="h-4 w-4" />
          AI Workout & Diet Architect
        </button>

        <button
          onClick={() => setActiveTab('reminder')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'reminder'
              ? 'border-[#b9f227] text-[#b9f227] bg-[#242a1f]'
              : 'border-transparent text-[#a4abb2] hover:text-white'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp Fee Due Drafter
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
            activeTab === 'chat'
              ? 'border-[#b9f227] text-[#b9f227] bg-[#242a1f]'
              : 'border-transparent text-[#a4abb2] hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Interactive Gym AI Chat
        </button>
      </div>

      {/* Tab 1: Business & Profit Advisor */}
      {activeTab === 'advisor' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Executive Gym Profit & Leakage Analysis
                </h3>
                <p className="text-xs text-[#a4abb2]">
                  Gemini analyzes your collections, maintenance expenses (light bills, repairs) and outstanding member balances.
                </p>
              </div>

              <button
                onClick={handleRunAdvisor}
                disabled={isAnalyzing}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#b9f227] px-5 py-2.5 text-xs font-black text-[#151719] hover:brightness-110 disabled:opacity-40 shadow-lg shadow-[#b9f227]/20 transition"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing Gym Financials...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run AI Business Audit
                  </>
                )}
              </button>
            </div>

            {/* Analysis Result Display */}
            {advisorAnalysis ? (
              <div className="rounded-xl border border-[#34393e] bg-[#181a1d] p-5 text-xs leading-relaxed text-[#f4f5f6] whitespace-pre-line font-mono space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#34393e] text-[#a4abb2] text-[11px]">
                  <span>AI Business Audit Report · {selectedBranch}</span>
                  <button
                    onClick={() => copyToClipboard(advisorAnalysis, 1)}
                    className="flex items-center gap-1 text-[#b9f227] hover:underline"
                  >
                    {copiedIndex === 1 ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIndex === 1 ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div>{advisorAnalysis}</div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#34393e] p-8 text-center text-xs text-[#a4abb2]">
                <TrendingUp className="mx-auto h-8 w-8 text-[#b9f227] mb-2" />
                <p className="font-bold text-white">Click "Run AI Business Audit" above</p>
                <span>Gemini AI will scan all transactions, light bills and memberships to provide actionable recommendations.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Member Workout & Diet Architect */}
      {activeTab === 'workout' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white">
                IFBB Pro Member Workout & Diet Blueprint
              </h3>
              <p className="text-xs text-[#a4abb2]">
                Calculates daily calories, protein targets, and creates 7-day training routine based on weight and goal.
              </p>
            </div>

            {/* Select Member */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-[#a4abb2]">Select Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full rounded-xl border border-[#3a4045] bg-[#1e2124] px-3.5 py-2.5 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.weight}kg · Goal: {m.bodybuildingGoal} ({m.branch})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateWorkout}
                  disabled={isGeneratingWorkout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b9f227] py-2.5 text-xs font-black text-[#151719] hover:brightness-110 disabled:opacity-40 shadow-lg shadow-[#b9f227]/20 transition"
                >
                  {isGeneratingWorkout ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Creating Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Custom Blueprint
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Workout Output */}
            {workoutPlan ? (
              <div className="rounded-xl border border-[#34393e] bg-[#181a1d] p-5 text-xs leading-relaxed text-[#f4f5f6] whitespace-pre-line space-y-3 font-sans">
                <div className="flex justify-between items-center pb-2 border-b border-[#34393e] text-[#a4abb2] text-[11px]">
                  <span>Personalized 7-Day Protocol Generated</span>
                  <button
                    onClick={() => copyToClipboard(workoutPlan, 2)}
                    className="flex items-center gap-1 text-[#b9f227] hover:underline"
                  >
                    {copiedIndex === 2 ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIndex === 2 ? 'Copied to Clipboard' : 'Copy Full Plan'}
                  </button>
                </div>
                <div className="prose prose-invert max-w-none text-xs">{workoutPlan}</div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#34393e] p-8 text-center text-xs text-[#a4abb2]">
                <Dumbbell className="mx-auto h-8 w-8 text-[#b9f227] mb-2" />
                <p className="font-bold text-white">Select a member to design their training blueprint</p>
                <span>Includes push/pull/legs split, calorie & protein macros, and hydration advice.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: WhatsApp Fee Due Drafter */}
      {activeTab === 'reminder' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white">
                WhatsApp Fee Due Reminder Drafter
              </h3>
              <p className="text-xs text-[#a4abb2]">
                Drafts 3 friendly, urgent, and fitness-focused WhatsApp reminders with UPI ID embedded.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#a4abb2]">Member with Due</label>
                <select
                  value={reminderMemberId}
                  onChange={(e) => setReminderMemberId(e.target.value)}
                  className="w-full rounded-xl border border-[#3a4045] bg-[#1e2124] px-3.5 py-2.5 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — Due: ₹{m.dueAmount} ({m.plan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#a4abb2]">Message Tone</label>
                <select
                  value={reminderTone}
                  onChange={(e) => setReminderTone(e.target.value)}
                  className="w-full rounded-xl border border-[#3a4045] bg-[#1e2124] px-3.5 py-2.5 text-xs text-white focus:border-[#b9f227] focus:outline-none"
                >
                  <option value="Polite & Friendly">Polite & Friendly</option>
                  <option value="Direct & Urgent">Direct & Urgent (Expiry Notice)</option>
                  <option value="Motivational Gym Theme">Motivational ("Don't Break Your Gains Streak")</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateReminder}
                  disabled={isGeneratingReminder}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b9f227] py-2.5 text-xs font-black text-[#151719] hover:brightness-110 disabled:opacity-40 shadow-lg shadow-[#b9f227]/20 transition"
                >
                  {isGeneratingReminder ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Drafting...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" />
                      Draft 3 Messages
                    </>
                  )}
                </button>
              </div>
            </div>

            {remindersText ? (
              <div className="rounded-xl border border-[#34393e] bg-[#181a1d] p-5 text-xs leading-relaxed text-[#f4f5f6] whitespace-pre-line space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#34393e] text-[#a4abb2] text-[11px]">
                  <span>Ready-to-Send WhatsApp Copies</span>
                  <button
                    onClick={() => copyToClipboard(remindersText, 3)}
                    className="flex items-center gap-1 text-[#b9f227] hover:underline"
                  >
                    {copiedIndex === 3 ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIndex === 3 ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div>{remindersText}</div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#34393e] p-8 text-center text-xs text-[#a4abb2]">
                <MessageCircle className="mx-auto h-8 w-8 text-[#25d366] mb-2" />
                <p className="font-bold text-white">Select a member with dues to draft reminders</p>
                <span>Generates 3 persuasive options ready to paste directly on WhatsApp.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Gym AI Chat */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl border border-[#34393e] bg-[#202326] p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-white">Live Gym ERP Consultant</h3>
            <p className="text-xs text-[#a4abb2]">
              Chat directly with Gemini AI to ask questions about gym finance, trainer management, or member inquiries.
            </p>
          </div>

          {/* Quick Prompt Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              'How to reduce gym electricity & light bills?',
              'Suggest a Diwali / New Year annual membership offer',
              'Draft an announcement for holiday gym timings',
              'Recommend cardio maintenance routine for treadmills',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setChatInput(prompt)}
                className="rounded-lg border border-[#3a4045] bg-[#282c30] px-3 py-1.5 text-[11px] text-[#a4abb2] hover:text-white hover:border-[#b9f227] transition"
              >
                + {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="h-80 overflow-y-auto space-y-3 rounded-xl border border-[#34393e] bg-[#181a1d] p-4 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#b9f227] text-[#151719] font-semibold'
                      : 'bg-[#282c30] border border-[#34393e] text-[#f4f5f6]'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#747d84] mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-[#a4abb2] p-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#b9f227]" />
                <span>IronCore AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about members, expenses, workout protocols..."
              className="flex-1 rounded-xl border border-[#3a4045] bg-[#1e2124] px-4 py-2.5 text-xs text-white placeholder-[#747d84] focus:border-[#b9f227] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-[#b9f227] px-5 py-2.5 text-xs font-black text-[#151719] hover:brightness-110 disabled:opacity-40 transition"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
