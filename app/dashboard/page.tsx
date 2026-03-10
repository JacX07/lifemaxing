"use client";

import { useState } from "react";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import DashboardSection from "@/components/dashboard/DashboardSection";
import TaskCard from "@/components/tasks/TaskCard";
import NewTaskModal from "@/components/tasks/NewTaskModal";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const tasks = useStore((s) => s.tasks);
  const completeTask = useStore((s) => s.completeTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const isCompletedToday = useStore((s) => s.isCompletedToday);

  const [modalOpen, setModalOpen] = useState(false);

  const dailyTasks = tasks.filter((t) => t.type === "recurrente");
  const upcomingTasks = tasks.filter(
    (t) => t.type === "ponctuelle" && !isCompletedToday(t)
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <ProfileHeader />

      <DashboardSection title="Daily Quests" count={dailyTasks.length} onAdd={() => setModalOpen(true)}>
        {dailyTasks.length > 0 ? (
          dailyTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              completedToday={isCompletedToday(task)}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))
        ) : undefined}
      </DashboardSection>

      <DashboardSection title="Upcoming" count={upcomingTasks.length} onAdd={() => setModalOpen(true)}>
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              completedToday={isCompletedToday(task)}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))
        ) : undefined}
      </DashboardSection>

      {modalOpen && <NewTaskModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
