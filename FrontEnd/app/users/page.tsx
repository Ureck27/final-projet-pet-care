'use client'

import React, { useEffect, useState } from 'react'
import { type User } from '@/lib/api'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const { adminApi } = await import('@/lib/api')
        const usersData = await adminApi.getUsers()
        setUsers(usersData || [])
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsersData()
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
