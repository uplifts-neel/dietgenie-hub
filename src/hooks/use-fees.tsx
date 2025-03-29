
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type FeeStatus = "pending" | "paid" | "overdue";

export interface FeeRecord {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string | null;
  due_date: string;
  duration: string;
  status: FeeStatus;
  member_name: string;
  admission_number: string;
}

export const useFees = () => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const queryClient = useQueryClient();

  const fetchFees = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("fees")
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .order("due_date", { ascending: true });

      if (error) {
        throw error;
      }

      const formattedFees = data.map((fee) => ({
        id: fee.id,
        member_id: fee.member_id,
        amount: fee.amount,
        payment_date: fee.payment_date,
        due_date: fee.due_date,
        duration: fee.duration,
        status: fee.status as FeeStatus,
        member_name: fee.gym_members?.name,
        admission_number: fee.gym_members?.admission_number,
      }));

      setFees(formattedFees);
      return formattedFees;
    } catch (error: any) {
      toast.error("Failed to fetch fees: " + error.message);
      return [];
    }
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["fees"],
    queryFn: fetchFees,
  });

  const addFee = useCallback(
    async (newFee: Omit<FeeRecord, "id" | "member_name" | "admission_number">) => {
      try {
        const { data, error } = await supabase
          .from("fees")
          .insert([newFee])
          .select(`
            *,
            gym_members:member_id (name, admission_number)
          `);

        if (error) {
          throw error;
        }

        const formattedNewFee: FeeRecord = {
          id: data[0].id,
          member_id: data[0].member_id,
          amount: data[0].amount,
          payment_date: data[0].payment_date,
          due_date: data[0].due_date,
          duration: data[0].duration,
          status: data[0].status as FeeStatus,
          member_name: data[0].gym_members?.name,
          admission_number: data[0].gym_members?.admission_number,
        };

        setFees((prev) => [formattedNewFee, ...prev]);
        queryClient.invalidateQueries({ queryKey: ["fees"] });
        return formattedNewFee;
      } catch (error: any) {
        toast.error("Failed to add fee: " + error.message);
        throw error;
      }
    },
    [queryClient]
  );

  const updateFeeStatus = useCallback(
    async (id: string, status: FeeStatus, payment_date?: string) => {
      try {
        const updateData: {
          status: FeeStatus;
          payment_date?: string;
        } = {
          status,
        };

        if (payment_date) {
          updateData.payment_date = payment_date;
        }

        const { error } = await supabase
          .from("fees")
          .update(updateData)
          .eq("id", id);

        if (error) {
          throw error;
        }

        setFees((prev) =>
          prev.map((fee) =>
            fee.id === id
              ? { ...fee, status, payment_date: payment_date || fee.payment_date }
              : fee
          )
        );
        queryClient.invalidateQueries({ queryKey: ["fees"] });
        toast.success("Fee status updated");
      } catch (error: any) {
        toast.error("Failed to update fee status: " + error.message);
      }
    },
    [queryClient]
  );

  const getOverdueFees = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("fees")
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .eq("status", "overdue")
        .order("due_date", { ascending: true });

      if (error) {
        throw error;
      }

      return data.map((fee) => ({
        id: fee.id,
        member_id: fee.member_id,
        amount: fee.amount,
        payment_date: fee.payment_date,
        due_date: fee.due_date,
        duration: fee.duration,
        status: fee.status as FeeStatus,
        member_name: fee.gym_members?.name,
        admission_number: fee.gym_members?.admission_number,
      }));
    } catch (error: any) {
      toast.error("Failed to fetch overdue fees: " + error.message);
      return [];
    }
  }, []);

  return {
    fees,
    isLoading,
    addFee,
    updateFeeStatus,
    getOverdueFees,
    refetchFees: fetchFees,
  };
};
