"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"
import { api } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
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
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const data = await api.post<{ _id: string, email: string, name: string, role: UserRole, token: string }>('/auth/login', { email, password });
      
      const loggedUser: User = {
        id: data._id,
        email: data.email,
        fullName: data.name,
        phone: '',
        role: data.role,
        createdAt: new Date(),
      }
      setUser(loggedUser)
      localStorage.setItem("petcare_user", JSON.stringify(loggedUser))
      localStorage.setItem("petcare_token", data.token)
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Login failed', err)
    }
    setIsLoading(false)
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      const resData = await api.post<{ _id: string, email: string, name: string, role: UserRole, token: string }>('/auth/register', { 
        name: data.fullName, 
        email: data.email, 
        password: data.password 
      });
      
      const newUser: User = {
        id: resData._id,
        email: resData.email,
        fullName: resData.name,
        phone: data.phone,
        role: resData.role,
        createdAt: new Date(),
      }
      setUser(newUser)
      localStorage.setItem("petcare_user", JSON.stringify(newUser))
      localStorage.setItem("petcare_token", resData.token)
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Register failed', err)
    }
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("petcare_user")
    localStorage.removeItem("petcare_token")
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await api.post('/auth/forgot-password', { email })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, forgotPassword }}>
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
