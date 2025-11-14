import { StatusBadge } from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2">
      <StatusBadge status="PENDING" />
      <StatusBadge status="IN_PROGRESS" />
      <StatusBadge status="COMPLETED" />
    </div>
  );
}
