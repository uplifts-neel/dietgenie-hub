
// Type definitions for the application context

export type Member = {
  id: string;
  admissionNumber: string;
  name: string;
  weight?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  feeType?: string;
  admissionType?: string;
  registrationDate?: string;
};

export type MealItem = {
  name: string;
  category: string;
  quantity: string;
  mealId?: string; // Reference to the original meal
};

export type TimeSlot = "Morning" | "Afternoon" | "BeforeGym" | "AfterGym" | "Evening" | "Night";

export type NutritionSummary = {
  protein: number;
  carbs: number;
  fats: number;
};

export type DietPlan = {
  id: string;
  memberId: string;
  memberName: string;
  admissionNumber: string;
  weight?: string;
  date: string;
  meals: Record<TimeSlot, MealItem[]>;
  nutrition?: NutritionSummary;
  isPinned?: boolean;
};

export type ContactInfo = {
  phone: string;
  instagram: string;
};

export type GymStats = {
  activeMembers: number;
  trainers: number;
  operationalHoursTitle: string;
  operationalHours: string;
};

export type Profile = {
  name: string;
  photo: string;
  achievements: string[];
  contactInfo?: ContactInfo;
  stats?: GymStats;
};

export type Fee = {
  id: string;
  memberId: string;
  memberName: string;
  admissionNumber: string;
  amount: number;
  paymentDate: string;
  startDate: string;
  endDate: string;
  feeType: string; // Monthly, Quarterly, Half-Year, Full-Year
  status: "Paid" | "Due" | "Overdue";
  createdAt: string;
};

// Define context type
export type AppContextType = {
  members: Member[];
  dietPlans: DietPlan[];
  fees: Fee[];
  profile: Profile;
  addMember: (member: Member) => string;
  addDietPlan: (plan: DietPlan) => void;
  updateDietPlan: (plan: DietPlan) => void;
  togglePinPlan: (planId: string) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateContactInfo: (contactInfo: ContactInfo) => void;
  updateStats: (stats: GymStats) => void;
  getMemberById: (id: string) => Member | undefined;
  getMemberByAdmissionNumber: (admissionNumber: string) => Member | undefined;
  getDietPlansByMemberId: (memberId: string) => DietPlan[];
  calculateNutrition: (meals: Record<TimeSlot, MealItem[]>) => NutritionSummary;
  deleteDietPlan: (planId: string) => void;
  addFee: (fee: Omit<Fee, "id" | "createdAt">) => void;
  updateFeeStatus: (feeId: string, status: Fee["status"]) => void;
  getDueFees: () => Fee[];
  getFeesByMemberId: (memberId: string) => Fee[];
};
