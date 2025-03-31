
import { v4 as uuidv4 } from "uuid";
import { Member } from "./types";
import { generateAdmissionNumber } from "./utils";

export const createMember = (members: Member[], member: Member): { newMember: Member, admissionNumber: string } => {
  const admissionNumber = generateAdmissionNumber(members);
  const newMember = { 
    ...member, 
    id: uuidv4(), 
    admissionNumber,
    registrationDate: new Date().toISOString()
  };
  
  return { newMember, admissionNumber };
};

export const findMemberById = (members: Member[], id: string): Member | undefined => {
  return members.find(member => member.id === id);
};

export const findMemberByAdmissionNumber = (members: Member[], admissionNumber: string): Member | undefined => {
  return members.find(member => member.admissionNumber === admissionNumber);
};
