import { BidInfo, TreeNode, NodeDetail, License, ConsortiumMember, ChecklistItem, BidListItem, RequiredDocument, ContentDocumentLink } from '../types/ontology';
import { contentLibrary } from './contentLibrary';

export const bidInfo: BidInfo = {
  name: "스마트시티 통합플랫폼",
  noticeNo: "2025-001",
  dDay: 3,
  progress: 62
};

export const treeData: TreeNode[] = [
  {
    id: "N0001",
    label: "입찰 참가 자격",
    status: "IN_PROGRESS",
    required: true,
    children: [
      { id: "N0101", label: "기본자격(업종·면허)", status: "RISK", required: true },
      { id: "N0102", label: "실적/인력/장비/재무요건", status: "NOT_STARTED", required: true },
      { id: "N0103", label: "공동수급(구성 제한)", status: "SATISFIED", required: true }
    ]
  },
  {
    id: "N0002",
    label: "제출 서류",
    status: "BLOCKED",
    required: true,
    children: [
      { id: "N0201", label: "기술·제안서", status: "IN_PROGRESS", required: true },
      { id: "N0202", label: "가격서", status: "NOT_STARTED", required: true },
      { id: "N0203", label: "회사소개서", status: "SATISFIED", required: false }
    ]
  },
  {
    id: "N0003",
    label: "평가·낙찰",
    status: "NOT_STARTED",
    required: true,
    children: [
      { id: "N0301", label: "기술평가 항목", status: "NOT_STARTED", required: true },
      { id: "N0302", label: "가격평가 기준", status: "NOT_STARTED", required: true }
    ]
  },
  {
    id: "N0004",
    label: "계약·이행",
    status: "NOT_STARTED",
    required: false,
    children: [
      { id: "N0401", label: "계약 조건", status: "NOT_STARTED", required: false },
      { id: "N0402", label: "이행보증", status: "NOT_STARTED", required: false }
    ]
  }
];

// Bid List Data
export const bidList: BidListItem[] = [
  {
    id: "BID-001",
    name: "스마트시티 통합플랫폼",
    noticeNo: "2025-001",
    client: "서울시",
    status: "IN_PREPARATION",
    dDay: 3,
    deadline: "2025-10-18 17:00",
    progress: 62,
    checklistProgress: 17,
    owner: "김PM",
    estimatedAmount: "50억원",
    createdAt: "2025-10-01",
    category: "SI/시스템 구축"
  },
  {
    id: "BID-002",
    name: "빅데이터 분석 플랫폼 구축",
    noticeNo: "2025-002",
    client: "경기도청",
    status: "REVIEW",
    dDay: 7,
    deadline: "2025-10-22 15:00",
    progress: 85,
    checklistProgress: 75,
    owner: "이차장",
    estimatedAmount: "30억원",
    createdAt: "2025-09-28",
    category: "빅데이터/AI"
  },
  {
    id: "BID-003",
    name: "클라우드 인프라 현대화",
    noticeNo: "2025-003",
    client: "한국전력공사",
    status: "DRAFT",
    dDay: 15,
    deadline: "2025-10-30 18:00",
    progress: 25,
    checklistProgress: 0,
    owner: "박부장",
    estimatedAmount: "80억원",
    createdAt: "2025-10-10",
    category: "클라우드/인프라"
  },
  {
    id: "BID-004",
    name: "전자문서 관리 시스템 고도화",
    noticeNo: "2025-004",
    client: "국토교통부",
    status: "SUBMITTED",
    dDay: -5,
    deadline: "2025-10-10 17:00",
    progress: 100,
    checklistProgress: 100,
    owner: "최과장",
    estimatedAmount: "20억원",
    createdAt: "2025-09-15",
    category: "SI/시스템 구축"
  },
  {
    id: "BID-005",
    name: "IoT 기반 스마트 팩토리",
    noticeNo: "2025-005",
    client: "중소벤처기업부",
    status: "IN_PREPARATION",
    dDay: 12,
    deadline: "2025-10-27 16:00",
    progress: 45,
    checklistProgress: 33,
    owner: "정대리",
    estimatedAmount: "40억원",
    createdAt: "2025-10-05",
    category: "IoT/스마트팩토리"
  },
  {
    id: "BID-006",
    name: "보안관제 시스템 구축",
    noticeNo: "2024-089",
    client: "금융감독원",
    status: "AWARDED",
    dDay: -30,
    deadline: "2025-09-15 17:00",
    progress: 100,
    checklistProgress: 100,
    owner: "김PM",
    estimatedAmount: "35억원",
    createdAt: "2025-08-01",
    category: "보안/정보보호"
  },
  {
    id: "BID-007",
    name: "차세대 ERP 시스템",
    noticeNo: "2024-095",
    client: "포스코",
    status: "LOST",
    dDay: -20,
    deadline: "2025-09-25 15:00",
    progress: 100,
    checklistProgress: 100,
    owner: "이차장",
    estimatedAmount: "120억원",
    createdAt: "2025-08-10",
    category: "ERP/그룹웨어"
  },
  {
    id: "BID-008",
    name: "디지털 트윈 플랫폼",
    noticeNo: "2025-006",
    client: "인천광역시",
    status: "IN_PREPARATION",
    dDay: 20,
    deadline: "2025-11-04 17:00",
    progress: 35,
    checklistProgress: 25,
    owner: "박부장",
    estimatedAmount: "60억원",
    createdAt: "2025-10-12",
    category: "디지털트윈/메타버스"
  }
];

// Global Checklist (제출 전 최종 점검)
export const globalChecklist: ChecklistItem[] = [
  {
    id: "C001",
    label: "마감 시각 확인",
    description: "입찰 마감일시: 2025-10-18 17:00 (한국시간)",
    checked: false,
    category: "deadline"
  },
  {
    id: "C002",
    label: "타임스탬프 검증",
    description: "모든 문서의 최종 수정일시가 마감일 이전인지 확인",
    checked: false,
    category: "deadline"
  },
  {
    id: "C003",
    label: "업로드 파일 검증",
    description: "파일 손상 여부, 용량 제한(50MB), 바이러스 검사 완료",
    checked: true,
    checkedBy: "김기술",
    checkedAt: "2025-10-14 16:00",
    category: "upload"
  },
  {
    id: "C004",
    label: "서명 및 날인 확인",
    description: "대표이사 서명, 법인인감 날인 완료 여부",
    checked: false,
    category: "signature"
  },
  {
    id: "C005",
    label: "문서 암호 설정",
    description: "요구되는 문서의 암호 설정 및 별도 제출 확인",
    checked: false,
    category: "signature"
  },
  {
    id: "C006",
    label: "파일명 규칙 준수",
    description: "공고에서 요구하는 파일명 형식 준수 (예: 회사명_문서종류_버전)",
    checked: true,
    checkedBy: "이영희",
    checkedAt: "2025-10-13 14:30",
    category: "filename"
  },
  {
    id: "C007",
    label: "금액 숫자 일치",
    description: "견적서/제안서의 모든 숫자 금액이 일치하는지 확인",
    checked: false,
    category: "amount"
  },
  {
    id: "C008",
    label: "금액 한글 일치",
    description: "숫자 금액과 한글 금액(예: 일억이천만원)이 일치하는지 확인",
    checked: false,
    category: "amount"
  },
  {
    id: "C009",
    label: "부가세 표기 확인",
    description: "부가세 포함/별도 여부가 명확히 표기되어 있는지 확인",
    checked: false,
    category: "amount"
  },
  {
    id: "C010",
    label: "증빙서류 유효기간",
    description: "모든 증빙서류(면허증, 실적증명 등)의 유효기간 확인",
    checked: false,
    category: "evidence"
  },
  {
    id: "C011",
    label: "원본/사본 구분",
    description: "원본 제출 요구 서류는 원본으로, 사본 가능 서류는 사본으로 제출",
    checked: false,
    category: "evidence"
  },
  {
    id: "C012",
    label: "제출 서류 목록 대조",
    description: "공고문의 제출 서류 목록과 실제 제출 파일 일치 여부 확인",
    checked: false,
    category: "general"
  }
];

export const nodeDetailsMap: Record<string, NodeDetail> = {
  "N0101": {
    id: "N0101",
    label: "기본자격(업종·면허)",
    status: "RISK",
    required: true,
    licenseType: "정보통신",
    weight: 30,
    owner: "홍길동",
    reviewer: "김PM",
    relatedNodes: 3,
    reference: {
      page: "3-4",
      article: "제3조 제1항",
      content: `<p><strong>제3조 (입찰 참가 자격 요건)</strong></p>
<p>① 입찰에 참가하고자 하는 자는 다음 각 호의 요건을 모두 갖추어야 한다.</p>
<ul>
  <li>1. <strong>정보통신공사업</strong> 등록증을 보유한 업체</li>
  <li>2. 등록증의 <em>유효기간</em>이 입찰 마감일로부터 <u>최소 3개월 이상</u> 남아있을 것</li>
  <li>3. 최근 5년 내 동종 업종의 실적이 있을 것</li>
</ul>
<p class="mt-2 text-sm text-gray-600">※ 공동수급체의 경우 주관사가 상기 요건을 충족해야 함</p>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [
      {
        id: "E001",
        name: "자격요건_근거.pdf",
        version: "v2",
        by: "홍길동",
        at: "2025-10-12 09:22",
        reference: "입찰공고 3조 1항"
      },
      {
        id: "E002",
        name: "면허증_사본.pdf",
        version: "v1",
        by: "김PM",
        at: "2025-10-11 14:30",
        reference: "증빙자료"
      }
    ],
    requiredDocuments: [
      {
        id: "RD001",
        name: "정보통신공사업 등록증",
        description: "유효기간 내의 등록증 사본",
        required: true,
        contentDocumentLink: {
          id: "CDL001",
          contentDocumentId: "CD001",
          linkedEntityId: "N0101",
          contentDocument: contentLibrary[0],
          linkedBy: "홍길동",
          linkedAt: "2025-10-12 09:22"
        }
      },
      {
        id: "RD002",
        name: "법인 인감증명서",
        description: "발급일로부터 3개월 이내",
        required: true
      },
      {
        id: "RD003",
        name: "사업자등록증",
        description: "사본 제출 가능",
        required: true
      }
    ],
    history: [
      {
        id: "H001",
        at: "2025-10-12 09:22",
        who: "홍길동",
        action: "상태 변경",
        from: "NOT_STARTED",
        to: "RISK",
        detail: "면허 만료일이 입찰 마감일과 근접함"
      },
      {
        id: "H002",
        at: "2025-10-10 16:00",
        who: "김PM",
        action: "노드 생성",
        detail: "온톨로지 분석을 통해 자동 생성"
      }
    ]
  },
  "N0102": {
    id: "N0102",
    label: "실적/인력/장비/재무요건",
    status: "NOT_STARTED",
    required: true,
    weight: 40,
    owner: "이영희",
    reviewer: "김PM",
    relatedNodes: 5,
    reference: {
      page: "4-5",
      article: "제4조",
      content: `<p><strong>제4조 (기술 능력 및 경영 상태)</strong></p>
<p>입찰 참가자는 다음의 기술능력 및 경영상태 요건을 충족해야 한다.</p>
<ol>
  <li><strong>실적 요건:</strong> 최근 5년간 유사 프로젝트 수행 실적 <em>2건 이상</em></li>
  <li><strong>인력 요건:</strong>
    <ul>
      <li>특급기술자 2인 이상</li>
      <li>고급기술자 5인 이상</li>
      <li>중급기술자 10인 이상</li>
    </ul>
  </li>
  <li><strong>장비 요건:</strong> 프로젝트 수행에 필요한 시험·측정 장비 보유</li>
  <li><strong>재무 요건:</strong> 최근 3개년 평균 매출액이 예정가격의 <u>50% 이상</u></li>
</ol>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [],
    requiredDocuments: [
      {
        id: "RD101",
        name: "유사 프로젝트 실적증명서",
        description: "최근 5년간 2건 이상",
        required: true
      },
      {
        id: "RD102",
        name: "기술인력 보유현황",
        description: "특급 2인, 고급 5인, 중급 10인",
        required: true
      },
      {
        id: "RD103",
        name: "재무제표",
        description: "최근 3개년",
        required: true
      },
      {
        id: "RD104",
        name: "장비 보유현황",
        description: "시험·측정 장비 목록",
        required: false
      }
    ],
    history: [
      {
        id: "H003",
        at: "2025-10-10 16:00",
        who: "김PM",
        action: "노드 생성",
        detail: "온톨로지 분석을 통해 자동 생성"
      }
    ]
  },
  "N0103": {
    id: "N0103",
    label: "공동수급(구성 제한)",
    status: "SATISFIED",
    required: true,
    weight: 20,
    owner: "박철수",
    reviewer: "김PM",
    relatedNodes: 2,
    reference: {
      page: "5",
      article: "제5조",
      content: `<p><strong>제5조 (공동수급체 구성 제한)</strong></p>
<p>공동수급체로 참가하는 경우 다음 요건을 준수해야 한다.</p>
<ol>
  <li>구성원은 <strong>3개 업체 이내</strong>로 제한</li>
  <li>주관사의 지분율은 <em>최소 40% 이상</em>이어야 함</li>
  <li>구성원 간 출자비율 합계는 100%여야 함</li>
  <li>구성원 변경은 입찰 공고 이후 <u>불가</u></li>
</ol>
<p class="mt-2 bg-yellow-50 p-2 rounded">⚠️ 공동수급협정서는 입찰서 제출 시 필수 첨부</p>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [
      {
        id: "E003",
        name: "공동수급협정서.pdf",
        version: "v3",
        by: "박철수",
        at: "2025-10-13 11:00",
        reference: "별첨 1"
      }
    ],
    requiredDocuments: [
      {
        id: "RD201",
        name: "공동수급협정서",
        description: "전체 구성원 날인 완료",
        required: true,
        contentDocumentLink: {
          id: "CDL201",
          contentDocumentId: "CD008",
          linkedEntityId: "N0103",
          contentDocument: contentLibrary[7],
          linkedBy: "박철수",
          linkedAt: "2025-10-13 11:00"
        }
      },
      {
        id: "RD202",
        name: "구성원 출자지분 확인서",
        description: "주관사 40% 이상 확인",
        required: true,
        contentDocumentLink: {
          id: "CDL202",
          contentDocumentId: "CD009",
          linkedEntityId: "N0103",
          contentDocument: contentLibrary[8],
          linkedBy: "박철수",
          linkedAt: "2025-10-13 10:45"
        }
      }
    ],
    history: [
      {
        id: "H004",
        at: "2025-10-13 11:05",
        who: "박철수",
        action: "상태 변경",
        from: "IN_PROGRESS",
        to: "SATISFIED",
        detail: "컨소시엄 협정서 최종 완료"
      },
      {
        id: "H005",
        at: "2025-10-12 10:00",
        who: "박철수",
        action: "상태 변경",
        from: "NOT_STARTED",
        to: "IN_PROGRESS"
      }
    ]
  },
  "N0201": {
    id: "N0201",
    label: "기술·제안서",
    status: "IN_PROGRESS",
    required: true,
    weight: 50,
    owner: "김기술",
    reviewer: "김PM",
    relatedNodes: 8,
    reference: {
      page: "8-12",
      article: "제8조 제2항",
      content: `<p><strong>제8조 (제출서류)</strong></p>
<p>② 기술제안서는 다음의 구성 및 분량으로 제출해야 한다.</p>
<table class="w-full border-collapse border border-gray-300 mt-2">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-3 py-2 text-left">항목</th>
      <th class="border border-gray-300 px-3 py-2 text-left">내용</th>
      <th class="border border-gray-300 px-3 py-2 text-center">분량</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-3 py-2">사업 이해도</td>
      <td class="border border-gray-300 px-3 py-2">프로젝트 목표 및 범위 이해</td>
      <td class="border border-gray-300 px-3 py-2 text-center">10페이지</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-3 py-2"><strong>기술 방안</strong></td>
      <td class="border border-gray-300 px-3 py-2">아키텍처, 기술스택, 구현방안</td>
      <td class="border border-gray-300 px-3 py-2 text-center"><em>30페이지</em></td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-3 py-2">수행 계획</td>
      <td class="border border-gray-300 px-3 py-2">일정, 인력투입, WBS</td>
      <td class="border border-gray-300 px-3 py-2 text-center">15페이지</td>
    </tr>
  </tbody>
</table>
<p class="mt-3 text-red-600"><strong>※ 총 분량은 100페이지를 초과할 수 없음</strong></p>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [
      {
        id: "E004",
        name: "기술제안서_초안.docx",
        version: "v1",
        by: "김기술",
        at: "2025-10-14 15:30"
      }
    ],
    requiredDocuments: [
      {
        id: "RD301",
        name: "사업 이해도 문서",
        description: "10페이지 이내",
        required: true,
        contentDocumentLink: {
          id: "CDL301",
          contentDocumentId: "CD011",
          linkedEntityId: "N0201",
          contentDocument: contentLibrary[10],
          linkedBy: "김기술",
          linkedAt: "2025-10-14 15:30"
        }
      },
      {
        id: "RD302",
        name: "기술 방안서",
        description: "30페이지 이내 (아키텍처, 기술스택)",
        required: true
      },
      {
        id: "RD303",
        name: "수행 계획서",
        description: "15페이지 이내 (일정, 인력투입)",
        required: true
      }
    ],
    history: [
      {
        id: "H006",
        at: "2025-10-14 15:35",
        who: "김기술",
        action: "상태 변경",
        from: "NOT_STARTED",
        to: "IN_PROGRESS",
        detail: "초안 작성 시작"
      }
    ]
  },
  "N0301": {
    id: "N0301",
    label: "기술평가 항목",
    status: "NOT_STARTED",
    required: true,
    weight: 60,
    owner: "김기술",
    reviewer: "김PM",
    relatedNodes: 4,
    reference: {
      page: "15-18",
      article: "제10조",
      content: `<p><strong>제10조 (기술평가 기준)</strong></p>
<p>기술제안서는 다음의 평가 항목에 따라 심사하며, 총 100점 만점으로 평가한다.</p>
<table class="w-full border-collapse border border-gray-300 mt-2">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 px-3 py-2 text-left">평가 항목</th>
      <th class="border border-gray-300 px-3 py-2 text-center">배점</th>
      <th class="border border-gray-300 px-3 py-2 text-left">평가 내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-3 py-2"><strong>사업 이해도</strong></td>
      <td class="border border-gray-300 px-3 py-2 text-center">20점</td>
      <td class="border border-gray-300 px-3 py-2">사업 목표 및 범위에 대한 이해 정도</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-3 py-2"><strong>기술적 우수성</strong></td>
      <td class="border border-gray-300 px-3 py-2 text-center"><em>40점</em></td>
      <td class="border border-gray-300 px-3 py-2">제안 기술의 창의성, 실현가능성, 확장성</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-3 py-2"><strong>수행 능력</strong></td>
      <td class="border border-gray-300 px-3 py-2 text-center">25점</td>
      <td class="border border-gray-300 px-3 py-2">프로젝트 관리 방안, 인력 투입 계획</td>
    </tr>
    <tr>
      <td class="border border-gray-300 px-3 py-2"><strong>유지보수 계획</strong></td>
      <td class="border border-gray-300 px-3 py-2 text-center">15점</td>
      <td class="border border-gray-300 px-3 py-2">사후관리 및 유지보수 방안</td>
    </tr>
  </tbody>
</table>
<p class="mt-3 text-red-600"><strong>※ 기술평가 70점 미만 시 <u>입찰 무효</u> 처리</strong></p>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [],
    requiredDocuments: [
      {
        id: "RD310",
        name: "평가 항목별 제안서",
        description: "각 평가 항목에 대한 상세 제안",
        required: true
      },
      {
        id: "RD311",
        name: "기술 증빙 자료",
        description: "특허, 인증서 등",
        required: false
      }
    ],
    history: [
      {
        id: "H310",
        at: "2025-10-10 16:00",
        who: "김PM",
        action: "노드 생성",
        detail: "온톨로지 분석을 통해 자동 생성"
      }
    ]
  },
  "N0302": {
    id: "N0302",
    label: "가격평가 기준",
    status: "NOT_STARTED",
    required: true,
    weight: 40,
    owner: "최과장",
    reviewer: "김PM",
    relatedNodes: 2,
    reference: {
      page: "19-20",
      article: "제11조",
      content: `<p><strong>제11조 (가격평가 방법)</strong></p>
<p>① 가격평가는 다음 산식에 의하여 계산한다.</p>
<div class="bg-blue-50 p-4 rounded mt-2 mb-3">
  <p class="text-center"><strong>가격점수 = (예정가격 - 입찰가격) / 예정가격 × 100 × 가격배점(40점)</strong></p>
</div>
<p>② 예정가격 대비 입찰가격의 비율에 따른 점수 산정</p>
<ul class="ml-4 mt-2 space-y-1">
  <li>• 예정가격의 <em>95% 이하</em>: 만점</li>
  <li>• 예정가격의 95% 초과 ~ 98% 이하: 비례 배점</li>
  <li>• 예정가격의 98% 초과: 0점</li>
</ul>
<p class="mt-3">③ <strong>종합평가 낙찰 방식</strong></p>
<p class="ml-4">기술평가(60점) + 가격평가(40점) = 총점 100점</p>
<p class="mt-2 bg-yellow-50 p-2 rounded">⚠️ 최고 득점자를 낙찰자로 선정</p>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [],
    requiredDocuments: [
      {
        id: "RD320",
        name: "가격 제안서",
        description: "세부 견적 내역",
        required: true
      },
      {
        id: "RD321",
        name: "원가 계산서",
        description: "원가 산출 근거",
        required: true
      }
    ],
    history: [
      {
        id: "H320",
        at: "2025-10-10 16:00",
        who: "김PM",
        action: "노드 생성",
        detail: "온톨로지 분석을 통해 자동 생성"
      }
    ]
  },
  "N0401": {
    id: "N0401",
    label: "계약 조건",
    status: "NOT_STARTED",
    required: false,
    weight: 15,
    owner: "정대리",
    reviewer: "김PM",
    relatedNodes: 3,
    reference: {
      page: "22-24",
      article: "제15조",
      content: `<p><strong>제15조 (계약 조건)</strong></p>
<p>낙찰자는 다음의 조건에 따라 계약을 체결하여야 한다.</p>
<ol class="ml-4 mt-2 space-y-2">
  <li><strong>1. 계약 기간</strong>
    <ul class="ml-4 mt-1">
      <li>• 착수: 계약일로부터 <em>10일 이내</em></li>
      <li>• 완료: 착수일로부터 <u>12개월 이내</u></li>
    </ul>
  </li>
  <li><strong>2. 대금 지급</strong>
    <ul class="ml-4 mt-1">
      <li>• 선급금: 계약금액의 30% (계약 체결 후 15일 이내)</li>
      <li>• 중도금: 계약금액의 40% (전체 진행률 50% 달성 시)</li>
      <li>• 잔금: 계약금액의 30% (사업 완료 후 검수 완료 시)</li>
    </ul>
  </li>
  <li><strong>3. 지체상금</strong>
    <p class="ml-4 mt-1">공기 지연 시 지연일수 × 계약금액 × 0.5/1000</p>
  </li>
  <li><strong>4. 하자보수</strong>
    <p class="ml-4 mt-1">준공 후 <em>1년간</em> 무상 하자보수 의무</p>
  </li>
</ol>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [],
    requiredDocuments: [
      {
        id: "RD410",
        name: "계약서 초안 검토 의견",
        description: "법무 검토 결과",
        required: false
      }
    ],
    history: [
      {
        id: "H410",
        at: "2025-10-10 16:00",
        who: "김PM",
        action: "노드 생성",
        detail: "온톨로지 분석을 통해 자동 생성"
      }
    ]
  },
  "N0402": {
    id: "N0402",
    label: "이행보증",
    status: "NOT_STARTED",
    required: false,
    weight: 10,
    owner: "정대리",
    reviewer: "김PM",
    relatedNodes: 1,
    reference: {
      page: "25",
      article: "제16조",
      content: `<p><strong>제16조 (이행보증)</strong></p>
<p>① 낙찰자는 계약 체결 시 다음 중 하나의 방법으로 이행보증을 제공하여야 한다.</p>
<ul class="ml-4 mt-2 space-y-2">
  <li>
    <strong>1. 이행보증보험증권</strong>
    <p class="ml-4 text-sm text-gray-600">계약금액의 <em>10%</em>에 해당하는 금액</p>
  </li>
  <li>
    <strong>2. 이행지급보증서</strong>
    <p class="ml-4 text-sm text-gray-600">금융기관 또는 보증기관 발행</p>
  </li>
  <li>
    <strong>3. 국채 또는 공채</strong>
    <p class="ml-4 text-sm text-gray-600">계약금액의 10% 상당액</p>
  </li>
</ul>
<p class="mt-3">② 이행보증 제공 기한</p>
<p class="ml-4 bg-blue-50 p-2 rounded">계약 체결일로부터 <u>7일 이내</u></p>
<p class="mt-3">③ 보증 유효기간</p>
<p class="ml-4">계약 종료일로부터 <em>3개월</em>까지 유효해야 함</p>
<div class="mt-3 bg-red-50 border border-red-200 p-3 rounded">
  <p class="text-red-700"><strong>⚠️ 중요:</strong> 이행보증 미제출 시 계약 해지 사유에 해당</p>
</div>`,
      extractedAt: "2025-10-10 16:00",
      extractedBy: "AI 온톨로지 분석"
    },
    evidence: [],
    requiredDocuments: [
      {
        id: "RD420",
        name: "이행보증보험증권 또는 지급보증서",
        description: "계약금액의 10%",
        required: false
      }
    ],
    history: [
      {
        id: "H420",
        at: "2025-10-10 16:00",
        who: "김PM",
        action: "노드 생성",
        detail: "온톨로지 분석을 통해 자동 생성"
      }
    ]
  }
};

export const ownedLicenses: License[] = [
  {
    id: "L001",
    name: "정보통신공사업 등록증",
    expiryDate: "2026-12-31",
    issuer: "과학기술정보통신부",
    owner: "선진엔지니어링"
  },
  {
    id: "L002",
    name: "소프트웨어사업자 신고확인서",
    expiryDate: "2027-03-15",
    issuer: "한국소프트웨어산업협회",
    owner: "선진엔지니어링"
  }
];

export const consortiumMembers: ConsortiumMember[] = [
  {
    id: "C001",
    name: "선진엔지니어링",
    share: 60,
    role: "주관사",
    licenses: ownedLicenses
  },
  {
    id: "C002",
    name: "테크솔루션",
    share: 30,
    role: "참여사",
    licenses: [
      {
        id: "L003",
        name: "전기공사업 등록증",
        expiryDate: "2026-08-20",
        issuer: "산업통상자원부",
        owner: "테크솔루션"
      }
    ]
  },
  {
    id: "C003",
    name: "디지털이노베이션",
    share: 10,
    role: "참여사",
    licenses: [
      {
        id: "L004",
        name: "정보보안 관리체계 인증",
        expiryDate: "2026-11-30",
        issuer: "한국인터넷진흥원",
        owner: "디지털이노베이션"
      }
    ]
  }
];
