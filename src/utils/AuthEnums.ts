import { z } from "zod";

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHERS"]);
export const bloodTypeEnum = z.enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]);
export const userTypeEnum = z.enum(["STUDENT", "STAFF", "DEAN", "NON-STAFF", "HA"]);
export const roleEnum = z.enum(["STUDENT", "STAFF", "DEAN", "HA"]);
export const PROGRAMME_ID_ENUM = z.enum([
  "P01", "P02", "P03", "P04", "P05",
  "P06", "P07", "P08", "P09", "P10", "P11"
]);
export const emailSchema = z.string().trim().email().min(1).max(255).regex(/^[a-zA-Z0-9._%+-]+@rub\.edu\.bt$/, "Email must be from @rub.edu.bt domain")