import React from "react";
import ProjectDashboard, { Project, Message } from "@/components/ui/project-management-dashboard";

const testProjects: Project[] = [
  {
    id: "p1",
    name: "Pet Training Program",
    subtitle: "Basic Obedience Training",
    date: "2025-07-10",
    progress: 60,
    status: "inProgress",
    accentColor: "#f59e0b",
    participants: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=64&q=80&auto=format&fit=crop",
    ],
    daysLeft: 2,
    bgColorClass: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    id: "p2",
    name: "Pet Health Check",
    subtitle: "Veterinary Appointment",
    date: "2025-06-15",
    progress: 50,
    status: "upcoming",
    accentColor: "#6366f1",
    participants: [
      "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=64&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=64&q=80&auto=format&fit=crop",
    ],
    daysLeft: "Due Friday",
    bgColorClass: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    id: "p3",
    name: "Grooming Schedule",
    subtitle: "Monthly Care Routine",
    date: "2025-03-02",
    progress: 100,
    status: "completed",
    accentColor: "#10b981",
    participants: [
      "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=64&q=80&auto=format&fit=crop",
    ],
    daysLeft: 0,
    bgColorClass: "bg-emerald-50 dark:bg-emerald-900/20",
  },
];

const testMessages: Message[] = [
  {
    id: "m1",
    name: "Dr. Sarah Johnson",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80&auto=format&fit=crop",
    text: "Your pet's vaccination schedule is due next week. Please book an appointment.",
    date: "Aug 20",
    starred: true,
  },
  {
    id: "m2",
    name: "Mike Thompson",
    avatarUrl:
      "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=96&q=80&auto=format&fit=crop",
    text: "Training session went great! Your dog is making excellent progress.",
    date: "Aug 21",
  },
];

export default function TestProjectsPage() {
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-900">
      <ProjectDashboard
        title="Pet Care Projects"
        user={{ name: "Pet Owner", avatarUrl: "https://i.pravatar.cc/96?img=12" }}
        projects={testProjects}
        messages={testMessages}
        persistKey="test-projects"
        virtualizeList={true}
        estimatedRowHeight={150}
      />
    </div>
  );
}
