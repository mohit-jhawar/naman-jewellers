import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (username: string, password: string) => Promise<boolean>;
    requestOtp: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    verifyOtp: (username: string, otp: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<{ username: string } | null>(null);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        const savedUser = localStorage.getItem('user');
        if (authStatus === 'true' && savedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post('auth/login', { username, password });
            const userData = response.data;
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const requestOtp = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await api.post('auth/register', { username, password });
            return { success: true, message: response.data.message };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
            return { success: false, message };
        }
    };

    const verifyOtp = async (username: string, otp: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await api.post('auth/verify-otp', { username, otp });
            const userData = response.data;
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Verification failed. Please try again.';
            return { success: false, message };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, requestOtp, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
