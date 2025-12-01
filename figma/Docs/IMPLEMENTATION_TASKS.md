# Salesforce LWC 재구현 작업 목록

> **작업 규칙**: 각 작업을 완료할 때마다 체크박스에 `[x]`를 표시하고 커밋합니다.

## 📋 전체 진행 상황

- **Phase 1**: 0/7 완료 (0%)
- **Phase 2**: 0/12 완료 (0%)
- **Phase 3**: 0/9 완료 (0%)
- **Phase 4**: 0/14 완료 (0%)
- **Phase 5**: 0/5 완료 (0%)
- **전체**: 0/47 완료 (0%)

---

## Phase 1: 기초 설정 및 데이터 모델 (Foundation)

### 1.1 Salesforce 환경 설정
- [ ] **Task 1.1.1**: Salesforce Developer Org 생성 또는 Sandbox 환경 준비
- [ ] **Task 1.1.2**: SFDX 프로젝트 초기화
  - `sfdx force:project:create -n ontology-bid-lwc`
- [ ] **Task 1.1.3**: Git 리포지토리 연결 및 `.gitignore` 설정

### 1.2 Custom Objects 생성
- [ ] **Task 1.2.1**: `Bid__c` (입찰) Object 생성
  - Fields: Name, NoticeNo__c, Client__c, Status__c, Deadline__c, EstimatedAmount__c, Owner__c, Progress__c, ChecklistProgress__c, Category__c, CreatedDate
  - Tab 및 Page Layout 설정
  
- [ ] **Task 1.2.2**: `OntologyNode__c` (온톨로지 노드) Object 생성
  - Fields: Name, Bid__c (Master-Detail), ParentNode__c (Lookup), Status__c, Required__c, Owner__c, Reviewer__c, Weight__c, LicenseType__c, RelatedNodes__c
  - Hierarchy 구조 설정
  
- [ ] **Task 1.2.3**: `NodeEvidence__c` (노드 근거) Object 생성
  - Fields: Node__c (Master-Detail), Name, Version__c, CreatedBy__c, CreatedDate__c, Reference__c
  
- [ ] **Task 1.2.4**: `ChecklistItem__c` (체크리스트) Object 생성
  - Fields: Bid__c (Master-Detail), Label__c, Description__c, Checked__c, CheckedBy__c, CheckedAt__c, Category__c

---

## Phase 2: Base SLDS Components (기본 컴포넌트)

> 다른 컴포넌트에서 재사용되는 기본 UI 컴포넌트들

### 2.1 Badge Components
- [ ] **Task 2.1.1**: `c-slds-badge` 컴포넌트 생성
  - Props: label, variant (default/success/warning/error/lightest)
  - 파일: `force-app/main/default/lwc/sldsBadge/`

- [ ] **Task 2.1.2**: `c-status-badge` 컴포넌트 생성 (노드 상태)
  - Props: status (NOT_STARTED/IN_PROGRESS/BLOCKED/RISK/SATISFIED)
  - SldsBadge 컴포넌트 활용

- [ ] **Task 2.1.3**: `c-bid-status-badge` 컴포넌트 생성 (입찰 상태)
  - Props: status (DRAFT/IN_PREPARATION/REVIEW/SUBMITTED/AWARDED/LOST)
  - SldsBadge 컴포넌트 활용

### 2.2 Form Components
- [ ] **Task 2.2.1**: `c-slds-input` 컴포넌트 생성
  - Props: label, value, required, type, error
  - Event: valuechange
  
- [ ] **Task 2.2.2**: `c-slds-select` 컴포넌트 생성
  - Props: label, value, required, options, error
  - Event: valuechange
  
- [ ] **Task 2.2.3**: `c-slds-textarea` 컴포넌트 생성
  - Props: label, value, required, rows, error
  - Event: valuechange
  
- [ ] **Task 2.2.4**: `c-slds-checkbox` 컴포넌트 생성
  - Props: label, checked, description
  - Event: change

### 2.3 UI Components
- [ ] **Task 2.3.1**: `c-slds-card` 컴포넌트 생성
  - Props: title, iconName
  - Slots: default, actions, footer
  
- [ ] **Task 2.3.2**: `c-slds-progress-bar` 컴포넌트 생성
  - Props: value, label, size
  
- [ ] **Task 2.3.3**: `c-slds-tabs` 컴포넌트 생성
  - Props: tabs (array), activeTab
  - Event: tabchange

- [ ] **Task 2.3.4**: `c-slds-icon` 컴포넌트 생성
  - Props: iconName, size, variant
  
- [ ] **Task 2.3.5**: `c-slds-modal` 컴포넌트 생성
  - Props: isOpen, title, size
  - Slots: default, footer
  - Event: close

---

## Phase 3: Apex Controllers (백엔드 로직)

### 3.1 Bid Controller
- [ ] **Task 3.1.1**: `BidController.cls` 생성
  - Method: `getBids()` - 입찰 목록 조회
  - Method: `getBidDetail(Id bidId)` - 입찰 상세 조회
  - Method: `createBid(Bid__c bid)` - 새 입찰 생성
  - Method: `updateBidStatus(Id bidId, String status)` - 입찰 상태 변경
  
- [ ] **Task 3.1.2**: `BidController_Test.cls` 테스트 클래스 작성
  - 모든 메소드 80% 이상 커버리지

### 3.2 Ontology Controller
- [ ] **Task 3.2.1**: `OntologyController.cls` 생성
  - Method: `getOntologyTree(Id bidId)` - 온톨로지 트리 조회
  - Method: `getNodeDetail(Id nodeId)` - 노드 상세 조회
  - Method: `updateNodeStatus(Id nodeId, String status, String note)` - 노드 상태 변경
  - Method: `getNodeHistory(Id nodeId)` - 노드 히스토리 조회
  
- [ ] **Task 3.2.2**: `OntologyController_Test.cls` 테스트 클래스 작성

### 3.3 Evidence Controller
- [ ] **Task 3.3.1**: `EvidenceController.cls` 생성
  - Method: `getEvidences(Id nodeId)` - 근거 목록 조회
  - Method: `createEvidence(NodeEvidence__c evidence)` - 근거 생성
  - Method: `deleteEvidence(Id evidenceId)` - 근거 삭제
  
- [ ] **Task 3.3.2**: `EvidenceController_Test.cls` 테스트 클래스 작성

### 3.4 Content Controller
- [ ] **Task 3.4.1**: `ContentController.cls` 생성
  - Method: `getContentDocuments()` - 파일 라이브러리 조회
  - Method: `linkContentToNode(Id nodeId, Id contentDocumentId)` - 파일 연결
  - Method: `getLinkedFiles(Id nodeId)` - 연결된 파일 조회
  - Method: `unlinkContentFromNode(Id linkId)` - 파일 연결 해제
  
- [ ] **Task 3.4.2**: `ContentController_Test.cls` 테스트 클래스 작성

### 3.5 Checklist Controller
- [ ] **Task 3.5.1**: `ChecklistController.cls` 생성
  - Method: `getChecklist(Id bidId)` - 체크리스트 조회
  - Method: `updateChecklistItem(Id itemId, Boolean checked)` - 체크 상태 변경
  - Method: `initializeChecklist(Id bidId)` - 체크리스트 초기화
  
- [ ] **Task 3.5.2**: `ChecklistController_Test.cls` 테스트 클래스 작성

---

## Phase 4: Main Components (주요 컴포넌트)

### 4.1 입찰 목록 페이지
- [ ] **Task 4.1.1**: `c-bid-list-page` 컴포넌트 생성
  - Wire: BidController.getBids()
  - 입찰 목록 테이블 표시
  - 검색/필터 기능
  - 정렬 기능
  - Event: bidselected, createnew

### 4.2 입찰 상세 페이지
- [ ] **Task 4.2.1**: `c-bid-detail-page` 컴포넌트 생성
  - Wire: BidController.getBidDetail()
  - 헤더: 입찰 정보, D-Day, 진행률
  - 체크리스트 배너 (긴급 항목 강조)
  - 2-패널 레이아웃 (트리 + 상세)
  - Event: back

### 4.3 온톨로지 트리 패널
- [ ] **Task 4.3.1**: `c-ontology-tree-panel` 컴포넌트 생성
  - Wire: OntologyController.getOntologyTree()
  - 계층 트리 구조 표시
  - 노드 상태 뱃지
  - 노드 선택 기능
  - 검색/필터 기능
  - Event: nodeselected

- [ ] **Task 4.3.2**: `c-tree-node` 하위 컴포넌트 생성
  - 재귀적 트리 노드 렌더링
  - 펼치기/접기 기능
  - 상태별 아이콘/색상

### 4.4 노드 상세 패널
- [ ] **Task 4.4.1**: `c-node-detail-panel` 컴포넌트 생성
  - Wire: OntologyController.getNodeDetail()
  - 탭: 개요, 근거, 제출자료, 히스토리
  - 상태 변경 버튼
  - 담당자 정보
  - 관련 노드 링크

### 4.5 제출 자료 패널
- [ ] **Task 4.5.1**: `c-submission-document-panel` 컴포넌트 생성
  - Wire: ContentController.getLinkedFiles()
  - 연결된 파일 목록
  - 파일 추가 버튼
  - 파일 제거 기능
  - 필수 여부 표시

---

## Phase 5: Modal Components (모달)

### 5.1 입찰 관리 모달
- [ ] **Task 5.1.1**: `c-new-bid-modal` 컴포넌트 생성
  - Form: 입찰명, 공고번호, 발주처, 마감일, 예상금액, 카테고리
  - Validation
  - Apex: BidController.createBid()
  - Event: success, cancel

### 5.2 노드 관리 모달
- [ ] **Task 5.2.1**: `c-status-change-modal` 컴포넌트 생성
  - 상태 선택 (Radio Group)
  - 변경 사유 입력
  - Apex: OntologyController.updateNodeStatus()
  - Event: success, cancel

- [ ] **Task 5.2.2**: `c-reference-edit-modal` 컴포넌트 생성
  - Rich Text Editor (lightning-input-rich-text)
  - 페이지/조항 정보
  - 저장/취소
  - Event: save, cancel

### 5.3 파일 관리 모달
- [ ] **Task 5.3.1**: `c-file-selector-modal` 컴포넌트 생성
  - Wire: ContentController.getContentDocuments()
  - 파일 라이브러리 목록
  - 검색 기능
  - 다중 선택
  - Apex: ContentController.linkContentToNode()
  - Event: filesselected, cancel

- [ ] **Task 5.3.2**: `c-evidence-upload-modal` 컴포넌트 생성
  - 근거 이름, 버전 입력
  - 파일 업로드 (lightning-file-upload)
  - 참조 정보
  - Apex: EvidenceController.createEvidence()
  - Event: success, cancel

### 5.4 체크리스트 모달
- [ ] **Task 5.4.1**: `c-checklist-modal` 컴포넌트 생성
  - Wire: ChecklistController.getChecklist()
  - 12개 체크리스트 항목
  - 긴급 항목 강조 (빨간색)
  - 체크박스 상태 업데이트
  - 완료율 표시
  - Apex: ChecklistController.updateChecklistItem()
  - Event: close

---

## Phase 6: 추가 기능 및 최적화 (선택사항)

### 6.1 검색 및 필터
- [ ] **Task 6.1.1**: 입찰 목록 고급 검색 기능 구현
- [ ] **Task 6.1.2**: 온톨로지 트리 필터 기능 구현

### 6.2 알림 및 메시징
- [ ] **Task 6.2.1**: Toast 메시지 표준화
- [ ] **Task 6.2.2**: 에러 핸들링 개선

### 6.3 성능 최적화
- [ ] **Task 6.3.1**: Lightning Data Service 활용
- [ ] **Task 6.3.2**: Cacheable Apex 메소드 최적화

### 6.4 권한 및 보안
- [ ] **Task 6.4.1**: Permission Sets 생성
- [ ] **Task 6.4.2**: Sharing Rules 설정

### 6.5 배포 준비
- [ ] **Task 6.5.1**: Change Set 또는 Package 준비
- [ ] **Task 6.5.2**: 배포 가이드 문서 작성

---

## 체크리스트 사용 가이드

### ✅ 작업 완료 시
1. 해당 항목의 `[ ]`를 `[x]`로 변경
2. 커밋 메시지에 작업 번호 포함
   ```bash
   git commit -m "✅ Task 2.1.1: Implement sldsBadge component"
   ```
3. 상단 진행 상황 업데이트

### 📝 작업 중 메모
작업 진행 중 특이사항이나 변경사항은 해당 Task 아래에 추가:
```markdown
- [x] **Task 1.2.1**: Bid__c Object 생성
  - Note: EstimatedAmount__c 필드 Currency(16,2)로 설정
  - Note: Status__c 기본값을 DRAFT로 설정
```

---

**작업 시작일**: 2025-12-01  
**예상 완료일**: TBD  
**마지막 업데이트**: 2025-12-01