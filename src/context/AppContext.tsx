
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types
export type Member = {
  id: string;
  admissionNumber: string;
  name: string;
  weight: string;
};

export type MealItem = {
  name: string;
  category: string;
  quantity: string;
};

export type TimeSlot = "Morning" | "Afternoon" | "BeforeGym" | "AfterGym" | "Evening" | "Night";

export type DietPlan = {
  id: string;
  memberId: string;
  memberName: string;
  admissionNumber: string;
  weight: string;
  date: string;
  meals: Record<TimeSlot, MealItem[]>;
};

export type Profile = {
  name: string;
  photo: string;
  achievements: string[];
};

// Define context type
type AppContextType = {
  members: Member[];
  dietPlans: DietPlan[];
  profile: Profile;
  addMember: (member: Member) => void;
  addDietPlan: (plan: DietPlan) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  getMemberById: (id: string) => Member | undefined;
  getDietPlansByMemberId: (memberId: string) => DietPlan[];
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
          name: "Trainer",
          photo: "",
          achievements: ["Certified Fitness Trainer", "Nutrition Specialist"]
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

  const addMember = (member: Member) => {
    setMembers(prev => [...prev, member]);
  };

  const addDietPlan = (plan: DietPlan) => {
    setDietPlans(prev => [...prev, plan]);
  };

  const updateProfile = (updatedProfile: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const getMemberById = (id: string) => {
    return members.find(member => member.id === id);
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
        updateProfile,
        getMemberById,
        getDietPlansByMemberId
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
