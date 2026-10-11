import {
  UserAccount,
  Member,
  PaymentRecord,
  ExpenseRecord,
  AttendanceRecord,
  Trainer,
  Branch,
  GymSettings,
  GymDatabase,
} from '../types';

const STORAGE_KEY = 'ironcore_gym_db_v1';
const CURRENT_USER_KEY = 'ironcore_gym_current_user_v1';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Central Branch',
    code: 'CB-01',
    address: 'Plot 42, Main Commercial Boulevard, Hyderabad',
    phone: '+91 98765 43210',
    managerName: 'Vikram Rathore',
    upiId: 'ironcore.central@upi',
  },
  {
    id: 'b2',
    name: 'North Branch',
    code: 'NB-02',
    address: 'Road 12, Banjara Enclave, Hyderabad',
    phone: '+91 98765 43211',
    managerName: 'Aman Khan',
    upiId: 'ironcore.north@upi',
  },
  {
    id: 'b3',
    name: 'South Branch',
    code: 'SB-03',
    address: 'Park Avenue, Jubilee Commercial Zone, Hyderabad',
    phone: '+91 98765 43212',
    managerName: 'Rahul Verma',
    upiId: 'ironcore.south@upi',
  },
  {
    id: 'b4',
    name: 'West Branch',
    code: 'WB-04',
    address: 'Cyber Towers Lane, Hitech City, Hyderabad',
    phone: '+91 98765 43213',
    managerName: 'Deepak Sharma',
    upiId: 'ironcore.west@upi',
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'u1',
    name: 'Mohammed Junaid',
    email: 'mohammedjunaid3550@gmail.com',
    role: 'Gym Owner',
    pin: '1234',
    avatarText: 'MJ',
    phone: '+91 98765 00001',
    branch: 'All Branches',
    createdAt: '2026-01-01',
  },
  {
    id: 'u2',
    name: 'Vikram Rathore',
    email: 'vikram.trainer@ironcore.com',
    role: 'Trainer',
    pin: '1234',
    avatarText: 'VR',
    phone: '+91 98765 00002',
    branch: 'Central Branch',
    createdAt: '2026-01-15',
  },
  {
    id: 'u3',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.reception@ironcore.com',
    role: 'Receptionist',
    pin: '1234',
    avatarText: 'AS',
    phone: '+91 98765 00003',
    branch: 'Central Branch',
    createdAt: '2026-02-01',
  },
  {
    id: 'u4',
    name: 'Aman Khan',
    email: 'aman.coach@ironcore.com',
    role: 'Trainer',
    pin: '1234',
    avatarText: 'AK',
    phone: '+91 98765 00004',
    branch: 'North Branch',
    createdAt: '2026-02-10',
  },
  {
    id: 'u5',
    name: 'Sneha Patel',
    email: 'sneha.desk@ironcore.com',
    role: 'Receptionist',
    pin: '1234',
    avatarText: 'SP',
    phone: '+91 98765 00005',
    branch: 'North Branch',
    createdAt: '2026-03-01',
  },
  {
    id: 'u6',
    name: 'Rahul Verma',
    email: 'rahul.strength@ironcore.com',
    role: 'Trainer',
    pin: '1234',
    avatarText: 'RV',
    phone: '+91 98765 00006',
    branch: 'South Branch',
    createdAt: '2026-03-15',
  },
  {
    id: 'u7',
    name: 'Deepak Sharma',
    email: 'deepak.manager@ironcore.com',
    role: 'Trainer',
    pin: '1234',
    avatarText: 'DS',
    phone: '+91 98765 00007',
    branch: 'West Branch',
    createdAt: '2026-04-01',
  },
  {
    id: 'u8',
    name: 'Priya Rao',
    email: 'priya.billing@ironcore.com',
    role: 'Receptionist',
    pin: '1234',
    avatarText: 'PR',
    phone: '+91 98765 00008',
    branch: 'South Branch',
    createdAt: '2026-04-10',
  },
  {
    id: 'u9',
    name: 'Arjun Mehta',
    email: 'arjun.pro@ironcore.com',
    role: 'Trainer',
    pin: '1234',
    avatarText: 'AM',
    phone: '+91 98765 00009',
    branch: 'West Branch',
    createdAt: '2026-05-01',
  },
  {
    id: 'u10',
    name: 'Rohan Gupta',
    email: 'rohan.maintenance@ironcore.com',
    role: 'Receptionist',
    pin: '1234',
    avatarText: 'RG',
    phone: '+91 98765 00010',
    branch: 'All Branches',
    createdAt: '2026-05-15',
  },
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'tr1',
    name: 'Vikram Rathore',
    role: 'Head Strength Coach',
    phone: '+91 98765 00002',
    email: 'vikram.trainer@ironcore.com',
    branch: 'Central Branch',
    salary: 32000,
    status: 'Present',
    assignedMembers: 24,
    specialization: 'Classic Physique & Hypertrophy',
    joinedDate: '2026-01-15',
  },
  {
    id: 'tr2',
    name: 'Aman Khan',
    role: 'Senior Fitness Coach',
    phone: '+91 98765 00004',
    email: 'aman.coach@ironcore.com',
    branch: 'North Branch',
    salary: 28000,
    status: 'Present',
    assignedMembers: 19,
    specialization: 'Men\'s Physique & Fat Loss',
    joinedDate: '2026-02-10',
  },
  {
    id: 'tr3',
    name: 'Rahul Verma',
    role: 'Powerlifting Specialist',
    phone: '+91 98765 00006',
    email: 'rahul.strength@ironcore.com',
    branch: 'South Branch',
    salary: 29000,
    status: 'Present',
    assignedMembers: 21,
    specialization: 'Powerlifting & Functional Strength',
    joinedDate: '2026-03-15',
  },
  {
    id: 'tr4',
    name: 'Deepak Sharma',
    role: 'Crossfit & Conditioning Trainer',
    phone: '+91 98765 00007',
    email: 'deepak.manager@ironcore.com',
    branch: 'West Branch',
    salary: 27000,
    status: 'Leave',
    assignedMembers: 16,
    specialization: 'HIIT & Endurance Shred',
    joinedDate: '2026-04-01',
  },
  {
    id: 'tr5',
    name: 'Arjun Mehta',
    role: 'IFBB Pro Prep Trainer',
    phone: '+91 98765 00009',
    email: 'arjun.pro@ironcore.com',
    branch: 'Central Branch',
    salary: 35000,
    status: 'Present',
    assignedMembers: 14,
    specialization: 'Competition Prep & Calisthenics',
    joinedDate: '2026-05-01',
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    memberCode: 'IC-CB-101',
    name: 'Aarav Sharma',
    phone: '98765 11001',
    email: 'aarav.sharma@example.com',
    branch: 'Central Branch',
    plan: 'Quarterly (₹4,200)',
    joinedDate: '2026-08-01',
    expiryDate: '2026-11-01',
    status: 'Active',
    totalFee: 4200,
    paidAmount: 4200,
    dueAmount: 0,
    trainerId: 'tr1',
    trainerName: 'Vikram Rathore',
    weight: 78.5,
    height: 178,
    bodybuildingGoal: 'Classic Physique',
    emergencyContact: '98765 99001 (Father)',
    medicalNotes: 'No prior heart or knee conditions. Healthy.',
    lastCheckIn: '2026-10-11 06:45 AM',
  },
  {
    id: 'm2',
    memberCode: 'IC-NB-102',
    name: 'Priya Reddy',
    phone: '98765 11002',
    email: 'priya.reddy@example.com',
    branch: 'North Branch',
    plan: 'Monthly (₹1,500)',
    joinedDate: '2026-09-12',
    expiryDate: '2026-10-12',
    status: 'Expiring',
    totalFee: 1500,
    paidAmount: 1500,
    dueAmount: 0,
    trainerId: 'tr2',
    trainerName: 'Aman Khan',
    weight: 58.0,
    height: 165,
    bodybuildingGoal: 'Weight Loss & Shred',
    emergencyContact: '98765 99002 (Spouse)',
    medicalNotes: 'Mild lower back stiffness; avoid heavy deadlifts.',
    lastCheckIn: '2026-10-10 07:15 PM',
  },
  {
    id: 'm3',
    memberCode: 'IC-CB-103',
    name: 'Mohammed Faiz',
    phone: '98765 11003',
    email: 'mohammed.faiz@example.com',
    branch: 'Central Branch',
    plan: 'Quarterly (₹4,200)',
    joinedDate: '2026-09-15',
    expiryDate: '2026-12-15',
    status: 'Due',
    totalFee: 4200,
    paidAmount: 1500,
    dueAmount: 2700,
    trainerId: 'tr1',
    trainerName: 'Vikram Rathore',
    weight: 84.0,
    height: 182,
    bodybuildingGoal: 'Hypertrophy / Muscle Building',
    emergencyContact: '98765 99003 (Brother)',
    medicalNotes: 'None.',
    lastCheckIn: '2026-10-11 08:30 AM',
  },
  {
    id: 'm4',
    memberCode: 'IC-SB-104',
    name: 'Ananya Das',
    phone: '98765 11004',
    email: 'ananya.das@example.com',
    branch: 'South Branch',
    plan: 'Half-Yearly (₹7,500)',
    joinedDate: '2026-06-01',
    expiryDate: '2026-12-01',
    status: 'Active',
    totalFee: 7500,
    paidAmount: 7500,
    dueAmount: 0,
    trainerId: 'tr3',
    trainerName: 'Rahul Verma',
    weight: 62.5,
    height: 168,
    bodybuildingGoal: 'General Fitness & Stamina',
    emergencyContact: '98765 99004',
    medicalNotes: 'None.',
    lastCheckIn: '2026-10-10 06:10 PM',
  },
  {
    id: 'm5',
    memberCode: 'IC-WB-105',
    name: 'Vikram Patel',
    phone: '98765 11005',
    email: 'vikram.patel@example.com',
    branch: 'West Branch',
    plan: 'Monthly (₹1,500)',
    joinedDate: '2026-08-01',
    expiryDate: '2026-09-01',
    status: 'Expired',
    totalFee: 1500,
    paidAmount: 0,
    dueAmount: 1500,
    trainerId: 'tr4',
    trainerName: 'Deepak Sharma',
    weight: 92.0,
    height: 175,
    bodybuildingGoal: 'Weight Loss & Shred',
    emergencyContact: '98765 99005',
    medicalNotes: 'Blood pressure checked monthly.',
  },
  {
    id: 'm6',
    memberCode: 'IC-CB-106',
    name: 'Sara Khan',
    phone: '98765 11006',
    email: 'sara.khan@example.com',
    branch: 'Central Branch',
    plan: 'Annual (₹13,500)',
    joinedDate: '2026-05-20',
    expiryDate: '2027-05-20',
    status: 'Active',
    totalFee: 13500,
    paidAmount: 13500,
    dueAmount: 0,
    trainerId: 'tr5',
    trainerName: 'Arjun Mehta',
    weight: 54.0,
    height: 162,
    bodybuildingGoal: 'Men\'s Physique',
    emergencyContact: '98765 99006',
    lastCheckIn: '2026-10-11 07:00 AM',
  },
  {
    id: 'm7',
    memberCode: 'IC-SB-107',
    name: 'Arjun Rao',
    phone: '98765 11007',
    email: 'arjun.rao@example.com',
    branch: 'South Branch',
    plan: 'Personal Training (₹3,500/mo)',
    joinedDate: '2026-10-01',
    expiryDate: '2026-11-01',
    status: 'Active',
    totalFee: 3500,
    paidAmount: 3500,
    dueAmount: 0,
    trainerId: 'tr3',
    trainerName: 'Rahul Verma',
    weight: 86.5,
    height: 180,
    bodybuildingGoal: 'Powerlifting & Strength',
    emergencyContact: '98765 99007',
    medicalNotes: 'Powerlifter, focus on Bench & Squat form.',
    lastCheckIn: '2026-10-11 09:15 AM',
  },
  {
    id: 'm8',
    memberCode: 'IC-WB-108',
    name: 'Meera Iyer',
    phone: '98765 11008',
    email: 'meera.iyer@example.com',
    branch: 'West Branch',
    plan: 'Quarterly (₹4,200)',
    joinedDate: '2026-10-03',
    expiryDate: '2027-01-03',
    status: 'Active',
    totalFee: 4200,
    paidAmount: 4200,
    dueAmount: 0,
    trainerId: 'tr4',
    trainerName: 'Deepak Sharma',
    weight: 60.0,
    height: 167,
    bodybuildingGoal: 'Crossfit & Conditioning',
    emergencyContact: '98765 99008',
    lastCheckIn: '2026-10-10 05:45 PM',
  },
  {
    id: 'm9',
    memberCode: 'IC-NB-109',
    name: 'Rohan Deshmukh',
    phone: '98765 11009',
    email: 'rohan.d@example.com',
    branch: 'North Branch',
    plan: 'Quarterly (₹4,200)',
    joinedDate: '2026-09-28',
    expiryDate: '2026-12-28',
    status: 'Due',
    totalFee: 4200,
    paidAmount: 2000,
    dueAmount: 2200,
    trainerId: 'tr2',
    trainerName: 'Aman Khan',
    weight: 76.0,
    height: 174,
    bodybuildingGoal: 'Hypertrophy / Muscle Building',
    emergencyContact: '98765 99009',
  },
  {
    id: 'm10',
    memberCode: 'IC-CB-110',
    name: 'Kavita Chawla',
    phone: '98765 11010',
    email: 'kavita.c@example.com',
    branch: 'Central Branch',
    plan: 'Monthly (₹1,500)',
    joinedDate: '2026-10-05',
    expiryDate: '2026-11-05',
    status: 'Active',
    totalFee: 1500,
    paidAmount: 1500,
    dueAmount: 0,
    trainerId: 'tr1',
    trainerName: 'Vikram Rathore',
    weight: 65.0,
    height: 164,
    bodybuildingGoal: 'Weight Loss & Shred',
    emergencyContact: '98765 99010',
    lastCheckIn: '2026-10-11 08:00 AM',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'p1',
    receiptNo: 'BILL-2026-1001',
    memberId: 'm1',
    memberName: 'Aarav Sharma',
    branch: 'Central Branch',
    amount: 4200,
    paymentMethod: 'UPI',
    date: '2026-10-09',
    time: '11:25 AM',
    status: 'Paid',
    upiRef: 'UPI/6291048201/AXIS',
    notes: 'Full Quarterly renewal fee via Google Pay',
    collectedBy: 'Ayesha Siddiqui',
  },
  {
    id: 'p2',
    receiptNo: 'BILL-2026-1002',
    memberId: 'm4',
    memberName: 'Ananya Das',
    branch: 'South Branch',
    amount: 7500,
    paymentMethod: 'Cash',
    date: '2026-10-08',
    time: '04:15 PM',
    status: 'Paid',
    notes: 'Half-yearly cash payment verified by owner',
    collectedBy: 'Priya Rao',
  },
  {
    id: 'p3',
    receiptNo: 'BILL-2026-1003',
    memberId: 'm8',
    memberName: 'Meera Iyer',
    branch: 'West Branch',
    amount: 4200,
    paymentMethod: 'UPI',
    date: '2026-10-08',
    time: '06:40 PM',
    status: 'Paid',
    upiRef: 'UPI/9912048291/HDFC',
    notes: 'Paid via PhonePe QR code scan at desk',
    collectedBy: 'Mohammed Junaid',
  },
  {
    id: 'p4',
    receiptNo: 'BILL-2026-1004',
    memberId: 'm3',
    memberName: 'Mohammed Faiz',
    branch: 'Central Branch',
    amount: 1500,
    paymentMethod: 'Cash',
    date: '2026-10-07',
    time: '10:10 AM',
    status: 'Partial',
    notes: 'Partial deposit. Balance ₹2,700 due by Oct 20.',
    collectedBy: 'Ayesha Siddiqui',
  },
  {
    id: 'p5',
    receiptNo: 'BILL-2026-1005',
    memberId: 'm7',
    memberName: 'Arjun Rao',
    branch: 'South Branch',
    amount: 3500,
    paymentMethod: 'UPI',
    date: '2026-10-06',
    time: '02:30 PM',
    status: 'Paid',
    upiRef: 'UPI/5581902847/ICICI',
    notes: 'Personal Training monthly package',
    collectedBy: 'Priya Rao',
  },
  {
    id: 'p6',
    receiptNo: 'BILL-2026-1006',
    memberId: 'm10',
    memberName: 'Kavita Chawla',
    branch: 'Central Branch',
    amount: 1500,
    paymentMethod: 'UPI',
    date: '2026-10-05',
    time: '09:00 AM',
    status: 'Paid',
    upiRef: 'UPI/7839201948/PAYTM',
    notes: 'Monthly membership new joiner',
    collectedBy: 'Ayesha Siddiqui',
  },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'e1',
    billNo: 'EXP-CB-2026-01',
    title: 'Central Gym Electricity & Power Bill (TSSPDCL)',
    category: 'Electricity / Light Bill',
    branch: 'Central Branch',
    amount: 16800,
    date: '2026-10-02',
    vendor: 'State Electricity Department',
    paidBy: 'Mohammed Junaid',
    notes: 'Commercial AC and high-intensity workout floor lights.',
  },
  {
    id: 'e2',
    billNo: 'EXP-NB-2026-02',
    title: 'Treadmill Motor Replacement & Cable Service',
    category: 'Equipment Repair & Maintenance',
    branch: 'North Branch',
    amount: 9400,
    date: '2026-10-04',
    vendor: 'ProFit Gym Equipment Technicians',
    paidBy: 'Aman Khan',
    notes: 'Replaced 4HP treadmill drive belt and Olympic cable crossover pulley.',
  },
  {
    id: 'e3',
    billNo: 'EXP-SB-2026-03',
    title: 'Monthly Gym Premises Rent - October 2026',
    category: 'Gym Rent',
    branch: 'South Branch',
    amount: 48000,
    date: '2026-10-01',
    vendor: 'Jubilee Commercial Realty',
    paidBy: 'Mohammed Junaid',
    notes: 'Floor 2 & 3 commercial rent cleared via RTGS bank transfer.',
  },
  {
    id: 'e4',
    billNo: 'EXP-WB-2026-04',
    title: 'Daikin Central Inverter AC Servicing & Gas Refill',
    category: 'AC / HVAC Servicing',
    branch: 'West Branch',
    amount: 7200,
    date: '2026-10-06',
    vendor: 'CoolAir HVAC Solutions',
    paidBy: 'Deepak Sharma',
    notes: 'Both duct units in cardio hall and heavy weight section tuned.',
  },
  {
    id: 'e5',
    billNo: 'EXP-CB-2026-05',
    title: 'Water Cans & Sanitization / Floor Disinfectants',
    category: 'Cleaning & Housekeeping',
    branch: 'Central Branch',
    amount: 3500,
    date: '2026-10-08',
    vendor: 'CleanGym Hygiene Suppliers',
    paidBy: 'Ayesha Siddiqui',
    notes: '30 RO mineral water bubble tops and antiseptic floor liquids.',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att1',
    memberId: 'm1',
    memberName: 'Aarav Sharma',
    branch: 'Central Branch',
    date: '2026-10-11',
    inTime: '06:45 AM',
    outTime: '08:15 AM',
    recordedBy: 'Ayesha Siddiqui',
    status: 'Checked Out',
  },
  {
    id: 'att2',
    memberId: 'm3',
    memberName: 'Mohammed Faiz',
    branch: 'Central Branch',
    date: '2026-10-11',
    inTime: '08:30 AM',
    recordedBy: 'Ayesha Siddiqui',
    status: 'In Gym',
  },
  {
    id: 'att3',
    memberId: 'm6',
    memberName: 'Sara Khan',
    branch: 'Central Branch',
    date: '2026-10-11',
    inTime: '07:00 AM',
    outTime: '08:30 AM',
    recordedBy: 'Ayesha Siddiqui',
    status: 'Checked Out',
  },
  {
    id: 'att4',
    memberId: 'm7',
    memberName: 'Arjun Rao',
    branch: 'South Branch',
    date: '2026-10-11',
    inTime: '09:15 AM',
    recordedBy: 'Priya Rao',
    status: 'In Gym',
  },
  {
    id: 'att5',
    memberId: 'm10',
    memberName: 'Kavita Chawla',
    branch: 'Central Branch',
    date: '2026-10-11',
    inTime: '08:00 AM',
    recordedBy: 'Ayesha Siddiqui',
    status: 'In Gym',
  },
];

export const INITIAL_SETTINGS: GymSettings = {
  gymName: 'IronCore Fitness & Bodybuilding ERP',
  phone: '+91 98765 00001',
  email: 'mohammedjunaid3550@gmail.com',
  ownerUpiId: 'mohammedjunaid3550@okhdfcbank',
  ownerUpiName: 'IronCore Fitness Group',
  gstNumber: '36ABCDE1234F1Z5',
  address: 'Plot 42, Main Commercial Boulevard, Hyderabad - 500034',
  currencySymbol: '₹',
  maxMembersLimit: 500,
};

export function loadGymDatabase(): GymDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: GymDatabase = {
        users: INITIAL_USERS,
        members: INITIAL_MEMBERS,
        payments: INITIAL_PAYMENTS,
        expenses: INITIAL_EXPENSES,
        attendance: INITIAL_ATTENDANCE,
        trainers: INITIAL_TRAINERS,
        branches: INITIAL_BRANCHES,
        settings: INITIAL_SETTINGS,
        version: 1,
      };
      saveGymDatabase(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || INITIAL_USERS,
      members: parsed.members || INITIAL_MEMBERS,
      payments: parsed.payments || INITIAL_PAYMENTS,
      expenses: parsed.expenses || INITIAL_EXPENSES,
      attendance: parsed.attendance || INITIAL_ATTENDANCE,
      trainers: parsed.trainers || INITIAL_TRAINERS,
      branches: parsed.branches || INITIAL_BRANCHES,
      settings: parsed.settings || INITIAL_SETTINGS,
      version: parsed.version || 1,
    };
  } catch (err) {
    console.error('Failed reading gym database from local physical storage:', err);
    return {
      users: INITIAL_USERS,
      members: INITIAL_MEMBERS,
      payments: INITIAL_PAYMENTS,
      expenses: INITIAL_EXPENSES,
      attendance: INITIAL_ATTENDANCE,
      trainers: INITIAL_TRAINERS,
      branches: INITIAL_BRANCHES,
      settings: INITIAL_SETTINGS,
      version: 1,
    };
  }
}

export function saveGymDatabase(db: GymDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed writing gym database to local storage:', err);
  }
}

export function getCurrentUser(users: UserAccount[]): UserAccount {
  try {
    const savedId = localStorage.getItem(CURRENT_USER_KEY);
    if (savedId) {
      const found = users.find((u) => u.id === savedId);
      if (found) return found;
    }
  } catch (e) {
    // fallback
  }
  return users[0] || INITIAL_USERS[0];
}

export function setCurrentUser(user: UserAccount): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
  } catch (e) {
    console.error(e);
  }
}

// Physical Phone Storage: Export Database as JSON File
export function exportDatabaseBackup(db: GymDatabase): void {
  const json = JSON.stringify(db, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `ironcore_gym_physical_backup_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Physical Phone Storage: Import Database from JSON File
export function importDatabaseBackup(jsonString: string): GymDatabase {
  const data = JSON.parse(jsonString);
  if (!Array.isArray(data.members) || !Array.isArray(data.users)) {
    throw new Error('Invalid IronCore backup file format.');
  }
  saveGymDatabase(data);
  return data;
}

// Helper to export clean CSV sheets
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) =>
      row
        .map((val) => {
          const str = String(val ?? '');
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// 500 Members Test Data Seeder
export function seedScaleMembers(existing: Member[], countToAdd: number = 40): Member[] {
  const firstNames = [
    'Rohit', 'Sanjay', 'Kiran', 'Naveen', 'Imran', 'Zubair', 'Farhan', 'Divya',
    'Manish', 'Harish', 'Sameer', 'Pooja', 'Tanvi', 'Abhishek', 'Gautam', 'Kunal',
    'Rishabh', 'Aditi', 'Shreya', 'Chetan', 'Varun', 'Nikhil', 'Simran', 'Akash'
  ];
  const lastNames = [
    'Reddy', 'Sharma', 'Verma', 'Khan', 'Iyer', 'Patel', 'Singh', 'Gupta',
    'Naidu', 'Kumar', 'Joshi', 'Choudhary', 'Malhotra', 'Bhatia', 'Menon', 'Rao'
  ];
  const branches = ['Central Branch', 'North Branch', 'South Branch', 'West Branch'];
  const plans = [
    { name: 'Monthly (₹1,500)', fee: 1500, days: 30 },
    { name: 'Quarterly (₹4,200)', fee: 4200, days: 90 },
    { name: 'Half-Yearly (₹7,500)', fee: 7500, days: 180 },
    { name: 'Annual (₹13,500)', fee: 13500, days: 365 },
  ];
  const goals: Member['bodybuildingGoal'][] = [
    'Hypertrophy / Muscle Building',
    'Classic Physique',
    'Men\'s Physique',
    'Weight Loss & Shred',
    'Powerlifting & Strength',
    'General Fitness & Stamina',
    'Crossfit & Conditioning',
  ];

  const newMembers: Member[] = [];
  const currentCount = existing.length;

  for (let i = 1; i <= countToAdd; i++) {
    const idx = currentCount + i;
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const plan = plans[Math.floor(Math.random() * plans.length)];
    const goal = goals[Math.floor(Math.random() * goals.length)];
    const weight = Math.round((55 + Math.random() * 45) * 10) / 10;
    const height = Math.round(160 + Math.random() * 28);
    const hasDue = Math.random() > 0.65;
    const paid = hasDue ? Math.round(plan.fee * 0.4) : plan.fee;
    const due = plan.fee - paid;

    const joinDate = new Date();
    joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 60));
    const expDate = new Date(joinDate);
    expDate.setDate(expDate.getDate() + plan.days);

    const isExpired = expDate < new Date();
    const isExpiring = !isExpired && expDate.getTime() - new Date().getTime() < 7 * 24 * 3600 * 1000;

    let status: Member['status'] = 'Active';
    if (isExpired) status = 'Expired';
    else if (hasDue) status = 'Due';
    else if (isExpiring) status = 'Expiring';

    newMembers.push({
      id: `m_seeded_${idx}_${Date.now()}`,
      memberCode: `IC-${branch.slice(0, 2).toUpperCase()}-${200 + idx}`,
      name: `${fn} ${ln}`,
      phone: `98765 ${String(12000 + idx).padStart(5, '0')}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${idx}@example.com`,
      branch,
      plan: plan.name,
      joinedDate: joinDate.toISOString().slice(0, 10),
      expiryDate: expDate.toISOString().slice(0, 10),
      status,
      totalFee: plan.fee,
      paidAmount: paid,
      dueAmount: due,
      trainerName: branch.includes('Central') ? 'Vikram Rathore' : branch.includes('North') ? 'Aman Khan' : 'Rahul Verma',
      weight,
      height,
      bodybuildingGoal: goal,
      emergencyContact: `98765 99${String(100 + idx).slice(-3)}`,
    });
  }

  return [...existing, ...newMembers];
}
