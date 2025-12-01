# 입찰 온톨로지 LWC UI 시스템

엔지니어링 회사를 위한 입찰 공고 온톨로지 분석 및 관리 시스템

## 프로젝트 개요

입찰 공고를 온톨로지로 분석하여 계층 트리/그래프로 시각화하고, 각 노드에 상태 변경/면허 매핑/근거 관리/제출 자료 연결 기능을 제공하는 2-패널 레이아웃의 시스템입니다.

### 주요 기능

- **입찰 목록 관리**: 입찰 목록 조회, 새 입찰 등록
- **온톨로지 트리 시각화**: 계층 구조로 입찰 요구사항 표시
- **노드 상세 정보**: 각 노드별 상태, 담당자, 면허, 근거 관리
- **제출 자료 연결**: Salesforce ContentDocumentLink 방식으로 파일 선택
- **체크리스트 시스템**: 제출 전 최종 점검 12개 항목 (긴급 항목 강조)

### 사용자 역할

- 영업/제안 PM
- 기술 검토자
- 계약/입찰 담당자
- 컨소시엄 파트너

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Design System**: Salesforce Lightning Design System (SLDS)
- **Icons**: Lucide React
- **Charts**: Recharts

## 프로젝트 구조

```
figma/
├── App.tsx                          # 메인 애플리케이션 엔트리
├── components/
│   ├── BidListPage.tsx             # 입찰 목록 페이지
│   ├── BidDetailPage.tsx           # 입찰 상세 페이지
│   ├── OntologyTreePanel.tsx       # 좌측 온톨로지 트리 패널
│   ├── NodeDetailPanel.tsx         # 우측 노드 상세 패널
│   ├── SubmissionDocumentPanel.tsx # 제출 자료 패널
│   ├── NewBidModal.tsx             # 새 입찰 등록 모달
│   ├── StatusChangeModal.tsx       # 상태 변경 모달
│   ├── LicenseMappingModal.tsx     # 면허 매핑 모달
│   ├── ReferenceEditModal.tsx      # 근거 편집 모달
│   ├── FileSelectorModal.tsx       # 파일 선택 모달
│   ├── ChecklistModal.tsx          # 체크리스트 모달
│   ├── EvidenceUploadModal.tsx     # 근거 자료 업로드 모달
│   ├── BidStatusBadge.tsx          # 입찰 상태 뱃지
│   ├── StatusBadge.tsx             # 노드 상태 뱃지
│   └── slds/                       # SLDS 커스텀 컴포넌트 (13개)
│       ├── SldsBadge.tsx
│       ├── SldsButton.tsx
│       ├── SldsCard.tsx
│       ├── SldsCheckbox.tsx
│       ├── SldsIcon.tsx
│       ├── SldsInput.tsx
│       ├── SldsModal.tsx
│       ├── SldsProgressBar.tsx
│       ├── SldsRadioGroup.tsx
│       ├── SldsSelect.tsx
│       ├── SldsTabs.tsx
│       └── SldsTextarea.tsx
├── data/
│   ├── mockData.ts                 # 입찰 데이터 (3개 입찰)
│   └── contentLibrary.ts           # 파일 라이브러리 (30개 파일)
├── types/
│   └── ontology.ts                 # TypeScript 타입 정의
└── styles/
    └── globals.css                 # 글로벌 스타일 + SLDS 토큰
```

## SLDS 디자인 시스템

Salesforce Lightning Design System을 기반으로 한 13개의 커스텀 컴포넌트를 구현하여, 향후 Salesforce LWC로 이식하기 쉽게 설계되었습니다.

### SLDS 컴포넌트

- Badge, Button, Card, Checkbox
- Icon, Input, Modal, ProgressBar
- RadioGroup, Select, Tabs, Textarea

### SLDS 색상 토큰

- Primary: `#0176d3` (Salesforce Blue)
- Success: `#2e844a`
- Warning: `#fe9339`
- Error: `#ea001e`
- Neutral: `#706e6b`

## 데이터 구조

### 입찰 (Bid)

```typescript
interface Bid {
  id: string;
  bidNumber: string;
  title: string;
  client: string;
  announcementDate: string;
  deadline: string;
  status:
    | "planning"
    | "in-progress"
    | "submitted"
    | "awarded"
    | "lost";
  estimatedAmount: string;
  ontology: OntologyNode;
  checklist: ChecklistItem[];
}
```

### 온톨로지 노드 (OntologyNode)

```typescript
interface OntologyNode {
  id: string;
  label: string;
  type: "requirement" | "license" | "document" | "condition";
  status: "pending" | "in-progress" | "completed" | "blocked";
  assignee?: string;
  children?: OntologyNode[];
  reference?: string;
  evidenceFiles?: string[];
  submissionDocuments?: SubmissionDocument[];
  licenseMapping?: LicenseMapping[];
}
```

## 주요 모달

1. **새 입찰 등록**: 입찰 기본 정보 입력
2. **상태 변경**: 노드 상태 변경 + 메모
3. **면허 매핑**: 요구 면허와 보유 면허 매핑
4. **근거 편집**: Rich Text 기반 공고문 근거 작성
5. **파일 선택**: ContentDocumentLink 방식 파일 선택
6. **체크리스트**: 제출 전 12개 항목 점검
7. **근거 자료 업로드**: 근거 파일 업로드 및 관리

## 체크리스트 항목 (12개)

✅ 필수 제출 서류 완료  
✅ 모든 라이선스 유효성 확인  
✅ 기술 사양 검토 완료  
✅ 가격 견적 최종 승인  
⚠️ 법률 검토 완료 (긴급)  
⚠️ 재무 보증 서류 준비 (긴급)  
✅ 프로젝트 일정 검토  
✅ 리스크 평가 완료  
✅ 참고 자료 첨부  
⚠️ 최종 승인 대기 (긴급)  
✅ 제안서 품질 검토  
✅ 제출 방법 확인

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## Salesforce LWC 이식 가이드

본 프로토타입은 Salesforce Lightning Web Components로 이식하기 쉽게 설계되었습니다.

### 이식 시 고려사항

1. **SLDS 컴포넌트**: `lightning-*` 네이티브 컴포넌트로 교체
2. **데이터 소스**: Apex Controller와 연결
3. **파일 관리**: ContentDocumentLink 표준 객체 사용
4. **상태 관리**: LWC @wire와 @track 데코레이터 활용
5. **스타일링**: SLDS CSS 클래스로 변환

## 라이선스

Copyright © 2025 Windmillsoft. All rights reserved.

---

**Built with Figma Make** | Designed for Salesforce Lightning Web Components