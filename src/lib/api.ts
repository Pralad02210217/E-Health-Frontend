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
    contact_number?: string;
    password?: string;
    confirmPassword?: string; 
    gender: "MALE" | "FEMALE" | "OTHERS";
    blood_type?: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-"; 
    department_id?: string; 
    std_year?: string; 
    user_type: "STUDENT" | "STAFF" | "DEAN" | "NON-STAFF" | "HA";
    data_of_birth?:string;
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
type changeSecret = {
    currentSecret: string,
    newSecret: string
}
type HALeave = {
    start_date: string,
    end_date: string,
    reason: string
}
type createFeed = {
    title: string,
    description: string,
    image_urls?: string[],
    video_url?: string[]
}
// Common Auth Functionality

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

// Common Session Functionality

export const getUserSessionQueryFn = async() => await API.get('/session/')

export const sessionsQueryFn = async() => {
    const response = await  API.get<SessionResponseType>('/session/all')
    return response.data
}

export const sessionDelMutationFn = async (id: string) =>
    await API.delete(`/session/${id}`);
export const sessionDelAllMutationFn = async () =>
    await API.delete("/session/delete/all");

// Common User Functionality
export const getUserEmailFn = async(data: forgotPasswordType) => await API.post('/user/email',data)
export const updateUserProfileFn = async(data: updateProfile) => await API.put("/user/update", data)
export const updateUerProfilePicFn = async(data: profileUrl) => await API.put('/user/update-profile', data)
export const changePasswordFn = async(data: forgotPassword) => await API.put('/user/change-password', data)
// Common HA Functionality
export const forgotPasswordForHAFn = async(data: forgotPasswordHA) => await API.post('/ha/forgot-password',data)
export const toggleAvailabilityFn = async() => await API.put('/ha/toggle-availability', {})
export const setLeaveFn = async(data: HALeave) => await API.post('/ha/set-leave', data)
export const fetchLeavesFn = async() => await API.get('/ha/get-leave')
export const cancelLeaveFn = async() => await API.put('/ha/cancel-leave')
export const changeSecretFn = async(data: changeSecret) => await API.put('/ha/update', data)
export const getUsersFn = async() => await API.get(`/user/users`)

//HA Feeds Functionality
export const createFeedFn = async(data: createFeed) => await API.post('/feed/create', data)
export const fetchFeedsFn = async() => await API.get('/feed/')
export const deleteFeedFn = async(id: string) => await API.delete(`/feed/delete/${id}`)
export const updateFeedFn = async(id : string, data: createFeed) => await API.put(`/feed/update/${id}`, data)

//HA Category Functionality
export const addCategoryFn = async(data: {name: string}) => await API.post('/inventory/categories/add', data)
export const fetchCategoriesFn = async() => await API.get('/inventory/categories')
export const categoryCountFn = async() => await API.get('/inventory/categories/counts')
export const expiredMedicineFn = async() => await API.get('/inventory/medicines-expired')
export const updateCategoryFn = async(id: string, data: {name: string}) => await API.put(`/inventory/categories/${id}`, data)
export const deleteCategoryFn = async(id: string) => await API.delete(`/inventory/categories/${id}`)

//HA Medicine Functionality
export const fetchMedicinesFn = async() => await API.get('/inventory/medicines/')
export const addMedicinesFn = async(data: {name: string, category_id: string, unit: string,}) => await API.post('/inventory/medicines', data)
export const updateMedicinesFn = async(id: string, data: {name: string, category_id: string, quantity: number, unit: string, expiry_date: string}) => await API.put(`/inventory/medicines/${id}`, data)
export const deleteMedicineFn = async(id: string) => await API.delete(`/inventory/medicines/${id}`)

//HA Stock Functionality
export const fetchTransactionFn = async() => await API.get('/inventory/transactions/')
export const useTransactionFn = async(data:{medicine_id:string, quantity:number, reason:string, patient_id?:string,family_member_id?:string}) => await API.post(`/inventory/transactions/use`, data)
export const addTransactionFn = async(data: {medicine_id: string, quantity: number, reason:string, batch_name:string, expiry_date:string}) => await API.post('/inventory/transactions/add', data)
export const removeTransactionFn = async(data: {batch_id: string, quantity: number, reason:string}) => await API.post('/inventory/transactions/remove', data)

//HA bacth Functionality
export const updateBatchFn = async(id:string, data:{ quantity:number, expiry_date: string}) => await API.put(`/inventory/medicine/batch/update/${id}`,data)
export const deleteBatchFn = async(id:string) => await API.delete(`/inventory/medicine/batch/delete/${id}`)
export const deleteBatchByIdFn = async(id:string) => await API.delete(`/inventory/medicine/batch/expired/delete/${id}`)

//HA Illness Functionality
export const createIllnessFn = async(data:{name: string, type: string, description: string}) => await API.post('/illness/create', data)
export const fetchIllnessFn = async()=> await API.get('/illness/')
export const updateIllnessFn = async(id:string,data:{name:string, type:string, description:string}) => await API.put(`/illness/update/${id}`,data)
export const deleteIllnessFn = async(id:string) => await API.delete(`/illness/delete/${id}`)

//HA Treatment Functionality
export const createTreatmentFn = async(data:{ patient_id?:string,family_member_id?:string, doctor_id: string, illness_ids:Array<string>, severity:string, notes:string, medicines:  { medicine_id: string; dosage: string; }[];}) => await API.post(`/treatment/create/`, data)
export const updateTreatmentFn =  async(id: string,data:{ patient_id:string, doctor_id: string, illness_id:string, severity:string, notes:string}) => await API.put(`/treatment/update/$${id}`, data)
export const fetchTreatmentFn = async(id:string) => await API.get(`/treatment/patient/${id}`)
export const deleteTreatmentFn = async(id:string) => await API.delete(`/treatment/delete/${id}`)
export const fetchAllTreatmentFn = async()=> await API.get(`/treatment/patientAll`)

//HA Treatment for StaffFamily Functionality
export const createStaffFamilyFn = async(data:{name:string, staff_id:string, gender:string, contact_number:string,blood_type?: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-"; relation:string, date_of_birth:Date}) => await API.post(`staffFamily/create/`,data)

//HA dashboard
export const fetchDashboardFn = async() => await API.get(`/dashboard`)