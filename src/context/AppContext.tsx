
import React, { createContext, useContext, useState, useEffect } from "react";
import { getMealById } from "@/data/mealOptions";
import { v4 as uuidv4 } from "uuid";

// Define types
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

// Define context type
type AppContextType = {
  members: Member[];
  dietPlans: DietPlan[];
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
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    const savedMembers = localStorage.getItem("members");
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => {
    const savedPlans = localStorage.getItem("dietPlans");
    return savedPlans ? JSON.parse(savedPlans) : [];
  });

  const [profile, setProfile] = useState<Profile>(() => {
    const savedProfile = localStorage.getItem("profile");
    return savedProfile 
      ? JSON.parse(savedProfile) 
      : {
          name: "DRONACHARYA THE GYM",
          photo: "",
          achievements: ["Certified Fitness Trainer", "Nutrition Specialist"],
          contactInfo: {
            phone: "+91 9999999999",
            instagram: "@dronacharya_gym"
          },
          stats: {
            activeMembers: 0,
            trainers: 5,
            operationalHoursTitle: "Operational Hours",
            operationalHours: "5AM - 10PM"
          }
        };
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("dietPlans", JSON.stringify(dietPlans));
  }, [dietPlans]);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  const calculateNutrition = (meals: Record<TimeSlot, MealItem[]>): NutritionSummary => {
    const summary: NutritionSummary = {
      protein: 0,
      carbs: 0,
      fats: 0
    };

    Object.values(meals).forEach(mealList => {
      mealList.forEach(meal => {
        if (meal.mealId) {
          const mealData = getMealById(meal.mealId);
          if (mealData && mealData.nutrition[meal.quantity]) {
            const nutrition = mealData.nutrition[meal.quantity];
            summary.protein += nutrition.protein;
            summary.carbs += nutrition.carbs;
            summary.fats += nutrition.fats;
          }
        }
      });
    });

    return summary;
  };

  // Generate a unique admission number (DGM001, DGM002, etc.)
  const generateAdmissionNumber = (): string => {
    let highestNum = 0;
    
    members.forEach(member => {
      if (member.admissionNumber.startsWith("DGM")) {
        const num = parseInt(member.admissionNumber.substring(3));
        if (!isNaN(num) && num > highestNum) {
          highestNum = num;
        }
      }
    });
    
    return `DGM${String(highestNum + 1).padStart(3, '0')}`;
  };

  const addMember = (member: Member): string => {
    const admissionNumber = generateAdmissionNumber();
    const newMember = { 
      ...member, 
      id: uuidv4(), 
      admissionNumber,
      registrationDate: new Date().toISOString()
    };
    
    setMembers(prev => [...prev, newMember]);
    return admissionNumber;
  };

  const addDietPlan = (plan: DietPlan) => {
    // Calculate and add nutrition data
    const nutrition = calculateNutrition(plan.meals);
    const updatedPlan = {
      ...plan,
      nutrition,
      isPinned: false
    };
    setDietPlans(prev => [...prev, updatedPlan]);
  };

  const updateDietPlan = (plan: DietPlan) => {
    // Calculate nutrition
    const nutrition = calculateNutrition(plan.meals);
    const updatedPlan = {
      ...plan,
      nutrition
    };
    setDietPlans(prev => prev.map(p => p.id === plan.id ? updatedPlan : p));
  };

  const togglePinPlan = (planId: string) => {
    setDietPlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? { ...plan, isPinned: !plan.isPinned } 
          : plan
      )
    );
  };

  const deleteDietPlan = (planId: string) => {
    setDietPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const updateProfile = (updatedProfile: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const updateContactInfo = (contactInfo: ContactInfo) => {
    setProfile(prev => ({
      ...prev,
      contactInfo
    }));
  };

  const updateStats = (stats: GymStats) => {
    setProfile(prev => ({
      ...prev,
      stats
    }));
  };

  const getMemberById = (id: string) => {
    return members.find(member => member.id === id);
  };

  const getMemberByAdmissionNumber = (admissionNumber: string) => {
    return members.find(member => member.admissionNumber === admissionNumber);
  };

  const getDietPlansByMemberId = (memberId: string) => {
    return dietPlans.filter(plan => plan.memberId === memberId);
  };

  return (
    <AppContext.Provider 
      value={{ 
        members, 
        dietPlans, 
        profile,
        addMember, 
        addDietPlan, 
        updateDietPlan,
        togglePinPlan,
        updateProfile,
        updateContactInfo,
        updateStats,
        getMemberById,
        getMemberByAdmissionNumber,
        getDietPlansByMemberId,
        calculateNutrition,
        deleteDietPlan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
