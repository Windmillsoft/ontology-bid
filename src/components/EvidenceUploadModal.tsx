import { useState, useRef } from 'react';
import { SldsModal } from './slds/SldsModal';
import { SldsButton } from './slds/SldsButton';
import { SldsTextarea } from './slds/SldsTextarea';
import { SldsIcon } from './slds/SldsIcon';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (files: File[], reference: string) => void;
}

interface FileWithPreview {
  file: File;
  id: string;
}

export function EvidenceUploadModal({ isOpen, onClose, onConfirm }: EvidenceUploadModalProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [reference, setReference] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleConfirm = () => {
    if (files.length > 0) {
      onConfirm(files.map(f => f.file), reference);
      handleClose();
    }
  };

  const handleClose = () => {
    setFiles([]);
    setReference('');
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const footer = (
    <>
      <SldsButton variant="neutral" onClick={handleClose}>
        취소
      </SldsButton>
      <SldsButton variant="brand" onClick={handleConfirm} disabled={files.length === 0}>
        업로드 ({files.length})
      </SldsButton>
    </>
  );

  return (
    <SldsModal
      isOpen={isOpen}
      onClose={handleClose}
      title="증빙 자료 첨부"
      description="근거(조항/페이지/URL)를 함께 남겨두면 검토가 빨라집니다."
      size="medium"
      footer={footer}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs text-gray-700 mb-2">파일 업로드</label>
          <div
            className={`
              border-2 border-dashed rounded p-8 text-center transition-colors
              ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <SldsIcon name="upload" size="large" className="text-gray-400 mx-auto mb-3" />
            <p className="text-sm mb-2">
              파일을 드래그하여 업로드하거나
            </p>
            <SldsButton
              variant="neutral"
              size="small"
              onClick={() => fileInputRef.current?.click()}
            >
              파일 선택
            </SldsButton>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-600 mt-3">
              PDF, 문서, 이미지 파일 지원 (최대 50MB)
            </p>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs text-gray-700">
              선택된 파일 ({files.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto rounded border border-gray-300 p-3">
              {files.map((fileWithPreview) => (
                <div
                  key={fileWithPreview.id}
                  className="flex items-center gap-3 p-2 rounded bg-gray-50"
                >
                  <SldsIcon name="file" size="small" className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{fileWithPreview.file.name}</p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(fileWithPreview.file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(fileWithPreview.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    aria-label="삭제"
                  >
                    <SldsIcon name="close" size="xx-small" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <SldsTextarea
          label={
            <span className="flex items-center gap-2">
              <SldsIcon name="link" size="xx-small" />
              근거 (조항/페이지/URL)
            </span>
          }
          placeholder="예: 입찰공고 제3조 1항, 21페이지, https://..."
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          rows={2}
          helpText="근거를 명확히 기재하면 검토자가 빠르게 확인할 수 있습니다 (선택사항)"
        />
      </div>
    </SldsModal>
  );
}
