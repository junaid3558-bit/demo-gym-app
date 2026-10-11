export type Role = 'Gym Owner' | 'Trainer' | 'Receptionist' | 'Member';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  pin: string;
  avatarText: string;
  phone: string;
  branch: string;
  createdAt: string;
}

export type BodybuildingGoal =
  | 'Hypertrophy / Muscle Building'
  | 'Classic Physique'
  | 'Men\'s Physique'
  | 'Weight Loss & Shred'
  | 'Powerlifting & Strength'
  | 'General Fitness & Stamina'
  | 'Crossfit & Conditioning';

export type MembershipPlan =
  | 'Monthly (₹1,500)'
  | 'Quarterly (₹4,200)'
  | 'Half-Yearly (₹7,500)'
  | 'Annual (₹13,500)'
  | 'Personal Training (₹3,500/mo)'
  | 'VIP All-Branch Pass (₹18,000/yr)';

export type MemberStatus = 'Active' | 'Expiring' | 'Due' | 'Expired' | 'Frozen';

export interface Member {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  email: string;
  branch: string;
  plan: string;
  joinedDate: string;
  expiryDate: string;
  status: MemberStatus;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  trainerId?: string;
  trainerName: string;
  weight: number; // in kg
  height?: number; // in cm
  bodybuildingGoal: BodybuildingGoal;
  photoUrl?: string; // Base64 or avatar
  emergencyContact?: string;
  medicalNotes?: string;
  lastCheckIn?: string;
}

export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';

export interface PaymentRecord {
  id: string;
  receiptNo: string;
  memberId: string;
  memberName: string;
  branch: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  time: string;
  status: 'Paid' | 'Partial' | 'Pending';
  upiRef?: string;
  notes?: string;
  collectedBy: string;
}

export type ExpenseCategory =
  | 'Electricity / Light Bill'
  | 'Equipment Repair & Maintenance'
  | 'Gym Rent'
  | 'Trainer & Staff Salary'
  | 'Water & Sanitation'
  | 'Cleaning & Housekeeping'
  | 'AC / HVAC Servicing'
  | 'Supplements & Merchandise'
  | 'Marketing & Promotions'
  | 'Other Operational';

export interface ExpenseRecord {
  id: string;
  billNo: string;
  title: string;
  category: ExpenseCategory;
  branch: string;
  amount: number;
  date: string;
  vendor: string;
  paidBy: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  branch: string;
  date: string;
  inTime: string;
  outTime?: string;
  recordedBy: string;
  status: 'In Gym' | 'Checked Out';
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  branch: string;
  salary: number;
  status: 'Present' | 'Leave' | 'Off';
  assignedMembers: number;
  specialization: string;
  joinedDate: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  managerName: string;
  upiId: string;
}

export interface GymSettings {
  gymName: string;
  phone: string;
  email: string;
  ownerUpiId: string;
  ownerUpiName: string;
  gstNumber: string;
  address: string;
  currencySymbol: string;
  maxMembersLimit: number;
}

export interface GymDatabase {
  users: UserAccount[];
  members: Member[];
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  attendance: AttendanceRecord[];
  trainers: Trainer[];
  branches: Branch[];
  settings: GymSettings;
  version: number;
}

