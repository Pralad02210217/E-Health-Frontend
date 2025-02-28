"use client";

import useAuth from "@/hooks/use-auth";
import { createContext, useContext, useEffect } from "react";


type UserType = {
    sessionid: string;
    student_id?: string;
    userId: string;
    name: string;
    gender: string;
    email: string;
    department_id?: string;
    std_year?: string;
    userType: string;
    blood_type?: string;
    contact_number: string;
    sessionId?: string; 
    createdAt: string;
    expiredAt: string;
};



type AuthContextType = {
    user?: UserType | null;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, error, isLoading, isFetching, refetch } = useAuth();

    return (
        <AuthContext.Provider value={{ user, error, isLoading, isFetching, refetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
};
