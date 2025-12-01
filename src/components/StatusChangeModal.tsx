import { useState } from 'react';
import { NodeStatus } from '../types/ontology';
import { SldsModal } from './slds/SldsModal';
import { SldsButton } from './slds/SldsButton';
import { SldsRadioGroup } from './slds/SldsRadioGroup';
import { SldsTextarea } from './slds/SldsTextarea';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: NodeStatus;
  onConfirm: (newStatus: NodeStatus, reason: string) => void;
}

const statusOptions = [
  { value: 'NOT_STARTED', label: '미시작', description: '작업이 시작되지 않음' },
  { value: 'IN_PROGRESS', label: '진행 중', description: '작업이 진행 중' },
  { value: 'BLOCKED', label: '차단', description: '외부 요인으로 진행 불가' },
  { value: 'RISK', label: '리스크', description: '리스크 요소 존재' },
  { value: 'SATISFIED', label: '완료', description: '요건이 충족됨' }
];

export function StatusChangeModal({ isOpen, onClose, currentStatus, onConfirm }: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<NodeStatus>(currentStatus);
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(selectedStatus, reason);
    setReason('');
    onClose();
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setReason('');
    onClose();
  };

  const footer = (
    <>
      <SldsButton variant="neutral" onClick={handleCancel}>
        취소
      </SldsButton>
      <SldsButton 
        variant="brand" 
        onClick={handleConfirm} 
        disabled={selectedStatus === currentStatus}
      >
        변경하기
      </SldsButton>
    </>
  );

  return (
    <SldsModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="상태 변경"
      size="medium"
      footer={footer}
    >
      <div className="space-y-6">
        <SldsRadioGroup
          label="새 상태 선택"
          name="status"
          options={statusOptions.map(opt => ({
            ...opt,
            label: opt.value === currentStatus 
              ? `${opt.label} (현재)` 
              : opt.label
          }))}
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value as NodeStatus)}
        />
        
        <SldsTextarea
          label="사유 / 메모"
          placeholder="상태 변경 사유를 입력하세요 (선택사항)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          helpText="변경 사유는 이력에 기록됩니다"
        />
      </div>
    </SldsModal>
  );
}
