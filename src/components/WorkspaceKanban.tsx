import React, { useState } from 'react';
import {
  Kanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  User,
  Plus,
  ArrowRight,
  ArrowLeft,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectEpic, ProjectTask } from '../types';

interface WorkspaceKanbanProps {
  epics: ProjectEpic[];
  tasks: ProjectTask[];
  onUpdateTasks: (tasks: ProjectTask[]) => void;
  mentor: string;
  onOpenLinksModal: () => void;
}

export const WorkspaceKanban: React.FC<WorkspaceKanbanProps> = ({
  epics,
  tasks,
  onUpdateTasks,
  mentor,
  onOpenLinksModal
}) => {
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [epicFilter, setEpicFilter] = useState<string>('all');

  const columns: { id: ProjectTask['status']; title: string; color: string; count: number }[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-300 bg-slate-100/60', count: 0 },
    { id: 'in_progress', title: 'In Progress', color: 'border-amber-300 bg-amber-50/50', count: 0 },
    { id: 'review', title: 'Under Review', color: 'border-blue-300 bg-blue-50/50', count: 0 },
    { id: 'done', title: 'Completed', color: 'border-emerald-300 bg-emerald-50/50', count: 0 }
  ];

  const filteredTasks = tasks.filter((t) => {
    if (assigneeFilter !== 'all' && t.assignee !== assigneeFilter) return false;
    if (epicFilter !== 'all' && t.epicId !== epicFilter) return false;
    return true;
  });

  columns.forEach((c) => {
    c.count = filteredTasks.filter((t) => t.status === c.id).length;
  });

  const moveTask = (taskId: string, direction: 'prev' | 'next') => {
    const statusOrder: ProjectTask['status'][] = ['todo', 'in_progress', 'review', 'done'];
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const currentIdx = statusOrder.indexOf(t.status);
        const nextIdx = direction === 'next' ? Math.min(statusOrder.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
        return { ...t, status: statusOrder[nextIdx] };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Workspace Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-white">
                Project Workspace
              </span>
              <span className="text-xs text-slate-500">Finance Group Evaluation</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Project Epics & Agile Kanban Board
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Track the development of the 8 project epics and 16 user stories across team leads Janani R and Kethsiya J.
            </p>
          </div>

          {/* Stats badge */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Overall Progress</p>
              <p className="text-xl font-bold text-slate-900">{progressPct}% Complete</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 flex items-center justify-center font-bold text-xs text-slate-800">
              {completedCount}/{tasks.length}
            </div>
          </div>
        </div>

        {/* 8 Epics Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Epics Overview (Total Epics: 8)
            </h3>
            <span className="text-xs text-slate-500">16 Total Stories & Tasks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {epics.map((epic) => (
              <div
                key={epic.id}
                onClick={() => setEpicFilter(epicFilter === epic.id ? 'all' : epic.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  epicFilter === epic.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`font-mono font-bold ${epicFilter === epic.id ? 'text-amber-400' : 'text-slate-500'}`}>
                    {epic.id}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                      epicFilter === epic.id ? 'bg-slate-800 text-emerald-300' : 'bg-white text-emerald-700'
                    }`}
                  >
                    2 Tasks
                  </span>
                </div>
                <p className="text-xs font-semibold line-clamp-2 leading-snug">
                  {epic.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Filter by Assignee:</span>
            <div className="flex items-center gap-1">
              {['all', 'Janani R', 'Kethsiya J'].map((assignee) => (
                <button
                  key={assignee}
                  type="button"
                  onClick={() => setAssigneeFilter(assignee)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    assigneeFilter === assignee
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {assignee === 'all' ? 'All Team' : assignee}
                </button>
              ))}
            </div>
          </div>

          {epicFilter !== 'all' && (
            <button
              onClick={() => setEpicFilter('all')}
              className="text-xs text-amber-700 font-medium hover:underline"
            >
              Clear Epic filter ({epicFilter})
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-xl border ${col.color} p-4 flex flex-col justify-between min-h-[500px]`}
            >
              <div className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {col.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 font-mono text-xs font-bold shadow-2xs">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No tasks in this column
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-slate-400 font-medium">{task.id}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${
                              task.priority === 'High'
                                ? 'bg-red-50 text-red-700'
                                : task.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {task.title}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                task.assignee === 'Janani R' ? 'bg-slate-900' : 'bg-amber-500'
                              }`}
                            >
                              {task.assignee === 'Janani R' ? 'J' : 'K'}
                            </span>
                            <span className="truncate max-w-[90px]">{task.assignee}</span>
                          </div>

                          {/* Quick move buttons */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'todo' && (
                              <button
                                type="button"
                                onClick={() => moveTask(task.id, 'prev')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                                title="Move Left"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                type="button"
                                onClick={() => moveTask(task.id, 'next')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                                title="Move Right"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
