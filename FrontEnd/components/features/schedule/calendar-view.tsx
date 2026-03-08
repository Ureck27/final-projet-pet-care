"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import type { Booking } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  bookings: Booking[]
  onDateClick?: (date: Date) => void
}

export function CalendarView({ bookings, onDateClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = []
  let day = startDate

  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => isSameDay(new Date(booking.date), date))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick?.(date)
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{format(currentMonth, "MMMM yyyy")}</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const dayBookings = getBookingsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())

            return (
              <button
                key={i}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "relative flex h-12 flex-col items-center justify-start rounded-lg p-1 text-sm transition-colors",
                  !isCurrentMonth && "text-muted-foreground opacity-50",
                  isSelected && "bg-primary text-primary-foreground",
                  isToday && !isSelected && "bg-accent",
                  "hover:bg-accent",
                )}
              >
                <span className={cn("text-xs", isToday && !isSelected && "font-bold")}>{format(day, "d")}</span>
                {dayBookings.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {dayBookings.slice(0, 2).map((_, idx) => (
                      <div
                        key={idx}
                        className={cn("h-1 w-1 rounded-full", isSelected ? "bg-primary-foreground" : "bg-primary")}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
