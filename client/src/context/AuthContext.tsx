import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farmer } from '../types';

export interface Operator {
  id: string;
  name: string;
  role: 'Operator';
  centreId: string;
  centreName: string;
  email: string;
}

interface AuthContextType {
  user: Farmer | Operator | null;
  role: 'farmer' | 'operator' | null;
  token: string | null;
  loginAsFarmer: (mobile: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  loginAsOperator: (operatorId: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickSwitch: (targetRole: 'farmer' | 'operator') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_FARMER: Farmer = {
  id: "f-001",
  farmerId: "KS-F-00127",
  name: "Vicky Kumar",
  mobile: "9876543210",
  village: "Chaukhamba, Pauri",
  district: "Pauri Garhwal",
  state: "Uttarakhand",
  landHoldingAcre: 4.5,
  preferredCrop: "Wheat",
  language: "hi",
  bankAccount: "SBI •••• 4512",
  ifsc: "SBIN0001234",
  verified: true,
  registeredDate: "2025-11-10"
};

const DEFAULT_OPERATOR: Operator = {
  id: "op-001",
  name: "Centre Manager",
  role: "Operator",
  centreId: "centre-01",
  centreName: "Pauri Procurement Centre",
  email: "operator@kisansetu.demo"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Farmer | Operator | null>(() => {
    const saved = localStorage.getItem('kisan_user');
    return saved ? JSON.parse(saved) : DEFAULT_FARMER; // Default logged in as Vicky Kumar for seamless hackathon demo
  });

  const [role, setRole] = useState<'farmer' | 'operator' | null>(() => {
    return (localStorage.getItem('kisan_role') as any) || 'farmer';
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('kisan_token') || 'demo-token';
  });

  const loginAsFarmer = async (mobile: string, otp: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setRole('farmer');
        setToken(data.token);
        localStorage.setItem('kisan_user', JSON.stringify(data.user));
        localStorage.setItem('kisan_role', 'farmer');
        localStorage.setItem('kisan_token', data.token);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      // Fallback local auth for resilience
      if (otp === "123456") {
        setUser(DEFAULT_FARMER);
        setRole('farmer');
        setToken('demo-farmer-token');
        localStorage.setItem('kisan_user', JSON.stringify(DEFAULT_FARMER));
        localStorage.setItem('kisan_role', 'farmer');
        return { success: true };
      }
      return { success: false, message: "Invalid OTP. Use demo OTP: 123456" };
    }
  };

  const loginAsOperator = async (operatorId: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/operator-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorId, password: pass })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setRole('operator');
        setToken(data.token);
        localStorage.setItem('kisan_user', JSON.stringify(data.user));
        localStorage.setItem('kisan_role', 'operator');
        localStorage.setItem('kisan_token', data.token);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch {
      if (operatorId === "operator@kisansetu.demo" && pass === "demo123") {
        setUser(DEFAULT_OPERATOR);
        setRole('operator');
        setToken('demo-operator-token');
        localStorage.setItem('kisan_user', JSON.stringify(DEFAULT_OPERATOR));
        localStorage.setItem('kisan_role', 'operator');
        return { success: true };
      }
      return { success: false, message: "Invalid Operator Credentials" };
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('kisan_user');
    localStorage.removeItem('kisan_role');
    localStorage.removeItem('kisan_token');
  };

  const quickSwitch = (targetRole: 'farmer' | 'operator') => {
    if (targetRole === 'farmer') {
      setUser(DEFAULT_FARMER);
      setRole('farmer');
      localStorage.setItem('kisan_user', JSON.stringify(DEFAULT_FARMER));
      localStorage.setItem('kisan_role', 'farmer');
    } else {
      setUser(DEFAULT_OPERATOR);
      setRole('operator');
      localStorage.setItem('kisan_user', JSON.stringify(DEFAULT_OPERATOR));
      localStorage.setItem('kisan_role', 'operator');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loginAsFarmer, loginAsOperator, logout, quickSwitch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
