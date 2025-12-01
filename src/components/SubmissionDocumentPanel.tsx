import { useState } from 'react';
import { RequiredDocument, ContentDocument } from '../types/ontology';
import { SldsIcon } from './slds/SldsIcon';
import { SldsBadge } from './slds/SldsBadge';
import { SldsButton } from './slds/SldsButton';
import { SldsCard, SldsCardBody } from './slds/SldsCard';
import { FileSelectorModal } from './FileSelectorModal';
import { toast } from 'sonner@2.0.3';

interface SubmissionDocumentPanelProps {
  documents: RequiredDocument[];
  contentLibrary: ContentDocument[];
  onFileSelect: (documentId: string, contentDocument: ContentDocument) => void;
  onFileDelete: (documentId: string) => void;
}

export function SubmissionDocumentPanel({
  documents,
  contentLibrary,
  onFileSelect,
  onFileDelete
}: SubmissionDocumentPanelProps) {
  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [currentDocumentName, setCurrentDocumentName] = useState<string>('');

  const completedCount = documents.filter(doc => doc.contentDocumentLink).length;
  const requiredCount = documents.filter(doc => doc.required).length;
  const allRequiredCompleted = documents.filter(doc => doc.required).every(doc => doc.contentDocumentLink);

  const handleOpenFileSelector = (documentId: string, documentName: string) => {
    setCurrentDocumentId(documentId);
    setCurrentDocumentName(documentName);
    setFileSelectorOpen(true);
  };

  const handleFileSelectFromLibrary = (contentDocument: ContentDocument) => {
    if (currentDocumentId) {
      onFileSelect(currentDocumentId, contentDocument);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = (file: ContentDocument) => {
    toast.success('파일 다운로드 시작', {
      description: file.title
    });
    
    // In production, this would fetch from Salesforce ContentVersion
    const mockContent = `Mock file content for: ${file.title}.${file.fileExtension}`;
    const blob = new Blob([mockContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.title}.${file.fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${allRequiredCompleted ? 'bg-green-600' : 'bg-blue-600'}
          `}>
            <SldsIcon 
              name={allRequiredCompleted ? 'check' : 'file'} 
              size="small" 
              className="text-white" 
            />
          </div>
          <div>
            <div className="text-sm">
              <strong>{completedCount}</strong> / {documents.length} 제출 완료
            </div>
            <div className="text-xs text-gray-600">
              필수 {requiredCount}개 중 {documents.filter(doc => doc.required && doc.file).length}개 완료
            </div>
          </div>
        </div>
        {allRequiredCompleted && (
          <SldsBadge variant="success" className="flex items-center gap-1">
            <SldsIcon name="check" size="xx-small" />
            필수 항목 완료
          </SldsBadge>
        )}
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {documents.map((doc) => {
          const isLinked = !!doc.contentDocumentLink;

          return (
            <SldsCard key={doc.id}>
              <SldsCardBody>
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm">{doc.name}</h4>
                        {doc.required && (
                          <SldsBadge variant="error" className="text-xs">
                            필수
                          </SldsBadge>
                        )}
                        {isLinked && (
                          <SldsBadge variant="success" className="flex items-center gap-1 text-xs">
                            <SldsIcon name="check" size="xx-small" />
                            완료
                          </SldsBadge>
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-xs text-gray-600">{doc.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Linked File or Select Area */}
                  {isLinked ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="bg-green-600 rounded p-2">
                          <SldsIcon name="file" size="small" className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm truncate">
                              {doc.contentDocumentLink!.contentDocument.title}
                            </div>
                            <SldsBadge variant="lightest" className="text-xs">
                              {doc.contentDocumentLink!.contentDocument.fileExtension.toUpperCase()}
                            </SldsBadge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{formatFileSize(doc.contentDocumentLink!.contentDocument.contentSize)}</span>
                            <span>•</span>
                            <span>연결: {doc.contentDocumentLink!.linkedBy}</span>
                            <span>•</span>
                            <span>{doc.contentDocumentLink!.linkedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <SldsButton
                          variant="neutral"
                          size="small"
                          icon={<SldsIcon name="download" size="xx-small" />}
                          onClick={() => handleDownload(doc.contentDocumentLink!.contentDocument)}
                        >
                          다운로드
                        </SldsButton>
                        <SldsButton
                          variant="destructive"
                          size="small"
                          icon={<SldsIcon name="delete" size="xx-small" />}
                          onClick={() => onFileDelete(doc.id)}
                        >
                          연결 해제
                        </SldsButton>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-100 rounded-full p-3 mb-3">
                          <SldsIcon 
                            name="file" 
                            size="medium" 
                            className="text-blue-600"
                          />
                        </div>
                        
                        <p className="text-sm mb-3 text-gray-700">
                          Salesforce Files 라이브러리에서 파일 선택
                        </p>
                        
                        <SldsButton
                          variant="outline-brand"
                          size="small"
                          icon={<SldsIcon name="link" size="xx-small" />}
                          iconPosition="left"
                          onClick={() => handleOpenFileSelector(doc.id, doc.name)}
                        >
                          파일 연결
                        </SldsButton>
                        
                        <p className="text-xs text-gray-500 mt-3">
                          ContentDocumentLink가 생성됩니다
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </SldsCardBody>
            </SldsCard>
          );
        })}
      </div>

      {/* File Selector Modal */}
      <FileSelectorModal
        isOpen={fileSelectorOpen}
        onClose={() => setFileSelectorOpen(false)}
        onSelect={handleFileSelectFromLibrary}
        contentLibrary={contentLibrary}
        documentName={currentDocumentName}
      />

      {/* Info Message */}
      {!allRequiredCompleted && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <SldsIcon name="warning" size="small" className="text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="mb-1">
              <strong>필수 제출 자료가 아직 완료되지 않았습니다</strong>
            </p>
            <p className="text-xs text-gray-600">
              모든 필수 자료를 업로드하면 이 노드가 자동으로 완료 처리됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
