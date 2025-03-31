
import { v4 as uuidv4 } from "uuid";
import { Fee } from "./types";

export const createFee = (feeData: Omit<Fee, "id" | "createdAt">): Fee => {
  return {
    ...feeData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
};

export const updateFee = (fee: Fee, status: Fee["status"]): Fee => {
  return { ...fee, status };
};

export const getDueFees = (fees: Fee[]): Fee[] => {
  const today = new Date();
  return fees.filter(fee => {
    if (fee.status === "Paid") return false;
    const endDate = new Date(fee.endDate);
    return endDate < today;
  });
};

export const getFeesByMemberId = (fees: Fee[], memberId: string): Fee[] => {
  return fees.filter(fee => fee.memberId === memberId);
};
