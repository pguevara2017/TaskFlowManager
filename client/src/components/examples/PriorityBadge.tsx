import { PriorityBadge } from '../PriorityBadge';

export default function PriorityBadgeExample() {
  return (
    <div className="flex gap-2">
      <PriorityBadge priority={1} />
      <PriorityBadge priority={2} />
      <PriorityBadge priority={3} />
      <PriorityBadge priority={4} />
      <PriorityBadge priority={5} />
    </div>
  );
}
