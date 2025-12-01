import { ChecklistItem } from '../types/ontology';
import { SldsModal } from './slds/SldsModal';
import { SldsButton } from './slds/SldsButton';
import { SldsCheckbox } from './slds/SldsCheckbox';
import { SldsIcon } from './slds/SldsIcon';
import { SldsBadge } from './slds/SldsBadge';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: ChecklistItem[];
  onToggleItem: (itemId: string, checked: boolean) => void;
}

export function ChecklistModal({ isOpen, onClose, checklist, onToggleItem }: ChecklistModalProps) {
  const completedCount = checklist.filter(item => item.checked).length;
  const totalCount = checklist.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  // Categorize by importance
  const criticalCategories = ['deadline', 'signature', 'amount'];
  const criticalItems = checklist.filter(item => 
    criticalCategories.includes(item.category) && !item.checked
  );

  const footer = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <SldsBadge 
          variant={completionRate === 100 ? "success" : completionRate >= 50 ? "default" : "error"}
          className="px-3 py-1"
        >
          {completedCount} / {totalCount} 완료 ({completionRate}%)
        </SldsBadge>
        {criticalItems.length > 0 && (
          <SldsBadge variant="error" className="px-3 py-1 flex items-center gap-1">
            <SldsIcon name="warning" size="xx-small" />
            긴급 {criticalItems.length}개
          </SldsBadge>
        )}
      </div>
      <SldsButton variant="brand" onClick={onClose}>
        닫기
      </SldsButton>
    </div>
  );

  return (
    <SldsModal
      isOpen={isOpen}
      onClose={onClose}
      title="제출 전 최종 점검"
      description="입찰 제출 전 필수적으로 확인해야 할 체크리스트입니다."
      size="large"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Critical Items Alert */}
        {criticalItems.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <div className="flex items-start gap-3">
              <SldsIcon name="warning" size="small" className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-900 mb-1">
                  긴급 확인 필요
                </h4>
                <p className="text-sm text-red-700">
                  다음 항목은 제출 전 필수적으로 확인해야 합니다:
                </p>
                <ul className="mt-2 space-y-1">
                  {criticalItems.map(item => (
                    <li key={item.id} className="text-sm text-red-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Grouped Checklist */}
        {[
          { key: 'deadline', label: '마감 시각 관련', icon: 'clock', critical: true },
          { key: 'signature', label: '서명·날인·암호', icon: 'user', critical: true },
          { key: 'amount', label: '금액 검증', icon: 'info', critical: true },
          { key: 'upload', label: '업로드 검증', icon: 'upload', critical: false },
          { key: 'filename', label: '파일명 규칙', icon: 'file', critical: false },
          { key: 'evidence', label: '증빙 서류', icon: 'file', critical: false },
          { key: 'general', label: '기타', icon: 'check', critical: false }
        ].map(category => {
          const items = checklist.filter(item => item.category === category.key);
          if (items.length === 0) return null;

          const categoryComplete = items.every(i => i.checked);
          const categoryProgress = items.filter(i => i.checked).length;

          return (
            <div key={category.key} className="space-y-3">
              <div className={`
                flex items-center justify-between p-3 rounded-lg border-2
                ${category.critical && !categoryComplete 
                  ? 'bg-red-50 border-red-300' 
                  : categoryComplete 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-gray-50 border-gray-300'
                }
              `}>
                <div className="flex items-center gap-2">
                  <SldsIcon 
                    name={category.icon as any} 
                    size="small" 
                    className={
                      category.critical && !categoryComplete 
                        ? 'text-red-600' 
                        : categoryComplete 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                    }
                  />
                  <h4 className={`
                    text-sm
                    ${category.critical && !categoryComplete 
                      ? 'text-red-900 font-medium' 
                      : categoryComplete 
                        ? 'text-green-900' 
                        : 'text-gray-900'
                    }
                  `}>
                    {category.label}
                  </h4>
                  {category.critical && !categoryComplete && (
                    <SldsBadge variant="error" className="text-xs">긴급</SldsBadge>
                  )}
                </div>
                <SldsBadge 
                  variant={categoryComplete ? "success" : "lightest"} 
                  className="text-xs"
                >
                  {categoryProgress}/{items.length}
                </SldsBadge>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-gray-300">
                {items.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <SldsCheckbox
                      id={item.id}
                      label={item.label}
                      description={item.description}
                      checked={item.checked}
                      onChange={(checked) => onToggleItem(item.id, checked)}
                    />
                    {item.checked && item.checkedBy && (
                      <div className="text-xs text-green-600 ml-7 flex items-center gap-1">
                        <SldsIcon name="check" size="xx-small" className="text-green-600" />
                        <span>{item.checkedBy}</span>
                        {item.checkedAt && <span>• {item.checkedAt}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SldsModal>
  );
}
