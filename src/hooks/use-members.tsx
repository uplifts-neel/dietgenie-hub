
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type GymMember = {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  admission_number: string;
  gym_plan: "PT" | "Non-PT";
  registration_date: string;
};

export function useMembers() {
  const [members, setMembers] = useState<GymMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gym_members")
        .select("*")
        .order("registration_date", { ascending: false });

      if (error) throw error;
      
      setMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  async function addMember(member: Omit<GymMember, "id" | "registration_date" | "admission_number">) {
    try {
      // Get next admission number
      const { data: admissionData, error: admissionError } = await supabase
        .rpc("get_next_admission_number");
        
      if (admissionError) throw admissionError;
      
      const admissionNumber = admissionData;

      const { data, error } = await supabase
        .from("gym_members")
        .insert({
          name: member.name,
          address: member.address,
          phone_number: member.phone_number,
          gym_plan: member.gym_plan,
          admission_number: admissionNumber
        })
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => [data, ...prev]);
      toast.success(`Member registered with admission number: ${admissionNumber}`);
      return data;
    } catch (error: any) {
      console.error("Error adding member:", error);
      toast.error(error.message || "Failed to register member");
      return null;
    }
  }

  async function getMemberByAdmissionNumber(admissionNumber: string) {
    try {
      const { data, error } = await supabase
        .from("gym_members")
        .select("*")
        .eq("admission_number", admissionNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error("Member not found");
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error("Error fetching member:", error);
      toast.error(error.message || "Failed to load member details");
      return null;
    }
  }

  return {
    members,
    loading,
    addMember,
    getMemberByAdmissionNumber,
    refreshMembers: fetchMembers
  };
}
