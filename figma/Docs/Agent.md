# Salesforce LWC 재구현 에이전트 가이드

## 목적

이 문서는 Figma Make로 제작된 React 프로토타입을 Salesforce Lightning Web Components (LWC)로 재구현하는 작업을 수행하는 AI 에이전트를 위한 가이드입니다.

## 작업 원칙

### 1. 점진적 개발 (Incremental Development)

- **하나씩 완료**: 한 번에 하나의 작업만 수행합니다
- **완료 후 체크**: 작업이 완료되면 `IMPLEMENTATION_TASKS.md`에서 해당 항목을 체크 표시합니다
- **의존성 우선**: 다른 컴포넌트에서 사용되는 기본 컴포넌트를 먼저 구현합니다
- **테스트 후 진행**: 각 컴포넌트 완성 후 기능 확인 후 다음 단계로 진행합니다

### 2. SLDS 준수 (SLDS Compliance)

- **네이티브 우선**: 가능한 한 `lightning-*` 네이티브 컴포넌트를 사용합니다
- **표준 클래스**: SLDS CSS 클래스를 사용합니다 (`slds-*`)
- **디자인 토큰**: SLDS 색상 토큰을 준수합니다
  - Primary: `#0176d3`
  - Success: `#2e844a`
  - Warning: `#fe9339`
  - Error: `#ea001e`

### 3. Salesforce 표준 준수

#### Object 구조
- **표준 객체 활용**: 가능한 한 Salesforce 표준 객체를 활용합니다
- **Custom Object 명명**: `Bid__c`, `OntologyNode__c` 등 표준 명명 규칙을 따릅니다
- **관계 설정**: Lookup/Master-Detail 관계를 명확히 정의합니다

#### 파일 관리
- **ContentDocument**: 파일 저장에 사용
- **ContentDocumentLink**: 레코드와 파일 연결
- **ContentVersion**: 파일 버전 관리

#### 보안
- **Field-Level Security**: 필드 레벨 보안 고려
- **Sharing Rules**: 공유 규칙 고려
- **Profile Permissions**: 프로파일별 권한 고려

### 4. 코드 품질

#### LWC 컴포넌트
```javascript
// 표준 구조
import { LightningElement, api, track, wire } from 'lwc';

export default class ComponentName extends LightningElement {
    // @api - Public properties
    @api recordId;
    
    // @track - Reactive private properties
    @track data = [];
    
    // @wire - Wire adapters
    @wire(getRecord, { recordId: '$recordId' })
    wiredRecord;
    
    // Lifecycle hooks
    connectedCallback() {}
    renderedCallback() {}
    
    // Event handlers
    handleClick(event) {}
}
```

#### Apex Controller
```java
public with sharing class BidController {
    @AuraEnabled(cacheable=true)
    public static List<Bid__c> getBids() {
        return [SELECT Id, Name FROM Bid__c LIMIT 100];
    }
    
    @AuraEnabled
    public static void updateBid(Id bidId, String status) {
        // Implementation
    }
}
```

### 5. 에러 처리

- **Try-Catch**: 모든 Apex 호출에 에러 처리 추가
- **사용자 메시지**: 에러 발생 시 명확한 메시지 표시
- **로깅**: 중요한 에러는 로깅 처리

```javascript
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

handleError(error) {
    this.dispatchEvent(
        new ShowToastEvent({
            title: '오류',
            message: error.body.message,
            variant: 'error'
        })
    );
}
```

## 작업 프로세스

### Step 1: 작업 목록 확인
`Docs/IMPLEMENTATION_TASKS.md` 파일을 열어 다음 작업 항목을 확인합니다.

### Step 2: 작업 수행
선택한 작업 항목을 완료합니다.

### Step 3: 체크 표시
작업이 완료되면 해당 항목의 체크박스를 업데이트합니다:
```markdown
- [ ] 작업 항목  →  - [x] 작업 항목
```

### Step 4: 커밋
변경사항을 커밋하고 명확한 커밋 메시지를 작성합니다:
```bash
git add .
git commit -m "✅ Implement BidListPage LWC component"
git push
```

### Step 5: 다음 작업
다음 우선순위 작업으로 이동합니다.

## 컴포넌트 변환 가이드

### React → LWC 매핑

| React | LWC |
|-------|-----|
| `useState` | `@track` |
| `useEffect` | `connectedCallback()` |
| `props` | `@api` |
| `onClick` | `onclick` |
| `className` | `class` |
| `{condition && <div>}` | `<template if:true={condition}>` |
| `map()` | `<template for:each>` |

### 스타일 변환

#### React + Tailwind
```jsx
<div className="flex items-center gap-4 p-4 bg-blue-50">
```

#### LWC + SLDS
```html
<div class="slds-grid slds-grid_align-center slds-gutters slds-p-around_medium slds-theme_shade">
```

### 이벤트 처리

#### React
```jsx
<button onClick={handleClick}>클릭</button>
```

#### LWC
```html
<lightning-button label="클릭" onclick={handleClick}></lightning-button>
```

## 데이터 구조 설계

### Custom Objects

#### Bid__c (입찰)
```
- Name (Text)
- NoticeNo__c (Text)
- Client__c (Text)
- Status__c (Picklist: DRAFT, IN_PREPARATION, REVIEW, SUBMITTED, AWARDED, LOST)
- Deadline__c (DateTime)
- EstimatedAmount__c (Currency)
- Owner__c (Lookup: User)
- Progress__c (Percent)
- ChecklistProgress__c (Percent)
```

#### OntologyNode__c (온톨로지 노드)
```
- Name (Text)
- Bid__c (Master-Detail: Bid__c)
- ParentNode__c (Lookup: OntologyNode__c)
- Status__c (Picklist: NOT_STARTED, IN_PROGRESS, BLOCKED, RISK, SATISFIED)
- Required__c (Checkbox)
- Owner__c (Lookup: User)
- Reviewer__c (Lookup: User)
- Weight__c (Number)
- LicenseType__c (Text)
```

#### NodeEvidence__c (노드 근거)
```
- Node__c (Master-Detail: OntologyNode__c)
- Name (Text)
- Version__c (Text)
- ContentDocumentId__c (Text)
- Reference__c (Text)
```

#### ChecklistItem__c (체크리스트)
```
- Bid__c (Master-Detail: Bid__c)
- Label__c (Text)
- Description__c (Long Text)
- Checked__c (Checkbox)
- CheckedBy__c (Lookup: User)
- CheckedAt__c (DateTime)
- Category__c (Picklist)
```

## 참고 리소스

### Salesforce 문서
- [LWC Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
- [SLDS Component Blueprints](https://www.lightningdesignsystem.com/components/overview/)
- [Apex Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/)

### 프로젝트 원본
- `figma/` 폴더의 React 컴포넌트들
- `types/ontology.ts` - TypeScript 타입 정의
- `data/mockData.ts` - 샘플 데이터 구조

## 중요 알림

⚠️ **각 작업 완료 시 반드시 `IMPLEMENTATION_TASKS.md`를 업데이트하세요!**

✅ 이를 통해 진행 상황을 추적하고 중복 작업을 방지할 수 있습니다.

---

**Last Updated**: 2025-12-01  
**Version**: 1.0