
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Import types
import { 
  AppContextType, 
  Member, 
  DietPlan, 
  Fee, 
  Profile, 
  ContactInfo, 
  GymStats, 
  TimeSlot, 
  MealItem, 
  NutritionSummary
} from "./types";

// Import services
import { 
  createMember, 
  findMemberById, 
  findMemberByAdmissionNumber 
} from "./memberService";

import { 
  createDietPlan, 
  updateDietPlan as updatePlan, 
  togglePlanPin, 
  getDietPlansByMemberId 
} from "./dietPlanService";

import { 
  createFee, 
  updateFee, 
  getDueFees as getOverdueFees, 
  getFeesByMemberId as getFeesByMember 
} from "./feeService";

import { calculateNutrition } from "./utils";

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

  const [fees, setFees] = useState<Fee[]>(() => {
    const savedFees = localStorage.getItem("fees");
    return savedFees ? JSON.parse(savedFees) : [];
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
    localStorage.setItem("fees", JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // Member functions
  const addMember = (member: Member): string => {
    const { newMember, admissionNumber } = createMember(members, member);
    setMembers(prev => [...prev, newMember]);
    return admissionNumber;
  };

  const getMemberById = (id: string) => {
    return findMemberById(members, id);
  };

  const getMemberByAdmissionNumber = (admissionNumber: string) => {
    return findMemberByAdmissionNumber(members, admissionNumber);
  };

  // Diet plan functions
  const addDietPlan = (plan: DietPlan) => {
    const newPlan = createDietPlan(plan);
    setDietPlans(prev => [...prev, newPlan]);
  };

  const updateDietPlan = (plan: DietPlan) => {
    const updatedPlan = updatePlan(plan);
    setDietPlans(prev => prev.map(p => p.id === plan.id ? updatedPlan : p));
  };

  const togglePinPlan = (planId: string) => {
    setDietPlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? togglePlanPin(plan) 
          : plan
      )
    );
  };

  const deleteDietPlan = (planId: string) => {
    setDietPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  // Profile functions
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

  // Fee functions
  const addFee = (feeData: Omit<Fee, "id" | "createdAt">) => {
    const newFee = createFee(feeData);
    setFees(prev => [...prev, newFee]);
  };

  const updateFeeStatus = (feeId: string, status: Fee["status"]) => {
    setFees(prev => prev.map(fee => 
      fee.id === feeId ? updateFee(fee, status) : fee
    ));
  };

  const getDueFees = () => {
    return getOverdueFees(fees);
  };

  const getFeesByMemberId = (memberId: string) => {
    return getFeesByMember(fees, memberId);
  };

  return (
    <AppContext.Provider 
      value={{ 
        members, 
        dietPlans,
        fees,
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
        getDietPlansByMemberId: (memberId) => getDietPlansByMemberId(dietPlans, memberId),
        calculateNutrition,
        deleteDietPlan,
        addFee,
        updateFeeStatus,
        getDueFees,
        getFeesByMemberId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Re-export all types from types.ts for easier imports elsewhere
export * from "./types";
