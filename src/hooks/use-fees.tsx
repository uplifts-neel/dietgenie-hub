
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type FeeRecord = {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string | null;
  due_date: string;
  duration: string;
  status: "paid" | "pending" | "overdue";
  member_name?: string;
  admission_number?: string;
};

export function useFees() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  async function fetchFees() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fees")
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .order("due_date", { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our expected format
      const transformedData = data.map(fee => ({
        id: fee.id,
        member_id: fee.member_id,
        amount: fee.amount,
        payment_date: fee.payment_date,
        due_date: fee.due_date,
        duration: fee.duration,
        status: fee.status,
        member_name: fee.gym_members?.name,
        admission_number: fee.gym_members?.admission_number
      }));
      
      setFees(transformedData);
    } catch (error: any) {
      console.error("Error fetching fees:", error);
      toast.error("Failed to load fees data");
    } finally {
      setLoading(false);
    }
  }

  async function addFeeRecord(memberId: string, amount: number, dueDate: string, duration: string) {
    try {
      const { data, error } = await supabase
        .from("fees")
        .insert({
          member_id: memberId,
          amount,
          due_date: dueDate,
          duration,
          status: "pending"
        })
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .single();

      if (error) throw error;
      
      const newFee = {
        id: data.id,
        member_id: data.member_id,
        amount: data.amount,
        payment_date: data.payment_date,
        due_date: data.due_date,
        duration: data.duration,
        status: data.status,
        member_name: data.gym_members?.name,
        admission_number: data.gym_members?.admission_number
      };
      
      setFees(prev => [newFee, ...prev]);
      toast.success("Fee record added successfully");
      return newFee;
    } catch (error: any) {
      console.error("Error adding fee record:", error);
      toast.error(error.message || "Failed to add fee record");
      return null;
    }
  }

  async function updateFeeStatus(feeId: string, status: "paid" | "pending" | "overdue", paymentDate?: string) {
    try {
      const updateData: any = { status };
      if (status === "paid" && paymentDate) {
        updateData.payment_date = paymentDate;
      }
      
      const { error } = await supabase
        .from("fees")
        .update(updateData)
        .eq("id", feeId);

      if (error) throw error;
      
      setFees(prev => 
        prev.map(fee => 
          fee.id === feeId 
            ? { ...fee, status, payment_date: status === "paid" ? paymentDate || new Date().toISOString() : fee.payment_date } 
            : fee
        )
      );
      
      toast.success(`Fee status updated to ${status}`);
    } catch (error: any) {
      console.error("Error updating fee status:", error);
      toast.error("Failed to update fee status");
    }
  }

  async function getFeesByMemberId(memberId: string) {
    try {
      const { data, error } = await supabase
        .from("fees")
        .select("*")
        .eq("member_id", memberId)
        .order("due_date", { ascending: false });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Error fetching member fees:", error);
      toast.error("Failed to load fee records");
      return [];
    }
  }

  async function getOverdueFees() {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("fees")
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .eq("status", "pending")
        .lt("due_date", now)
        .order("due_date", { ascending: true });

      if (error) throw error;
      
      // Automatically update status to overdue
      if (data.length > 0) {
        const overdueFeeIds = data.map(fee => fee.id);
        
        const { error: updateError } = await supabase
          .from("fees")
          .update({ status: "overdue" })
          .in("id", overdueFeeIds);
          
        if (updateError) throw updateError;
        
        // Update local state
        setFees(prev => 
          prev.map(fee => 
            overdueFeeIds.includes(fee.id) 
              ? { ...fee, status: "overdue" } 
              : fee
          )
        );
      }
      
      // Transform the data to match our expected format
      return data.map(fee => ({
        id: fee.id,
        member_id: fee.member_id,
        amount: fee.amount,
        payment_date: fee.payment_date,
        due_date: fee.due_date,
        duration: fee.duration,
        status: "overdue" as const,
        member_name: fee.gym_members?.name,
        admission_number: fee.gym_members?.admission_number
      }));
    } catch (error: any) {
      console.error("Error fetching overdue fees:", error);
      return [];
    }
  }

  return {
    fees,
    loading,
    addFeeRecord,
    updateFeeStatus,
    getFeesByMemberId,
    getOverdueFees,
    refreshFees: fetchFees
  };
}
