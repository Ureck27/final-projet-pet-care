"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"
import { authApi } from "@/lib/api"

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
    const token = localStorage.getItem("petcare_token")
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
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
        createdAt: new Date(),
      }
      setUser(loggedUser)
      localStorage.setItem("petcare_user", JSON.stringify(loggedUser))
      localStorage.setItem("petcare_token", data.token)
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Login failed', err)
      setIsLoading(false)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
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
        createdAt: new Date(),
      }
      setUser(newUser)
      localStorage.setItem("petcare_user", JSON.stringify(newUser))
      localStorage.setItem("petcare_token", resData.token)
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Register failed', err)
      setIsLoading(false)
      return false
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
