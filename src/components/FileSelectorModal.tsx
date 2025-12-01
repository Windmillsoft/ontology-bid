import { useState, useMemo } from 'react';
import { ContentDocument } from '../types/ontology';
import { SldsModal } from './slds/SldsModal';
import { SldsButton } from './slds/SldsButton';
import { SldsInput } from './slds/SldsInput';
import { SldsSelect } from './slds/SldsSelect';
import { SldsIcon } from './slds/SldsIcon';
import { SldsBadge } from './slds/SldsBadge';

interface FileSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (contentDocument: ContentDocument) => void;
  contentLibrary: ContentDocument[];
  documentName: string;
}

export function FileSelectorModal({
  isOpen,
  onClose,
  onSelect,
  contentLibrary,
  documentName
}: FileSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<ContentDocument | null>(null);

  const filteredFiles = useMemo(() => {
    return contentLibrary.filter(file => {
      const matchesSearch = 
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesType = fileTypeFilter === 'all' || file.fileType === fileTypeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [contentLibrary, searchQuery, fileTypeFilter]);

  const fileTypes = Array.from(new Set(contentLibrary.map(f => f.fileType)));

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string): string => {
    switch (fileType) {
      case 'PDF':
        return 'file';
      case 'WORD':
        return 'file';
      case 'EXCEL':
        return 'file';
      default:
        return 'file';
    }
  };

  const getFileTypeColor = (fileType: string): string => {
    switch (fileType) {
      case 'PDF':
        return 'text-red-600';
      case 'WORD':
        return 'text-blue-600';
      case 'EXCEL':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setFileTypeFilter('all');
    setSelectedFile(null);
    onClose();
  };

  const footer = (
    <>
      <SldsButton variant="neutral" onClick={handleClose}>
        취소
      </SldsButton>
      <SldsButton 
        variant="brand" 
        onClick={handleSelect}
        disabled={!selectedFile}
      >
        선택
      </SldsButton>
    </>
  );

  return (
    <SldsModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Salesforce Files 라이브러리"
      description={`"${documentName}"에 연결할 파일을 선택하세요`}
      size="large"
      footer={footer}
    >
      <div className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1">
            <SldsInput
              placeholder="파일명 또는 설명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<SldsIcon name="search" size="xx-small" className="text-gray-600" />}
            />
          </div>
          <SldsSelect
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: '전체 파일 형식' },
              ...fileTypes.map(type => ({ value: type, label: type }))
            ]}
            className="w-40"
          />
        </div>

        {/* File Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {filteredFiles.length}개의 파일
          </span>
          {selectedFile && (
            <div className="flex items-center gap-2 text-blue-600">
              <SldsIcon name="check" size="xx-small" />
              <span>1개 선택됨</span>
            </div>
          )}
        </div>

        {/* File List */}
        <div className="border border-gray-300 rounded max-h-[400px] overflow-y-auto">
          {filteredFiles.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                
                return (
                  <div
                    key={file.id}
                    className={`
                      p-4 cursor-pointer transition-colors
                      ${isSelected 
                        ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        rounded p-2 flex-shrink-0
                        ${isSelected ? 'bg-blue-600' : 'bg-gray-100'}
                      `}>
                        <SldsIcon 
                          name={getFileIcon(file.fileType)} 
                          size="small" 
                          className={isSelected ? 'text-white' : getFileTypeColor(file.fileType)}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm truncate">{file.title}</h4>
                          <SldsBadge variant="lightest" className="text-xs flex-shrink-0">
                            {file.fileExtension.toUpperCase()}
                          </SldsBadge>
                        </div>
                        
                        {file.description && (
                          <p className="text-xs text-gray-600 mb-2">{file.description}</p>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{formatFileSize(file.contentSize)}</span>
                          <span>•</span>
                          <span>{file.createdBy}</span>
                          <span>•</span>
                          <span>{file.lastModifiedDate}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="bg-blue-600 rounded-full p-1">
                            <SldsIcon name="check" size="xx-small" className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <SldsIcon name="search" size="large" className="text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                검색 결과가 없습니다
              </p>
              <p className="text-xs text-gray-500">
                다른 검색어를 시도해보세요
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <SldsIcon name="info" size="small" className="text-blue-600 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="mb-1">
                <strong>Salesforce Files 라이브러리</strong>
              </p>
              <p className="text-xs text-gray-600">
                파일을 선택하면 ContentDocumentLink가 생성되어 이 제출 자료와 연결됩니다.
                실제 파일은 복사되지 않고 참조만 생성됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SldsModal>
  );
}
