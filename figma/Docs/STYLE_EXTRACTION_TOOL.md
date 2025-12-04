[Style Extraction Tool 전체 코드는 로컬 파일 참조]

# 스타일 추출 도구 가이드

React 프로토타입에서 스타일을 자동으로 추출하여 LWC CSS로 변환하는 도구입니다.

## 도구 목록

1. **Computed Style 추출기**: 선택한 요소의 모든 스타일 추출
2. **색상 팔레트 추출기**: 페이지의 모든 색상 추출
3. **레이아웃 구조 추출기**: DOM 구조를 트리 형태로 시각화
4. **간격 분석기**: padding, margin, gap 측정
5. **일괄 추출기**: 여러 컴포넌트를 한 번에 추출

## 사용법

### 1. React 프로토타입에서 브라우저 열기

```bash
npm run dev
```

### 2. 브라우저 콘솔에서 스크립트 실행

```javascript
// 로컬 파일의 전체 코드를 콘솔에 붙여넣기

// 사용 예시:
extractStyles('.bid-list-page');
extractColorPalette();
extractLayoutStructure('.bid-detail-page', 3);
analyzeSpacing('.header-section');
```

### 3. 결과 확인

- CSS가 클립보드에 자동 복사됨
- LWC .css 파일에 붙여넣기

## 추출 결과 예시

```css
/* 자동 생성된 CSS */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #dbeafe;
  color: #1e40af;
}
```

## 기능

### ✅ 스타일 추출
- Layout (display, flex, grid)
- Box Model (width, height, padding, margin)
- Typography (font-size, font-weight, color)
- Background & Border
- Visual Effects (shadow, opacity)

### ✅ 색상 추출
- RGB → HEX 변환
- CSS Variables 자동 생성
- 중복 제거

### ✅ 구조 분석
- DOM 트리 시각화
- HTML 구조 생성
- 요소 크기 표시

### ✅ 간격 측정
- Padding/Margin 측정
- Gap 분석
- 시각화 오버레이

**전체 코드는 로컬 `/Docs/STYLE_EXTRACTION_TOOL.md` 파일을 참조하세요.**