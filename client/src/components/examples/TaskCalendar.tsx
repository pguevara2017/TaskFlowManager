import { TaskCalendar } from '../TaskCalendar';

export default function TaskCalendarExample() {
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
      dueDate: new Date(2024, 11, 15),
      assignee: 'Mike Chen',
      status: 'COMPLETED' as const,
    },
    {
      id: '3',
      name: 'Write documentation',
      priority: 4,
      dueDate: new Date(2024, 11, 20),
      assignee: 'Emma Wilson',
      status: 'PENDING' as const,
    },
  ];

  return (
    <TaskCalendar
      tasks={tasks}
      onTaskClick={(task) => console.log('Clicked task:', task)}
    />
  );
}
