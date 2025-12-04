[UI/UX 변환 가이드 전체 내용은 로컬 파일 참조]

# UI/UX 변환 가이드: React → Salesforce LWC

React + Tailwind CSS 프로토타입의 UI/UX를 Salesforce LWC로 **최대한 동일하게** 구현하기 위한 실전 가이드입니다.

## 주요 내용

1. **전략 개요**: 스크린샷 기준 개발, CSS 우선 추출
2. **스타일 추출**: Chrome DevTools Computed Style 활용
3. **Tailwind → CSS 변환표**: 상세 매핑 테이블
4. **SLDS 조합 전략**: 80% SLDS + 20% Custom CSS
5. **레이아웃 구조 유지**: Flexbox/Grid 구조 보존
6. **실전 변환 예시**: 뱃지, 2-패널, 모달
7. **문제 해결**: 흔한 이슈 & 해결책
8. **픽셀 단위 검증**: 오버레이 비교 방법

## 변환 프로세스

```
React 원본
    ↓
1. 스크린샷 캡처 (모든 상태/인터랙션)
    ↓
2. Computed Style 추출 (Chrome DevTools)
    ↓
3. 핵심 CSS 정리
    ↓
4. SLDS 매핑 + 커스텀 CSS 작성
    ↓
5. LWC 구현
    ↓
6. 픽셀 단위 비교 검증
```

## Tailwind → CSS 변환표 예시

| Tailwind | CSS | SLDS |
|----------|-----|------|
| `flex` | `display: flex` | `.slds-grid` |
| `gap-4` | `gap: 1rem` | `.slds-gutters` |
| `rounded-lg` | `border-radius: 0.5rem` | Custom |
| `shadow-md` | `box-shadow: ...` | `.slds-box` |

## 체크리스트

- [ ] 레이아웃 구조 동일
- [ ] 간격 5px 이내 일치
- [ ] 색상 정확히 일치
- [ ] 폰트 크기/두께 일치
- [ ] 호버/포커스 효과 동일
- [ ] 반응형 breakpoint 동일

**전체 내용은 로컬 `/Docs/UI_UX_CONVERSION_GUIDE.md` 파일을 참조하세요.**