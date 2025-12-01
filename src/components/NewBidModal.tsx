import { useState } from 'react';
import { SldsModal } from './slds/SldsModal';
import { SldsInput } from './slds/SldsInput';
import { SldsSelect } from './slds/SldsSelect';
import { SldsTextarea } from './slds/SldsTextarea';
import { SldsButton } from './slds/SldsButton';
import { SldsIcon } from './slds/SldsIcon';

interface NewBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewBidData) => void;
}

export interface NewBidData {
  name: string;
  noticeNo: string;
  client: string;
  category: string;
  estimatedAmount: string;
  deadline: string;
  owner: string;
  description?: string;
  noticeFile?: File;
}

const CATEGORIES = [
  'SI/시스템 구축',
  '빅데이터/AI',
  '클라우드/인프라',
  '보안/정보보호',
  'IoT/스마트팩토리',
  'ERP/그룹웨어',
  '디지털트윈/메타버스',
  '기타'
];

export function NewBidModal({ isOpen, onClose, onSubmit }: NewBidModalProps) {
  const [formData, setFormData] = useState<NewBidData>({
    name: '',
    noticeNo: '',
    client: '',
    category: '',
    estimatedAmount: '',
    deadline: '',
    owner: '',
    description: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof NewBidData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (errors.noticeFile) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.noticeFile;
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '프로젝트명을 입력해주세요';
    }
    if (!formData.noticeNo.trim()) {
      newErrors.noticeNo = '공고번호를 입력해주세요';
    }
    if (!formData.client.trim()) {
      newErrors.client = '발주처를 입력해주세요';
    }
    if (!formData.category) {
      newErrors.category = '분야를 선택해주세요';
    }
    if (!formData.deadline) {
      newErrors.deadline = '마감일시를 입력해주세요';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = '담당자를 입력해주세요';
    }
    if (!uploadedFile) {
      newErrors.noticeFile = '입찰 공고 파일을 업로드해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        noticeFile: uploadedFile || undefined
      });
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      noticeNo: '',
      client: '',
      category: '',
      estimatedAmount: '',
      deadline: '',
      owner: '',
      description: ''
    });
    setUploadedFile(null);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <SldsModal
      isOpen={isOpen}
      onClose={handleClose}
      title="새 입찰 등록"
      description="입찰 공고를 업로드하고 기본 정보를 입력하세요"
      size="large"
      footer={
        <>
          <SldsButton variant="neutral" onClick={handleClose}>
            취소
          </SldsButton>
          <SldsButton variant="brand" onClick={handleSubmit}>
            등록 및 온톨로지 분석 시작
          </SldsButton>
        </>
      }
    >
      <div className="space-y-6">
        {/* 입찰 공고 파일 업로드 */}
        <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <SldsIcon name="upload" size="large" className="text-blue-600" />
            </div>
            <h3 className="mb-2 text-gray-900">입찰 공고 파일 업로드</h3>
            <p className="text-sm text-gray-600 mb-4">
              PDF, HWP, DOCX 형식의 입찰 공고 파일을 업로드하면 AI가 자동으로 온톨로지 분석을 시작합니다
            </p>
            
            <input
              type="file"
              id="notice-file"
              accept=".pdf,.hwp,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="notice-file">
              <SldsButton
                variant="outline-brand"
                size="medium"
                icon={<SldsIcon name="upload" size="xx-small" />}
                iconPosition="left"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('notice-file')?.click();
                }}
              >
                파일 선택
              </SldsButton>
            </label>

            {uploadedFile && (
              <div className="mt-4 flex items-center gap-2 bg-white rounded px-3 py-2 border border-blue-300">
                <SldsIcon name="file" size="xx-small" className="text-blue-600" />
                <span className="text-sm text-gray-900">{uploadedFile.name}</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <SldsIcon name="close" size="xx-small" />
                </button>
              </div>
            )}

            {errors.noticeFile && (
              <p className="mt-2 text-sm text-red-600">{errors.noticeFile}</p>
            )}
          </div>
        </div>

        {/* 기본 정보 */}
        <div>
          <h3 className="mb-4 text-gray-900">기본 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm mb-1 text-gray-700">
                프로젝트명 <span className="text-red-600">*</span>
              </label>
              <SldsInput
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="예: 스마트시티 통합플랫폼 구축"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                공고번호 <span className="text-red-600">*</span>
              </label>
              <SldsInput
                value={formData.noticeNo}
                onChange={(e) => handleInputChange('noticeNo', e.target.value)}
                placeholder="예: 2025-001"
                error={errors.noticeNo}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                발주처 <span className="text-red-600">*</span>
              </label>
              <SldsInput
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                placeholder="예: 서울시"
                error={errors.client}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                분야 <span className="text-red-600">*</span>
              </label>
              <SldsSelect
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                options={[
                  { value: '', label: '선택하세요' },
                  ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
                ]}
                error={errors.category}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                예정금액
              </label>
              <SldsInput
                value={formData.estimatedAmount}
                onChange={(e) => handleInputChange('estimatedAmount', e.target.value)}
                placeholder="예: 50억원"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                마감일시 <span className="text-red-600">*</span>
              </label>
              <SldsInput
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                error={errors.deadline}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                담당자 <span className="text-red-600">*</span>
              </label>
              <SldsInput
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                placeholder="예: 김PM"
                error={errors.owner}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm mb-1 text-gray-700">
                메모 (선택사항)
              </label>
              <SldsTextarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="입찰 관련 특이사항이나 메모를 입력하세요"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <div className="flex gap-3">
            <SldsIcon name="info" size="small" className="text-blue-600 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="mb-2">등록 후 자동으로 진행되는 작업:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>입찰 공고 문서 AI 분석</li>
                <li>온톨로지 기반 요구사항 트리 구조 생성</li>
                <li>필수 자격요건 및 제출서류 자동 추출</li>
                <li>초기 체크리스트 생성</li>
              </ul>
              <p className="mt-3 text-gray-600">
                분석 완료까지 약 2-3분 소요됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SldsModal>
  );
}
