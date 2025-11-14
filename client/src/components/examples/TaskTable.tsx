import { TaskTable } from '../TaskTable';
import { useState } from 'react';

export default function TaskTableExample() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const tasks = [
    {
      id: '1',
      name: 'Design homepage mockups',
      priority: 2,
      dueDate: new Date(2024, 11, 15),
      assignee: 'Sarah Johnson',
      status: 'IN_PROGRESS' as const,
    },
    {
      id: '2',
      name: 'Setup database schema',
      priority: 1,
      dueDate: new Date(2024, 11, 10),
      assignee: 'Mike Chen',
      status: 'COMPLETED' as const,
    },
    {
      id: '3',
      name: 'Write documentation',
      priority: 4,
      dueDate: new Date(2024, 11, 25),
      assignee: 'Emma Wilson',
      status: 'PENDING' as const,
    },
  ];

  return (
    <TaskTable
      tasks={tasks}
      selectedTasks={selectedTasks}
      onSelectTask={(id) => {
        setSelectedTasks(prev =>
          prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
      }}
      onSelectAll={() => {
        setSelectedTasks(selectedTasks.length === tasks.length ? [] : tasks.map(t => t.id));
      }}
      onSort={(field) => console.log('Sort by:', field)}
      onTaskClick={(task) => console.log('Clicked task:', task)}
    />
  );
}
