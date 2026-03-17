"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import type { Pet, Routine } from "@/lib/types"

interface RoutineCardProps {
  routine: Routine & { pet: Pet }
  onCompleteTask: (routineId: string) => void
  isLoading?: boolean
}

export function RoutineCard({ routine, onCompleteTask, isLoading = false }: RoutineCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={routine.pet.photo || "/placeholder.svg"} alt={routine.pet.name} />
              <AvatarFallback>{routine.pet.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{routine.pet.name}</h4>
              <p className="text-sm text-muted-foreground">{routine.pet.type}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(routine.status)}`}>
            {getStatusIcon(routine.status)}
            <span className="capitalize">{routine.status}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div>
            <h5 className="font-medium text-sm">{routine.taskName}</h5>
            <p className="text-xs text-muted-foreground">{routine.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(routine.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {routine.status === "pending" && (
          <Button
            size="sm"
            className="w-full"
            onClick={() => onCompleteTask(routine.id)}
            disabled={isLoading}
          >
            <Camera className="mr-2 h-4 w-4" />
            {isLoading ? "Processing..." : "Complete Task"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface RoutineListProps {
  routines: (Routine & { pet: Pet })[]
  onCompleteTask: (routineId: string) => void
  isLoading?: boolean
}

export function RoutineList({ routines, onCompleteTask, isLoading = false }: RoutineListProps) {
  const todayRoutines = routines.filter(routine => {
    const today = new Date()
    const routineDate = new Date(routine.scheduledTime)
    return routineDate.toDateString() === today.toDateString()
  })

  const pendingRoutines = todayRoutines.filter(r => r.status === "pending")
  const completedRoutines = todayRoutines.filter(r => r.status === "completed")

  return (
    <div className="space-y-6">
      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Pending Tasks ({pendingRoutines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRoutines.length > 0 ? (
            <div className="grid gap-3">
              {pendingRoutines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onCompleteTask={onCompleteTask}
                  isLoading={isLoading}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No pending tasks for today</p>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Completed Tasks ({completedRoutines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedRoutines.length > 0 ? (
            <div className="grid gap-3">
              {completedRoutines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onCompleteTask={onCompleteTask}
                  isLoading={isLoading}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No completed tasks for today</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
