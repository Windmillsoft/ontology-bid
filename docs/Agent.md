# Figma 디자인을 Salesforce SLDS 2로 변환하는 상세 가이드

## 1. 배경과 목표

Figma 사이트 디자인은 React 기반 UI, 모듈형 카드/표/모달/체크리스트/파일 업로드 등 풍부한 인터랙티브 요소로 구성되어 있다. Salesforce Lightning Design System 2(SLDS 2)는 Cosmos 테마와 글로벌 스타일링 훅(Global Styling Hooks) 위에 구축된 새로운 CSS 프레임워크로, 기본 컴포넌트(Base Components) 사용과 접근성·일관성을 강조한다. 디자인 시스템을 맞추기 위해 다음을 목표로 한다.

- Figma에서 정의한 버튼, 모달, 테이블 등 UI 요소를 Salesforce LWC로 옮기되 SLDS 2의 권장 방식(기본 컴포넌트+스타일링 훅)을 적용.
- 하드코딩된 색상·여백을 SLDS 2의 글로벌 훅으로 변환하여 테마 변경 시 자동으로 반영되도록 한다 [trailhead.salesforce.com](https://trailhead.salesforce.com).
- 접근성, 반응성, 유지보수성을 유지하며, SLDS 2의 권장 도구(SLDS Validator)와 원칙을 준수한다 [absyz.com](https://absyz.com).

---

## 2. SLDS 2 이해하기

### 2.1 글로벌 스타일링 훅과 디자인 토큰

- SLDS 2는 SLDS 1에서 사용하던 디자인 토큰 대신 **글로벌 스타일링 훅(CSS Custom Properties)**을 도입하여 테마 값을 노출한다 [developer.salesforce.com](https://developer.salesforce.com).
- 훅은 `--slds-g-color-surface-container-1`, `--slds-g-radius-border-4`처럼 명명되며 색상, 경계, 간격, 타이포그래피 등 디자인 값에 대응한다 [trailhead.salesforce.com](https://trailhead.salesforce.com).
- Figma 파일에서 변수(Colors, Radius, Spacing)로 정의된 값은 Cosmos 테마의 글로벌 훅 이름과 맵핑되어 있으므로, 디자인 사양을 손쉽게 LWC에 반영할 수 있다 [trailhead.salesforce.com](https://trailhead.salesforce.com).
- 기존 디자인 토큰(`--lwc-colorBackground`)은 SLDS 2에서 더 이상 권장되지 않으며, 호환성을 위해서만 유지된다 [developer.salesforce.com](https://developer.salesforce.com).

### 2.2 기본 컴포넌트(Base Components)

- SLDS 2는 `lightning-button`, `lightning-input`, `lightning-datatable` 같은 기본 컴포넌트를 제공한다. 이들은 SLDS 스타일과 접근성을 내장하여 별도 CSS 없이 높은 품질의 UI를 구현한다 [apexhours.com](https://apexhours.com).
- SLDS 2에서는 내부 구조와 테마가 분리되어 있어, 디자인 커스터마이징을 위해 클래스를 오버라이드하기보다 전용 속성(`variant`, `label`, `iconName`)과 글로벌 훅을 사용해야 한다 [absyz.com](https://absyz.com).

### 2.3 SLDS Validator

- SLDS Validator는 LWC 코드에서 SLDS 패턴을 준수하는지 검사하여 일���성, 접근성, 미래 호환성을 확보한다 [absyz.com](https://absyz.com).
- 변환 과정에서 `npx slds-validator`로 컴포넌트를 검증하면 스타일링 훅 사용, aria 레이블, 레이아웃 지정 등이 규정에 맞는지 확인할 수 있다.

---

## 3. Figma 디자인 분석 및 요소 매핑

Figma 사이트는 입찰 관리 대시보드로, 다음과 같은 요소를 포함한다. 각 요소별로 SLDS 2 기본 컴포넌트에 매핑하고 필요 시 확장한다.

### 3.0 Figma → SLDS 2 컴포넌트 매핑 표

아래 표는 Figma 디자인에서 사용한 주요 UI 요소를 Salesforce Lightning Design System 2(SLDS 2)의 기본 컴포넌트(Base Components)로 매핑한 것입니다. 표 안의 설명은 간단한 키워드로 요약했으며, 각 기능의 근거는 Salesforce 공식 자료와 개발자 가이드에 기반합니다.

| Figma 요소 (간단히) | 추천 SLDS 기본 컴포넌트 | 기능/용도 (요약) |
|---------------------|------------------------|------------------|
| **카드, 리스트 아이템**<br/>(프로젝트명/상태/금액 등 표시) | `lightning-card`<br/>`lightning-badge`<br/>`lightning-button`<br/>`lightning-icon` (필요 시) | `lightning-card`는 헤더·본문·푸터 구조를 갖춘 카드 레이아웃을 제공한다 [apexhours.com](https://apexhours.com). `lightning-badge`는 상태나 태그를 작은 레이블로 표시하는 데 사용되고 [apexhours.com](https://apexhours.com), `lightning-button`은 브랜드/중립/위험 등 여러 변형을 지원해 액션 버튼을 구현할 수 있다 [apexhours.com](https://apexhours.com). |
| **입찰 목록 / 테이블** | `lightning-datatable` | 내장 정렬, 페이지네이션, 필터링, 인라인 편집과 행 선택 기능을 갖춘 표 컴포넌트로, 구조화된 레코드 표시에 적합하다 [apexhours.com](https://apexhours.com). |
| **입력 필드**<br/>(텍스트·숫자·날짜 등) | `lightning-input`<br/>`lightning-textarea`<br/>`lightning-combobox`<br/>`lightning-datepicker` | `lightning-input`은 다양한 유형의 입력을 지원하고 built-in 검증·접근성을 제공한다 [apexhours.com](https://apexhours.com). `lightning-textarea`는 여러 줄 텍스트 입력용이다 [apexhours.com](https://apexhours.com). `lightning-combobox`는 옵션 목록에서 단일 선택을 제공한다 [apexhours.com](https://apexhours.com). 날짜 선택은 `lightning-input`에 `type="date"`를 사용하거나 별도의 `lightning-datepicker` 컴포넌트를 활용한다. |
| **모달 / 팝업** | `LightningModal` | Winter '23 이후 도입된 모달 기본 컴포넌트. 모달은 앱 위에 레이어로 나타나며 메인 콘텐츠와 상호작용을 잠시 차단한다 [developer.salesforce.com](https://developer.salesforce.com). `LightningModal`은 SLDS 블루프린트를 기반으로 헤더·본문·푸터를 손쉽게 정의하고 `.open()` 메서드로 실행한다 [developer.salesforce.com](https://developer.salesforce.com). |
| **체크리스트**<br/>(여러 항목 체크) | `lightning-checkbox-group` | 여러 옵션을 한 그룹에서 선택하도록 하며, `required` 속성을 지정하면 최소 한 개를 선택하지 않으면 오류 메시지를 표시한다 [w3web.net](https://w3web.net). 커스텀 오류 문구는 `message-when-value-missing` 속성으로 지정할 수 있다. |
| **파일 업로드**<br/>(견적서 등 첨부) | `lightning-file-upload`<br/>(LWC + Apex 컨트롤러) | 사용자가 레코드 컨텍스트에서 여러 파일을 선택·업로드하고 진행 상태를 볼 수 있게 한다. 구현 시 사용자는 특정 레코드 페이지에 있어야 하며, 즉시 미리보기를 제공하고 파일 크기/형식 제한, 권한 검사를 해야 한다 [apexhours.com](https://apexhours.com). 서버 측에서는 Apex에서 `ContentVersion`을 생성하고 `ContentDocumentLink`로 레코드에 연결한다 [apexhours.com](https://apexhours.com). |
| **알림/토스트** | `ShowToastEvent`<br/>(이벤트) | `lightning/platformShowToastEvent`에서 가져오는 `ShowToastEvent`는 성공, 오류, 경고 메시지를 3초 동안 화면 상단에 표시하며 사용자가 클릭하면 닫을 수 있다 [pashtek.com](https://pashtek.com). `variant` 속성으로 색상을 지정해 정보를 전달한다 [pashtek.com](https://pashtek.com). |

### 3.1 카드/리스트(대시보드 메인)

**Figma 요소**: 카드에는 프로젝트명, 상태, 담당자, 마감일, 금액 등이 표시되며 색상 배지와 버튼이 포함된다.

**SLDS 구성**:

- `lightning-card`를 사용하여 카드 형태를 구현한다. 카드 헤더에는 `title` 속성 또는 별도 slot에 프로젝트명을 넣는다.
- 각 항목을 SLDS List/Grid 구조로 정렬하여 반응형 레이아웃을 구현한다. `slds-grid slds-wrap` 클래스를 적용하면 카드가 여러 행으로 배치된다.
- 상태 배지는 `lightning-badge` 또는 `lightning-pill` 컴포넌트로 표시한다. `variant` 속성을 이용해 색상을 변경하거나 글로벌 훅 `--slds-g-color-badge-success` 등으로 커스터마이징할 수 있다.
- 카드 내부 액션 버튼은 `lightning-button`으로 구현하고, `variant="brand"`, `icon-position` 등으로 스타��을 지정한다 [apexhours.com](https://apexhours.com).

**예시 코드**:

```html
<lightning-card title="{projectName}" icon-name="standard:opportunity">
  <div class="slds-m-horizontal_small slds-m-bottom_x-small">
    <lightning-badge label={statusLabel} class="slds-m-right_x-small"></lightning-badge>
    <lightning-formatted-date-time value={dueDate} year="numeric" month="2-digit" day="2-digit"></lightning-formatted-date-time>
  </div>
  <p>{projectDescription}</p>
  <div slot="footer" class="slds-align_absolute-center">
    <lightning-button label="보기" variant="neutral" onclick={handleView}></lightning-button>
    <lightning-button label="편집" variant="brand" class="slds-m-left_x-small" onclick={handleEdit}></lightning-button>
  </div>
</lightning-card>
```

### 3.2 데이터 표/리스트

**Figma 요소**: 입찰 목록을 표 형태로 보여주며 정렬, 선택, 필터 기능이 있음.

**SLDS 구성**:

- `lightning-datatable`을 사용하면 정렬, 인라인 편집, 행 선택, 페이지네이션을 지원한다 [sfdcscout.com](https://sfdcscout.com).
- 열 정의에서 `sortable: true`로 정렬 가능, `editable: true`로 인라인 편집을 활성화 [sfdcscout.com](https://sfdcscout.com).
- Apex 또는 Lightning Data Service를 통해 레코드를 불러오고 `key-field="Id"`로 식별자를 지정한다 [sfdcscout.com](https://sfdcscout.com).
- 표 디자인에 맞춰 row-level actions를 추가하려면 `type: 'action'` 열을 정의하고, `actions` 배열에 보기/편집/삭제 메뉴를 넣는다.
- 표 헤더와 셀 스타일은 글로벌 훅(`--slds-g-table-row-hover-bg-color`, `--slds-g-color-border-subtle`)으로 맞춤 조정할 수 있다.

**예시 코드**:

```html
<lightning-datatable
  data={bids}
  columns={columns}
  key-field="Id"
  onrowselection={handleSelection}
  onsort={handleSort}
  hide-checkbox-column={false}>
</lightning-datatable>
```

```javascript
// JavaScript: 열 정의 예시
columns = [
  { label: '프로젝트명', fieldName: 'Name', sortable: true },
  { label: '상태', fieldName: 'Status__c', type: 'badge' },
  { label: '금액', fieldName: 'Amount__c', type: 'currency', editable: true },
  { type: 'action', typeAttributes: { rowActions: this.getRowActions } }
];
```

### 3.3 폼 입력 및 레코드 생성/수정

**Figma 요소**: 새 입찰 추가 또는 편집 모달에서 다양한 입력 필드(텍스트, 날짜, 선택 목록, 숫자)를 사용.

**SLDS 구성**:

- `lightning-input`(텍스트, 숫자), `lightning-textarea`(설명), `lightning-combobox`(선택 목록), `lightning-datepicker`를 사용. 이들은 기본적으로 레이블, 도움말, 검증 메시지를 제공하고, `variant="label-hidden"`을 통해 라벨 숨김도 가능하다 [apexhours.com](https://apexhours.com).
- 외부 데이터 소스가 필요한 선택 목록은 Apex `@wire`를 통해 picklist 값을 가져오고, `options` 속성에 전달한다.
- 필수 필드는 `required` 속성을 부여하며, 커스텀 에러 메시지는 `message-when-value-missing` 속성으로 지정할 수 있다.
- 일정 간격 및 여백은 `slds-p-around_medium`, `slds-m-bottom_small` 등의 SLDS 유틸리티 클래스를 사용하거나 글로벌 훅에 의존한다.

### 3.4 모달

**Figma 요소**: 작업 생성/수정/확인용 모달; 화면 중앙에 띄워지고 바깥 클릭 또는 취소 버튼으로 닫힘.

**SLDS 구성**:

- `LightningModal` 베이스 컴포넌트를 확장한다. 이 컴포넌트는 SLDS 모달 블루프린트를 준수하며, `.open()` 메서드로 쉽게 호출된다 [developer.salesforce.com](https://developer.salesforce.com).
- 모달 컴포넌트는 `extends LightningModal`로 정의하고, `title` 속성으로 헤더를 설정한다.
- 모달 본문에는 위 입력 컴포넌트들을 배치하고, 푸터에 `lightning-button`으로 저장/취소 버튼을 배치한다.
- 닫기 이벤트는 `this.close('success')`처럼 호출하고, 호출자는 반환 값을 통해 처리한다 [developer.salesforce.com](https://developer.salesforce.com).
- 접근성 측면에서 모달 호출 시 `aria-label`과 포커스 관리를 설정해야 한다 [developer.salesforce.com](https://developer.salesforce.com).

**예시 코드**:

```javascript
// modalCreateBid.js
import { LightningModal } from 'lightning/modal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ModalCreateBid extends LightningModal {
  handleSave() {
    // validate & call Apex
    // ...
    this.dispatchEvent(new ShowToastEvent({ 
      title: '성공', 
      message: '입찰이 생성되었습니다', 
      variant: 'success' 
    }));
    this.close('success');
  }
}
```

```html
<template>
  <header class="slds-modal__header">
    <h2 class="slds-modal__title">입찰 생성</h2>
  </header>
  <div class="slds-modal__content slds-p-around_medium">
    <lightning-input label="프로젝트명" value={name} onchange={handleChange}></lightning-input>
    <!-- 기타 필드 -->
  </div>
  <footer class="slds-modal__footer">
    <lightning-button label="취소" onclick={close}></lightning-button>
    <lightning-button label="저장" variant="brand" onclick={handleSave}></lightning-button>
  </footer>
</template>
```

### 3.5 체크리스트

**Figma 요소**: 프로젝트 단계별 진행 상황을 체크박스로 표시.

**SLDS 구성**:

- `lightning-checkbox-group`은 여러 옵션을 표시하고 하나 혹은 복수 선택을 허용한다. `required` 속성을 지정하면 사용자가 항목을 하나 이상 선택하지 않을 때 오류 메시지가 표시된다 [w3web.net](https://w3web.net).
- 체크 결과를 레코드에 저장하려면 `onchange`에서 선택된 값 배열을 취합하여 Apex나 Lightning Data Service로 전달한다.

**예시 코드**:

```html
<lightning-checkbox-group 
  name="checklist"
  label="체크리스트"
  options={checkboxOptions}
  value={selectedItems}
  required
  message-when-value-missing="하나 이상의 항목을 선택하세요"
  onchange={handleChecklistChange}>
</lightning-checkbox-group>
```

### 3.6 파일 업로드

**Figma 요소**: 견적서 등 파일을 업로드하고 미리보기, 진행 상황 표시.

**SLDS 구성**:

- `lightning-file-upload` 컴포넌트는 파일 선택과 업로드 진행 막대를 제공하며, 업로드된 파일을 자동으로 레코드와 연결한다 [apexhours.com](https://apexhours.com).
- 레코드 컨텍스트에서 사용해야 하므로, LWC가 레코드 페이지에서 동작하거나 `record-id` 속성을 전달해야 한다.
- 커스텀 파일 미리보기를 구현하려면 파일 선택 후 JavaScript에서 `FileReader`로 이미지를 읽어 `<img>` 태그에 바인딩한다; Apex에서는 `ContentVersion`을 생성하고 `ContentDocumentLink`로 레코드에 연결한다 [apexhours.com](https://apexhours.com).
- 업로드 버튼은 `disabled` 속성으로 파일이 선택되지 않으면 비활성화하여 사용자 경험을 개선한다.

### 3.7 알림/Toast

**Figma 요소**: 저장/삭제 등 작업 시 상단에 메시지 표시.

**SLDS 구성**:

- `ShowToastEvent`를 dispatch하여 성공·오류·경고 메시지를 표시한다 [pashtek.com](https://pashtek.com).
- `variant` 속성을 `success`, `error`, `warning` 등으로 지정하면 SLDS 2 테마 색상을 사용한다. 토스트는 기본적으로 3초간 표시되며, 필요 시 `mode: 'sticky'`로 지속 시간을 조정할 수 있다.

**예시 코드**:

```javascript
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
...
this.dispatchEvent(
  new ShowToastEvent({
    title: '파일 업로드 완료',
    message: `${fileName}이(가) 성공적으로 업로드되었습니다`,
    variant: 'success'
  })
);
```

---

## 4. 스타일 변환 전략

### 4.1 Figma 스타일 변수를 SLDS 2 훅으로 매핑

- Figma에는 색상 팔레트와 간격을 변수로 정의할 수 있다. SLDS 2에서는 Cosmos 테마의 글로벌 훅을 통해 동일한 값에 접근한다 [trailhead.salesforce.com](https://trailhead.salesforce.com).
- 예를 들어 Figma에서 배경 색상을 `#F5F5F5`로 지정했다면, LWC에서는 `background-color: var(--slds-g-color-surface-container-1);`을 사용하여 테마에 맞는 회색 배경을 적용한다. 사용자 지정 색상이 필요하면 컴포넌트의 shadow DOM에 사용자 정의 CSS 변수를 선언하고, CSS variables cascade를 활용한다.
- 라운드 모서리(border-radius)도 `var(--slds-g-radius-border-2)` 등으로 지정해 전체 앱에서 일관성 있게 관리한다.
- Figma의 spacing 시스템(8px, 16px 등)은 SLDS 유틸리티 클래스(`slds-m-around_small`, `slds-p-horizontal_medium`) 또는 훅 `--slds-g-spacing-large` 등으로 매핑한다.

### 4.2 커스텀 CSS 적용 시 주의사항

- **코어 SLDS 클래스를 재정의하지 않는다**. 예를 들어 `.slds-button_brand` 클래스를 직접 오버라이드하면 향후 업데이트에서 예상치 못한 사이드 효과가 발생할 수 있으므로, 커스텀 스타일은 별도의 클래스(예: `.my-card`)에 작성한다 [absyz.com](https://absyz.com).
- Shadow DOM을 사용하는 LWC 컴포넌트에서는 스타일링 훅과 `:host` 선택자를 활용해 내부 요소를 스타일링한다. 예: `:host { --slds-g-color-brand-base-40: #ff8800; }`.
- SLDS Validator를 사용하여 커스텀 CSS가 SLDS 가이드라인을 위반하지 않는지 확인한다 [absyz.com](https://absyz.com).

### 4.3 테마 및 다크모드 대응

- SLDS 2는 Salesforce Cosmos 테마를 기본값으로 제공하며, 향후 다크모드 등 다른 테마가 추가될 예정이다. 글로벌 훅을 사용하면 테마 변경 시 자동으로 색상이 업데이트된다 [absyz.com](https://absyz.com).
- 따라서 Figma 디자인에서 특정 색상을 강제로 지정하는 대신 가능한 한 글로벌 훅에 의존해야 하며, 필요하면 Figma 변수를 훅 이름으로 매핑하여 디자이너와 개발자 간 일관성을 확보한다.

---

## 5. 변환 절차 정리

1. **Figma 디자인 분석**: 디자인 페이지를 분해해 주요 레이아웃(헤더/사이드바/카드/표/모달 등)을 파악하고, 색상·간격·타이포그래피를 변수로 정리한다.

2. **SLDS 컴포넌트 매핑**: 각 디자인 요소를 위 섹션에 따라 `lightning-card`, `lightning-datatable`, `LightningModal` 등 적절한 SLDS 2 컴포넌트로 매핑한다.

3. **글로벌 스타일링 훅 대응**: Figma 변수와 SLDS 글로벌 훅을 연결하여 CSS 커스텀 속성 및 유틸리티 클래스로 간격/색상/모서리 등을 설정한다 [trailhead.salesforce.com](https://trailhead.salesforce.com).

4. **LWC 작성**: 매핑된 컴포넌트와 훅을 사용하여 LWC 파일을 작성한다. JS 파일에서 Apex 호출, 이벤트 처리, Toast 등을 구현한다.

5. **검증 및 테스트**: SLDS Validator를 실행하여 가이드라인 준수 여부를 확인하고, 크로스 브라우저 테스트 및 접근성 테스트를 수행한다 [absyz.com](https://absyz.com).

6. **피드백 및 반복**: 디자이너와 협업하여 구현 결과를 Figma와 비교하고, 색상/간격이 정확히 매칭되는지 검토한 후, 글로벌 훅 조정 또는 Figma 변수 업데이트를 반복한다.

---

## 6. 결론

Figma 사이트 디자인을 Salesforce SLDS 2로 변환할 때 핵심은 **기본 컴포넌트 사용과 글로벌 스타일링 훅 활용**이다. SLDS 2는 테마와 구조를 분리하여 커스터마이징을 유연하게 할 수 있으며, 훅을 통해 색상·간격을 중앙 집중식으로 관리한다 [trailhead.salesforce.com](https://trailhead.salesforce.com).

데이터 표, 모달, 체크리스트, 파일 업로드, 토스트 알림 등 대부분의 Figma 요소는 SLDS 기본 컴포넌트로 직접 매핑할 수 있고, 필요 시 확장과 커스텀 CSS를 적용할 수 있다. 변환 과정에서 SLDS Validator를 활용하여 일관성과 접근성을 유지하고, Figma 변수와 SLDS 훅 이름을 공유하여 **디자이너와 개발자가 같은 언어로 협업**하는 것이 중요하다.

이렇게 하면 Figma 디자인을 Salesforce 환경에 맞는 일관된, 유지보수 가능한 사용자 경험으로 자연스럽게 이전할 수 있다.

---

## 7. 참고 자료

- [Salesforce SLDS 2 Documentation](https://developer.salesforce.com)
- [Trailhead: SLDS Global Styling Hooks](https://trailhead.salesforce.com)
- [SLDS Validator Guide](https://absyz.com)
- [Lightning Web Components Guide](https://apexhours.com)
- [SLDS Component Library](https://sfdcscout.com)

---

**작성일**: 2024-12-01  
**버전**: 1.0  
**대상**: HD Electric North America CRM 프로젝트