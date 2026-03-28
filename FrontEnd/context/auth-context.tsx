"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"
import { authApi } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
}

interface RegisterData {
  email: string
  password: string
  fullName: string
  phone: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("petcare_user")
    const token = localStorage.getItem("petcare_token")
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const data = await authApi.login({ email, password });
      
      const loggedUser: User = {
        _id: data._id,
        id: data._id,
        email: data.email,
        name: data.name,
        fullName: data.name,
        phone: '',
        role: data.role as UserRole,
        status: (data.status as "pending" | "active" | "suspended" | "rejected") || "active",
        createdAt: new Date(),
        updatedAt: new Date().toISOString()
      }
      setUser(loggedUser)
      localStorage.setItem("petcare_user", JSON.stringify(loggedUser))
      localStorage.setItem("petcare_token", data.token)
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      localStorage.removeItem("petcare_token");
      localStorage.removeItem("petcare_user");
      
      const errorMessage = err.message || 'Login failed';
      console.error('[Auth Error] Login failed:', errorMessage);
      setIsLoading(false)
      return { 
        success: false, 
        message: errorMessage || 'Login failed. Please check your credentials and connection.' 
      }
    }
  }

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const data = await authApi.adminLogin({ email, password });
      
      const loggedUser: User = {
        _id: data._id,
        id: data._id,
        email: data.email,
        name: data.name,
        fullName: data.name,
        phone: '',
        role: data.role as UserRole,
        status: (data.status as "pending" | "active" | "suspended" | "rejected") || "active",
        createdAt: new Date(),
        updatedAt: new Date().toISOString()
      }
      setUser(loggedUser)
      localStorage.setItem("petcare_user", JSON.stringify(loggedUser))
      localStorage.setItem("petcare_token", data.token)
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      localStorage.removeItem("petcare_token");
      localStorage.removeItem("petcare_user");
      
      let errorMessage = 'Admin Login failed';
      
      // Handle rate limiting errors specifically
      if (err.isRateLimit) {
        errorMessage = `Rate limit exceeded. Please try again in ${err.retryAfter}.`;
      } else if (err.message && err.message.includes('BACKEND_DOWN')) {
        errorMessage = 'Server is currently unavailable. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('[Auth Error] Admin Login failed:', errorMessage);
      setIsLoading(false)
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      const resData = await authApi.register({ 
        name: data.fullName, 
        email: data.email, 
        password: data.password 
      });
      
      const newUser: User = {
        _id: resData._id,
        id: resData._id,
        email: resData.email,
        name: resData.name,
        fullName: resData.name,
        phone: data.phone,
        role: resData.role as UserRole,
        status: "pending", // All new users are pending
        createdAt: new Date(),
        updatedAt: new Date().toISOString()
      }
      setUser(newUser)
      localStorage.setItem("petcare_user", JSON.stringify(newUser))
      localStorage.setItem("petcare_token", resData.token)
      setIsLoading(false)
      return { success: true }
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      console.error('[Auth Error] Registration failed:', errorMessage);
      setIsLoading(false)
      return { 
        success: false, 
        message: errorMessage || 'Registration failed. Please check your connection and try again.' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("petcare_user")
    localStorage.removeItem("petcare_token")
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await authApi.forgotPassword(email)
      return true
    } catch (err: any) {
      console.error('[Auth Error] Forgot password failed:', err.message)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, adminLogin, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
