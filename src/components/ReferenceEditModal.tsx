import { useState, useEffect } from 'react';
import { ReferenceInfo } from '../types/ontology';
import { SldsModal } from './slds/SldsModal';
import { SldsButton } from './slds/SldsButton';
import { SldsInput } from './slds/SldsInput';
import { SldsTextarea } from './slds/SldsTextarea';
import { SldsIcon } from './slds/SldsIcon';
import { SldsBadge } from './slds/SldsBadge';

interface ReferenceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReference?: ReferenceInfo;
  onConfirm: (reference: ReferenceInfo) => void;
  nodeLabel: string;
}

export function ReferenceEditModal({ 
  isOpen, 
  onClose, 
  currentReference,
  onConfirm,
  nodeLabel
}: ReferenceEditModalProps) {
  const [page, setPage] = useState('');
  const [article, setArticle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (currentReference) {
      setPage(currentReference.page || '');
      setArticle(currentReference.article || '');
      setContent(currentReference.content || '');
    } else {
      setPage('');
      setArticle('');
      setContent('');
    }
  }, [currentReference, isOpen]);

  const handleConfirm = () => {
    const now = new Date();
    const timestamp = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    onConfirm({
      page: page || undefined,
      article: article || undefined,
      content: content,
      extractedAt: timestamp,
      extractedBy: '수동 입력'
    });
    handleClose();
  };

  const handleClose = () => {
    setPage('');
    setArticle('');
    setContent('');
    setIsPreview(false);
    onClose();
  };

  const insertTag = (tag: string) => {
    const textarea = document.getElementById('reference-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    switch (tag) {
      case 'strong':
        newText = content.substring(0, start) + `<strong>${selectedText}</strong>` + content.substring(end);
        break;
      case 'em':
        newText = content.substring(0, start) + `<em>${selectedText}</em>` + content.substring(end);
        break;
      case 'u':
        newText = content.substring(0, start) + `<u>${selectedText}</u>` + content.substring(end);
        break;
      case 'ul':
        newText = content.substring(0, start) + 
          `<ul>\n  <li>${selectedText || '항목 1'}</li>\n  <li>항목 2</li>\n</ul>` + 
          content.substring(end);
        break;
      case 'ol':
        newText = content.substring(0, start) + 
          `<ol>\n  <li>${selectedText || '항목 1'}</li>\n  <li>항목 2</li>\n</ol>` + 
          content.substring(end);
        break;
      case 'p':
        newText = content.substring(0, start) + `<p>${selectedText}</p>` + content.substring(end);
        break;
    }
    
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length - content.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const footer = (
    <>
      <SldsButton variant="neutral" onClick={handleClose}>
        취소
      </SldsButton>
      <SldsButton 
        variant="brand" 
        onClick={handleConfirm}
        disabled={!content.trim()}
      >
        저장
      </SldsButton>
    </>
  );

  return (
    <SldsModal
      isOpen={isOpen}
      onClose={handleClose}
      title="공고문 근거 편집"
      description={`"${nodeLabel}" 노드의 근거 정보를 입력하세요`}
      size="large"
      footer={footer}
    >
      <div className="space-y-4">
        {/* Reference Info */}
        <div className="grid grid-cols-2 gap-3">
          <SldsInput
            label="페이지"
            placeholder="예: 3-4"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            helpText="공고문의 페이지 번호"
          />
          <SldsInput
            label="조항"
            placeholder="예: 제3조 제1항"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            helpText="해당 조항 정보"
          />
        </div>

        {/* Formatting Toolbar */}
        <div>
          <label className="block text-sm mb-2 text-gray-700">
            근거 내용 <span className="text-red-600">*</span>
          </label>
          
          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 border border-gray-300 rounded">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertTag('strong')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                title="굵게"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => insertTag('em')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                title="강조"
              >
                <em className="text-blue-600">E</em>
              </button>
              <button
                type="button"
                onClick={() => insertTag('u')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                title="밑줄"
              >
                <u>U</u>
              </button>
            </div>
            
            <div className="w-px h-4 bg-gray-300" />
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertTag('ul')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                title="목록"
              >
                • 목록
              </button>
              <button
                type="button"
                onClick={() => insertTag('ol')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                title="번호 목록"
              >
                1. 번호
              </button>
              <button
                type="button"
                onClick={() => insertTag('p')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                title="문단"
              >
                ¶ 문단
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                <SldsIcon name={isPreview ? 'edit' : 'preview'} size="xx-small" />
                {isPreview ? '편집' : '미리보기'}
              </button>
            </div>
          </div>

          {isPreview ? (
            <div className="border border-gray-300 rounded p-3 min-h-[200px] bg-white">
              <div 
                className="prose prose-sm max-w-none
                  [&_p]:my-2 [&_p]:leading-relaxed
                  [&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc
                  [&_ol]:my-2 [&_ol]:ml-4 [&_ol]:list-decimal
                  [&_li]:my-1
                  [&_strong]:text-gray-900
                  [&_em]:text-blue-600 [&_em]:not-italic
                  [&_u]:decoration-blue-600"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">내용 미리보기가 여기에 표시됩니다</p>' }}
              />
            </div>
          ) : (
            <SldsTextarea
              id="reference-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="HTML 태그를 사용하여 근거 내용을 입력하세요"
              rows={12}
              helpText="Rich Text를 위해 HTML 태그 사용 가능"
            />
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <SldsIcon name="info" size="small" className="text-blue-600 flex-shrink-0" />
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>사용 가능한 HTML 태그:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                <li><code>{'<p>'}</code> - 문단</li>
                <li><code>{'<strong>'}</code> - 굵게 (검은색)</li>
                <li><code>{'<em>'}</code> - 강조 (파란색)</li>
                <li><code>{'<u>'}</code> - 밑줄 (파란색)</li>
                <li><code>{'<ul><li>'}</code> - 목록</li>
                <li><code>{'<ol><li>'}</code> - 번호 목록</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SldsModal>
  );
}
