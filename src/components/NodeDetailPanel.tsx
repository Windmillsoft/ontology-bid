import { NodeDetail, ChecklistItem } from '../types/ontology';
import { StatusBadge } from './StatusBadge';
import { SldsButton } from './slds/SldsButton';
import { SldsCard, SldsCardHeader, SldsCardBody } from './slds/SldsCard';
import { SldsTabs } from './slds/SldsTabs';
import { SldsBadge } from './slds/SldsBadge';
import { SldsIcon } from './slds/SldsIcon';
import { SldsCheckbox } from './slds/SldsCheckbox';
import { SubmissionDocumentPanel } from './SubmissionDocumentPanel';

import { contentLibrary } from '../data/contentLibrary';

interface NodeDetailPanelProps {
  nodeDetail: NodeDetail | null;
  onOpenStatusModal: () => void;
  onOpenLicenseModal: () => void;
  onOpenEvidenceModal: () => void;
  onOpenReferenceModal?: () => void;
  onChecklistItemToggle?: (itemId: string, checked: boolean) => void;
  onDocumentSelect?: (documentId: string, contentDocument: import('../types/ontology').ContentDocument) => void;
  onDocumentDelete?: (documentId: string) => void;
}

export function NodeDetailPanel({
  nodeDetail,
  onOpenStatusModal,
  onOpenLicenseModal,
  onOpenEvidenceModal,
  onOpenReferenceModal,
  onChecklistItemToggle,
  onDocumentSelect,
  onDocumentDelete
}: NodeDetailPanelProps) {
  if (!nodeDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-gray-50">
        <SldsIcon name="file" size="large" className="text-gray-400 mb-4" />
        <h3 className="mb-2 text-gray-900">노드를 선택하세요</h3>
        <p className="text-sm text-gray-600 max-w-md">
          좌측 트리에서 노드를 선택하면 상세 정보와 관련 자료를 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  const submissionTab = nodeDetail.requiredDocuments ? (
    <SubmissionDocumentPanel
      documents={nodeDetail.requiredDocuments}
      contentLibrary={contentLibrary}
      onFileSelect={(documentId, contentDocument) => {
        if (onDocumentSelect) {
          onDocumentSelect(documentId, contentDocument);
        }
      }}
      onFileDelete={(documentId) => {
        if (onDocumentDelete) {
          onDocumentDelete(documentId);
        }
      }}
    />
  ) : (
    <div className="text-center py-12">
      <SldsIcon name="file" size="large" className="text-gray-400 mx-auto mb-3" />
      <p className="text-sm text-gray-600">
        등록된 제출 자료가 없습니다
      </p>
    </div>
  );

  const historyTab = (
    <div className="space-y-3">
      {nodeDetail.history.length > 0 ? (
        <div className="space-y-3">
          {nodeDetail.history.map((entry, index) => (
            <div key={entry.id}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    entry.action === '상태 변경' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <SldsIcon 
                      name={entry.action === '상태 변경' ? 'check' : 'clock'} 
                      size="xx-small"
                      className={entry.action === '상태 변경' ? 'text-blue-600' : 'text-gray-600'}
                    />
                  </div>
                  {index < nodeDetail.history.length - 1 && (
                    <div className="w-px h-full bg-gray-300 mt-2" />
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{entry.action}</span>
                    {entry.from && entry.to && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <StatusBadge status={entry.from as any} />
                        <span>→</span>
                        <StatusBadge status={entry.to as any} />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {entry.who} • {entry.at}
                  </div>
                  {entry.detail && (
                    <div className="text-xs bg-gray-100 px-3 py-2 rounded">
                      {entry.detail}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <SldsIcon name="clock" size="large" className="text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            변경 이력이 없습니다
          </p>
        </div>
      )}
    </div>
  );

  const checklistTab = (
    <div className="space-y-4">
      {nodeDetail.checklist && nodeDetail.checklist.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-700">
              완료: {nodeDetail.checklist.filter(item => item.checked).length} / {nodeDetail.checklist.length}
            </div>
            <SldsBadge variant={
              nodeDetail.checklist.every(item => item.checked) ? "success" :
              nodeDetail.checklist.some(item => item.checked) ? "default" : "lightest"
            }>
              {nodeDetail.checklist.every(item => item.checked) ? "완료" :
               nodeDetail.checklist.some(item => item.checked) ? "진행 중" : "미시작"}
            </SldsBadge>
          </div>

          {/* Group by category */}
          {[
            { key: 'deadline', label: '마감 시각 관련', icon: 'clock' },
            { key: 'upload', label: '업로드 검증', icon: 'upload' },
            { key: 'signature', label: '서명·날인·암호', icon: 'user' },
            { key: 'filename', label: '파일명 규칙', icon: 'file' },
            { key: 'amount', label: '금액 검증', icon: 'info' },
            { key: 'evidence', label: '증빙 서류', icon: 'file' },
            { key: 'general', label: '기타', icon: 'check' }
          ].map(category => {
            const items = nodeDetail.checklist!.filter(item => item.category === category.key);
            if (items.length === 0) return null;

            return (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <SldsIcon name={category.icon as any} size="xx-small" className="text-gray-600" />
                  <h4 className="text-sm text-gray-900">{category.label}</h4>
                  <SldsBadge variant="lightest" className="text-xs">
                    {items.filter(i => i.checked).length}/{items.length}
                  </SldsBadge>
                </div>
                <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <SldsCheckbox
                        id={item.id}
                        label={item.label}
                        description={item.description}
                        checked={item.checked}
                        onChange={(checked) => {
                          if (onChecklistItemToggle) {
                            onChecklistItemToggle(item.id, checked);
                          }
                        }}
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
        </>
      ) : (
        <div className="text-center py-12">
          <SldsIcon name="check" size="large" className="text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            체크리스트 항목이 없습니다
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg">{nodeDetail.label}</h2>
                <StatusBadge status={nodeDetail.status} />
              </div>
              <p className="text-sm text-gray-600">노드 ID: {nodeDetail.id}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <SldsButton onClick={onOpenStatusModal} variant="neutral" size="small">
              상태 변경
            </SldsButton>
            <SldsButton onClick={onOpenLicenseModal} variant="neutral" size="small">
              면허 매핑
            </SldsButton>
            {onOpenReferenceModal && (
              <SldsButton onClick={onOpenReferenceModal} variant="neutral" size="small">
                근거 편집
              </SldsButton>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <SldsCard title="요약 정보">
          <SldsCardBody>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">필수 여부</div>
                <SldsBadge variant={nodeDetail.required ? "default" : "lightest"}>
                  {nodeDetail.required ? '필수' : '선택'}
                </SldsBadge>
              </div>
              
              {nodeDetail.licenseType && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">필요 면허 타입</div>
                  <div className="text-sm">{nodeDetail.licenseType}</div>
                </div>
              )}
              
              {nodeDetail.weight && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">가중치</div>
                  <div className="text-sm">{nodeDetail.weight}%</div>
                </div>
              )}
              
              {nodeDetail.relatedNodes !== undefined && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">관계 수</div>
                  <div className="text-sm">{nodeDetail.relatedNodes}개</div>
                </div>
              )}
              
              {nodeDetail.owner && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">담당자</div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <SldsIcon name="user" size="xx-small" />
                    {nodeDetail.owner}
                  </div>
                </div>
              )}
              
              {nodeDetail.reviewer && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">검토자</div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <SldsIcon name="user" size="xx-small" />
                    {nodeDetail.reviewer}
                  </div>
                </div>
              )}
            </div>
          </SldsCardBody>
        </SldsCard>

        {/* Reference from Bid Notice */}
        {nodeDetail.reference ? (
          <SldsCard>
            <SldsCardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SldsIcon name="file" size="small" className="text-blue-600" />
                  <h3 className="text-sm">공고문 근거</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  {nodeDetail.reference.page && (
                    <div className="flex items-center gap-1">
                      <SldsIcon name="file" size="xx-small" />
                      <span>p.{nodeDetail.reference.page}</span>
                    </div>
                  )}
                  {nodeDetail.reference.article && (
                    <SldsBadge variant="lightest" className="text-xs">
                      {nodeDetail.reference.article}
                    </SldsBadge>
                  )}
                </div>
              </div>
            </SldsCardHeader>
            <SldsCardBody>
              <div 
                className="prose prose-sm max-w-none
                  [&_p]:my-2 [&_p]:leading-relaxed
                  [&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc
                  [&_ol]:my-2 [&_ol]:ml-4 [&_ol]:list-decimal
                  [&_li]:my-1
                  [&_strong]:text-gray-900
                  [&_em]:text-blue-600 [&_em]:not-italic
                  [&_u]:decoration-blue-600
                  [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
                  [&_th]:bg-gray-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:border [&_th]:border-gray-300
                  [&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-gray-300
                  bg-blue-50 border border-blue-200 rounded-lg px-4 py-3"
                dangerouslySetInnerHTML={{ __html: nodeDetail.reference.content }}
              />
              {nodeDetail.reference.extractedAt && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-200 text-xs text-gray-600">
                  <SldsIcon name="clock" size="xx-small" />
                  <span>추출: {nodeDetail.reference.extractedBy || 'AI'} • {nodeDetail.reference.extractedAt}</span>
                </div>
              )}
            </SldsCardBody>
          </SldsCard>
        ) : onOpenReferenceModal && (
          <SldsCard>
            <SldsCardBody>
              <div className="text-center py-8">
                <SldsIcon name="file" size="large" className="text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">
                  등록된 공고문 근거가 없습니다
                </p>
                <SldsButton onClick={onOpenReferenceModal} variant="outline-brand" size="small">
                  근거 추가
                </SldsButton>
              </div>
            </SldsCardBody>
          </SldsCard>
        )}

        {/* Tabs */}
        <SldsTabs
          tabs={[
            ...(nodeDetail.requiredDocuments && nodeDetail.requiredDocuments.length > 0 ? [{
              id: 'submission',
              label: '제출 자료',
              count: nodeDetail.requiredDocuments.filter(doc => doc.contentDocumentLink).length,
              content: submissionTab
            }] : []),
            ...(nodeDetail.checklist && nodeDetail.checklist.length > 0 ? [{
              id: 'checklist',
              label: '제출 전 점검',
              count: nodeDetail.checklist.filter(item => item.checked).length,
              content: checklistTab
            }] : []),
            {
              id: 'history',
              label: '변경 이력',
              count: nodeDetail.history.length,
              content: historyTab
            }
          ]}
          defaultTab={
            nodeDetail.requiredDocuments && nodeDetail.requiredDocuments.length > 0 
              ? "submission" 
              : nodeDetail.checklist && nodeDetail.checklist.length > 0 
                ? "checklist" 
                : "history"
          }
        />
      </div>
    </div>
  );
}
