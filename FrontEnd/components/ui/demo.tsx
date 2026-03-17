import React, { useState } from "react";
import ProjectDashboard, { Project, Message } from "@/components/ui/project-management-dashboard";

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "Web Designing",
    subtitle: "Prototyping",
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
    name: "Testing",
    subtitle: "QA Pass",
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
    name: "Brand Refresh",
    subtitle: "Design System",
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

const demoMessages: Message[] = [
  {
    id: "m1",
    name: "Stephanie",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=80&auto=format&fit=crop",
    text: "Got your first assignment—looks great. Ready for the next.",
    date: "Aug 20",
    starred: true,
  },
  {
    id: "m2",
    name: "Mark",
    avatarUrl:
      "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=96&q=80&auto=format&fit=crop",
    text: "How's the progress? Still waiting on your response.",
    date: "Aug 21",
  },
];

export default function DemoOne() {
  const [data, setData] = useState<Project[]>(initialProjects);

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-900">
      <ProjectDashboard
        title="Project Management"
        user={{ name: "Alex", avatarUrl: "https://i.pravatar.cc/96?img=12" }}
        projects={data}
        messages={demoMessages}
        // Persist UI choices under this key
        persistKey="demo-01"
        // Handle updates and reordering (controlled)
        onProjectUpdate={(proj) => {
          setData((arr) => arr.map((p) => (p.id === proj.id ? proj : p)));
        }}
        onProjectsReorder={(ids) => {
          setData((arr) => {
            const map = new Map(arr.map((p) => [p.id, p]));
            return ids.map((id) => map.get(id)!).filter(Boolean);
          });
        }}
        // Try list virtualization for large sets
        virtualizeList={true}
        estimatedRowHeight={150}
        // Observe actions
        onProjectAction={(id, a) => console.log("action:", a, id)}
        onProjectClick={(id) => console.log("open:", id)}
        onMessageStarChange={(id, s) => console.log("star:", id, s)}
      />
    </div>
  );
}
