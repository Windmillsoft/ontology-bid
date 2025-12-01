import { NodeStatus } from '../types/ontology';
import { SldsBadge } from './slds/SldsBadge';

interface StatusBadgeProps {
  status: NodeStatus;
}

const statusConfig: Record<NodeStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'lightest' }> = {
  NOT_STARTED: { label: '미시작', variant: 'lightest' },
  IN_PROGRESS: { label: '진행 중', variant: 'default' },
  BLOCKED: { label: '차단', variant: 'error' },
  RISK: { label: '리스크', variant: 'warning' },
  SATISFIED: { label: '완료', variant: 'success' }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <SldsBadge variant={config.variant} className="slds-badge">
      {config.label}
    </SldsBadge>
  );
}
