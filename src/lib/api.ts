import API from "./axios-client"

type forgotPasswordType = { email: string}
type resetPasswordType = { password: string, verificationCode: string}
type mfaLoginType = { code: string; email: string };
type LoginType = {
    email: string
    password: string
}



type RegisterType = {
    name: string;
    student_id?: string;
    email?: string; 
    contact_number: string;
    password?: string;
    confirmPassword?: string; 
    gender: "MALE" | "FEMALE" | "OTHERS";
    blood_type?: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-"; 
    department_id?: string; 
    std_year?: string; 
    user_type: "STUDENT" | "STAFF" | "DEAN" | "NON-STAFF" | "HA";
    role?: "STUDENT" | "STAFF" | "DEAN" | "HA";
    secret_word?: string
}
type SessionType = {
    id: string;
    userId: string;
    userAgent: string;
    created_at: string;
    expires_at: string;
    isCurrent: boolean;
  };

type SessionResponseType = {
    message: string,
    sessions: SessionType[];
}


export type mfaType = {
    message: string;
    secret: string;
    qrImageUrl: string;
}
type verifyEmailType = { code: string }
type verifyMFAType = { code: string, secretKey: string }
type forgotPasswordHA = {
    email: string,
    secret_word: string
}
type updateProfile = {
    name: string,
    gender: "MALE" | "FEMALE" | "OTHERS",
    contact_number: string,
    blood_type?: "O+"| "O-"| "A+"| "A-"| "B+"| "B-"| "AB+"| "AB-",
    department_id?: string
}
type profileUrl = {
    profile_url: string
}
type forgotPassword = {
    currentPassword: string,
    newPassword: string
}

export const loginMutationFn = async(data:LoginType) => 
    await API.post("/auth/login", data)

export const logoutMutationFn = async() => await API.post(`/auth/logout`)

export const verifyMFALoginMutationFn = async (data: mfaLoginType) =>
    await API.post(`/mfa/verify-login`, data);

export const registerMutationFn = async(data:RegisterType) => 
    await API.post("/auth/register", data)

export const resendVerificationMutationFn = async(data: forgotPasswordType) =>
    await API.post('/auth/verify/resend-email', data)

export const verifyEmailMutationFn = async(data: verifyEmailType) =>
    await API.post(`/auth/verify/email`, data) 

export const forgotPasswordMutationFn = async(data:forgotPasswordType) => 
    await API.post("/auth/password/forgot", data)

export const resetPasswordMutationFn = async(data:resetPasswordType) => 
    await API.post("/auth//password/reset", data)

export const invokeMFAFn = async() =>{
    const response = await API.post('/mfa/invoke')
    return response.data
}
export const revokeMFAMutationFn = async() => await API.put('/mfa/revoke', {})
export const verifyMFAMutationFn = async(data: verifyMFAType) =>
    await API.post(`/mfa/verify`, data)

export const getUserSessionQueryFn = async() => await API.get('/session/')

export const sessionsQueryFn = async() => {
    const response = await  API.get<SessionResponseType>('/session/all')
    return response.data
}

export const sessionDelMutationFn = async (id: string) =>
    await API.delete(`/session/${id}`);
export const sessionDelAllMutationFn = async () =>
    await API.delete("/session/delete/all");

export const getUserEmailFn = async(data: forgotPasswordType) => await API.post('/user/email',data)
export const updateUserProfileFn = async(data: updateProfile) => await API.put("/user/update", data)
export const updateUerProfilePicFn = async(data: profileUrl) => await API.put('/user/update-profile', data)
export const changePasswordFn = async(data: forgotPassword) => await API.put('/user/change-password', data)
export const forgotPasswordForHAFn = async(data: forgotPasswordHA) => await API.post('/ha/forgot-password',data)