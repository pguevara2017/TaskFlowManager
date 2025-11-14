import { FilterBar } from '../FilterBar';
import { useState } from 'react';

export default function FilterBarExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const projects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'API Development' },
  ];

  return (
    <FilterBar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedProject={selectedProject}
      onProjectChange={setSelectedProject}
      projects={projects}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
      selectedPriority={selectedPriority}
      onPriorityChange={setSelectedPriority}
    />
  );
}
