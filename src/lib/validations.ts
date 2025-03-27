import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export const Treatmentschema = z.object({
  userType: z.enum(["Student", "Non-Student", "StaffFamilyMember"]),
  contactNumber: z.string().min(8, "Contact number must be at least 8 digits"),
  studentNumber: z.string().optional().nullable(),
  staffId: z.string().optional(),
  familyMemberId: z.string().optional(),
  patientName: z.string().min(1, "Patient name is required"),
  gender: z.string().optional().nullable(),
  illnessIds: z.array(z.string().min(1, "Illness is required")).min(1, "At least one illness is required"),
  diagnosis: z.string().min(5, "Diagnosis must be at least 5 characters"),
  severity: z.enum(["MILD", "MODERATE", "SEVERE"]),
  patientId: z.string().optional(),
  medicines: z.array(
    z.object({
      medicineId: z.string().min(1, "Medicine is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      dosage: z.string().min(1, "Dosage is required")
    })
  ).min(1, "At least one medicine is required")
});

