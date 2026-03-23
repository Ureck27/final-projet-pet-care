'use client'

import React, { useEffect, useState } from 'react'

interface User {
  _id: string
  email: string
  role: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          throw new Error('No authentication token found')
        }

        // First check if user is admin
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!userResponse.ok) {
          throw new Error('Failed to authenticate user')
        }

        const userData = await userResponse.json()
        
        if (userData.data?.role !== 'admin') {
          throw new Error('Access denied. Admin role required.')
        }

        // If admin, fetch users
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please login again.')
          }
          if (response.status === 403) {
            throw new Error('Access denied. Admin role required.')
          }
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()
        setUsers(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{user.email}</h3>
            <p className="text-gray-600">Role: {user.role}</p>
            <p className="text-sm text-gray-500">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
