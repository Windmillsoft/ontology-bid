import { BidStatus } from '../types/ontology';
import { SldsBadge } from './slds/SldsBadge';

interface BidStatusBadgeProps {
  status: BidStatus;
}

const statusConfig: Record<BidStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'lightest' | 'inverse' }> = {
  DRAFT: { label: '초안', variant: 'lightest' },
  IN_PREPARATION: { label: '준비 중', variant: 'default' },
  REVIEW: { label: '검토 중', variant: 'warning' },
  SUBMITTED: { label: '제출 완료', variant: 'default' },
  AWARDED: { label: '낙찰', variant: 'success' },
  LOST: { label: '미낙찰', variant: 'error' }
};

export function BidStatusBadge({ status }: BidStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <SldsBadge variant={config.variant} className="slds-badge">
      {config.label}
    </SldsBadge>
  );
}
