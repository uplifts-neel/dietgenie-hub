
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type GymPlan = "PT" | "Non-PT";

export interface GymMember {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  admission_number: string;
  gym_plan: GymPlan;
  registration_date: string;
  created_at: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<GymMember[]>([]);
  const queryClient = useQueryClient();

  const fetchMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("gym_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Cast gym_plan to GymPlan type
      const typedMembers = data.map(member => ({
        ...member,
        gym_plan: member.gym_plan as GymPlan
      }));

      setMembers(typedMembers);
      return typedMembers;
    } catch (error: any) {
      toast.error("Failed to fetch members: " + error.message);
      return [];
    }
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const addMember = useCallback(
    async (newMember: Omit<GymMember, "id" | "created_at" | "registration_date">) => {
      try {
        const { data, error } = await supabase
          .from("gym_members")
          .insert([newMember])
          .select();

        if (error) {
          throw error;
        }

        // Cast gym_plan to GymPlan type
        const typedNewMember = {
          ...data[0],
          gym_plan: data[0].gym_plan as GymPlan
        };

        setMembers((prev) => [typedNewMember, ...prev]);
        queryClient.invalidateQueries({ queryKey: ["members"] });
        return typedNewMember;
      } catch (error: any) {
        toast.error("Failed to add member: " + error.message);
        throw error;
      }
    },
    [queryClient]
  );

  const getMemberByAdmissionNumber = useCallback(
    async (admissionNumber: string) => {
      try {
        const { data, error } = await supabase
          .from("gym_members")
          .select("*")
          .eq("admission_number", admissionNumber)
          .single();

        if (error) {
          throw error;
        }

        // Cast gym_plan to GymPlan type
        return {
          ...data,
          gym_plan: data.gym_plan as GymPlan
        };
      } catch (error: any) {
        toast.error("Member not found");
        throw error;
      }
    },
    []
  );

  const getNextAdmissionNumber = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc("get_next_admission_number");

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      toast.error("Failed to generate admission number");
      throw error;
    }
  }, []);

  return {
    members,
    isLoading,
    addMember,
    getMemberByAdmissionNumber,
    getNextAdmissionNumber,
    refetchMembers: fetchMembers,
  };
};
