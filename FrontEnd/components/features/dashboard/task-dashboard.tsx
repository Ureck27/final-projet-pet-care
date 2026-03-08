"use client"

import { Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react"

interface TaskDashboardProps {
  tasks: Task[]
  petName: string
}

export function TaskDashboard({ tasks, petName }: TaskDashboardProps) {
  const pendingTasks = tasks.filter((t) => t.status === "pending")
  const completedTasks = tasks.filter((t) => t.status === "completed")
  const overdueTasks = tasks.filter((t) => t.status === "overdue")

  const completionRate = completedTasks.length / tasks.length * 100

  const getTaskTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      walk: "🐕",
      meal: "🍽️",
      play: "🎾",
      training: "🎓",
      medication: "💊",
      rest: "😴",
      grooming: "🛁",
      "vet-check": "🏥",
    }
    return icons[type] || "📋"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks.length}/{tasks.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{petName}'s Daily Tasks</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-sm text-muted-foreground">
                  PENDING
                </h3>
                <div className="space-y-2">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {getTaskTypeIcon(task.type)}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.timeWindow
                              ? `${task.timeWindow.start} - ${task.timeWindow.end}`
                              : new Date(task.dueDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-sm text-muted-foreground">
                  COMPLETED ✓
                </h3>
                <div className="space-y-2">
                  {completedTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border p-3 opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {getTaskTypeIcon(task.type)}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium line-through">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed at{" "}
                            {task.completedAt?.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No tasks */}
            {tasks.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No tasks scheduled yet. Create one to get started!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
