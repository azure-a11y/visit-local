# SESSION_HANDOFF

이 문서는 이전 세션의 작업 요약을 현재 실제 코드/Git 상태와 대조 검증한 뒤,
다음 세션이 이어서 작업할 수 있도록 정리한 인수인계 문서입니다.
검토 시점: 2026-07-18.

---

## 1. 프로젝트 목적

- 프로젝트명: visit-local (GitHub 레포 이름은 히스토리상 `visit-cheonan`으로 유지됨 — 실제 원격 저장소 이름/주소는 이번 리네이밍 작업에서 변경하지 않음)
- 유형: 내 지역 관광·명소 소개 정적 랜딩 페이지
- 목적: 방문자에게 내 지역 여행 정보를 빠르게 전달하고 방문 관심을 유도
- 빌드 도구, `package.json`, 번들러, 테스트 러너 없음 — `index.html`을 브라우저로 바로 열어 확인하는 순수 정적 페이지

---

## 2. 현재 구현된 기능 (index.html 기준 실제 확인)

- 상단 sticky 헤더, 스크롤 시 `solid` 상태 전환
- 헤더 JOIN(회원가입) 버튼 — [index.html:737](index.html#L737) `signup-btn`
- 히어로 슬라이드쇼 (교차 페이드, 이전/다음/일시정지, 진행 표시 바)
- 전체 메뉴 오버레이 — 햄버거 버튼으로 열고 닫기, Escape로 닫힘
  - 메뉴 링크 5종: `ShowsUpdates`, `에디터 추천여행`, `반려동물 동반 관광지`, `Discover Local`, `여행정보`
- Quick Site 패널 — [index.html:775](index.html#L775), 외부 관광 링크 모음
- 섹션: 축제/공연/전시(ShowsUpdates), 추천 코스 캐러셀, 반려동물 동반 관광지 카드, 후기 카드(Discover Local), 여행정보 퀵링크
- 스크롤 reveal 애니메이션, 하트 버튼 토글, 날짜/탭 전환 UI, 스크롤 탑 버튼
- `prefers-reduced-motion` 대응 — [index.html:1078](index.html#L1078)

### ⚠️ 다크 모드 상태 (검증 중 발견한 불일치)

- CSS 변수/규칙은 존재: `:root[data-theme="dark"]` — [index.html:66](index.html#L66) 등
- 그러나 **`data-theme` 속성을 실제로 설정하는 JS 코드가 없음** (토글 버튼 없음, `prefers-color-scheme` 자동 감지 코드 없음)
- 과거 커밋 `5f12235 Center hero text on mobile and disable auto dark mode`에서 자동 다크모드를 껐고, 이후 대체 토글 UI가 추가되지 않은 채 남아 있음
- `CHANGELOG.md`의 `[1.0.0]` 항목에는 "다크 모드 토글"이 Added로 기록되어 있으나, 현재 코드에는 **진입 경로가 없는 죽은 CSS 상태**
- → 다음 세션에서 반드시 결정 필요: 토글 UI를 되살릴지, 죽은 CSS를 정리할지

---

## 3. 주요 디자인 결정 (`docs/decisions.md` 근거)

- **단일 HTML 자체 완결형 구조** (2026-07-12 결정)
  - CSS/JS를 분리하지 않고 `index.html`에 인라인 유지
  - 이유: 빌드 도구 없이 파일 하나로 배포·공유 가능, 프로젝트 규모상 분리 이점 없음
  - 검토했으나 기각한 대안: css/js 폴더 분리 (파일 수만 늘어남)
- 이미지: base64 data URI로 내장, 외부 이미지 의존성 최소화
- 외부 의존성 없음 원칙 유지

---

## 4. 수정된 파일과 코드 구조

`org/main` 대비 최신 커밋(`3a4f166`)까지 변경된 파일 (이후 `c625513`, `40c907e` 커밋으로 헤더/배지 스타일 추가 반영됨):

```
visit-local/
├── index.html        # 페이지 전체 (HTML + 인라인 CSS/JS), 헤더 회원가입 버튼 추가 등
├── README.md         # 프로젝트 소개, 실행 방법, 구조, 문서 규칙
├── CLAUDE.md         # 프로젝트 작업 지침 (범위/제외범위/Git 규칙)
├── CHANGELOG.md       # Keep a Changelog 형식 변경 이력
├── .gitignore         # .vercel, .env, .env.* 제외 규칙
└── docs/
    └── decisions.md   # 단일 HTML 구조 채택 등 결정 기록
```

- `.env`, `.vercel/`(project.json, README.txt, .env 포함)은 로컬 전용, `.gitignore`로 추적 제외 확인됨
- 현재 워킹트리는 clean (미커밋 변경 없음)

---

## 5. Git 원격 저장소 구성

- 브랜치: `main`
- 원격 2개
  - `origin` → `https://github.com/azure-a11y/visit-cheonan.git`
  - `org` → `https://github.com/AI-BuilderSchool/visit-cheonan.git`
- 현재 상태 (2026-07-18 재확인)
  - `origin/main`, `org/main`, 로컬 `main`이 모두 `40c907e`로 **완전히 동기화**됨 (이전에 기록된 `org/main` 1커밋 지연은 이후 세션에서 해소됨)
  - 리네이밍 작업(`CHANGELOG.md`/`CLAUDE.md`/`README.md`/`index.html`/`SESSION_HANDOFF.md`)은 아직 **미커밋** 상태
- `CLAUDE.md`의 Git 작업 규칙: "커밋해줘"→로컬 1회 커밋, "푸시해줘"→`origin main`과 `org main` 모두 푸시, 강제 푸시 금지, remote 설정 임의 변경 금지

---

## 6. 해결한 오류

1. PowerShell에서 `cd /d ...` 문법 미지원 → `Set-Location "경로"` 또는 `cd "경로"`로 대체
2. 작업 디렉터리 위치 오류로 Git repo 미인식 → 정확한 프로젝트 경로에서 재실행 후 해결
3. `index.html` 정적 구조 오류 검사 → 오류 없음 확인

---

## 7. 남은 작업

- **다크 모드 처리 방향 결정** (최우선, 4번 항목 참고) — 이번 리네이밍 작업에서는 다크모드 CSS/기능을 의도적으로 건드리지 않음
- 메뉴/퀵링크 일부 CTA가 플레이스홀더 상태 — 실제 목적지 연결 필요 여부는 콘텐츠 검토 필요 (이번 세션에서 코드 레벨 확인은 하지 않음)
- 축제·행사 일정 등 콘텐츠 데이터의 실운영 데이터 동기화 여부 확인 필요
- 모바일 실기기/브라우저 비주얼 QA (여백, 버튼 영역)
- ~~`org` 리모트 동기화 (1커밋 격차 해소)~~ — 완료 확인됨 (`origin`/`org`/로컬 모두 `40c907e`)
- "천안 → 내 지역/visit-local" 리네이밍 작업분(`CHANGELOG.md`/`CLAUDE.md`/`README.md`/`index.html`/`SESSION_HANDOFF.md`) 커밋·푸시 필요

---

## 8. 다음 작업 우선순위

1. 다크 모드: 토글 버튼 추가 vs 죽은 CSS 정리 — 결정 후 반영
2. 리네이밍 작업분 커밋 및 `origin main`/`org main` 푸시 여부 확인
3. 남은 CTA/실데이터 플레이스홀더 콘텐츠 점검

---

## 9. 향후 커밋 및 푸시 규칙 (CLAUDE.md 기준)

- "커밋해줘" → 현재 변경사항을 로컬 저장소에 **한 번만** 커밋
- "푸시해줘" → `origin main`과 `org main`에 **모두** 푸시
- "커밋하고 푸시해줘" → 먼저 커밋 후, `origin main`·`org main` 순으로 모두 푸시
- 강제 푸시 금지
- remote 주소나 브랜치 추적 설정 임의 변경 금지
- 다른 프로젝트 저장소는 건드리지 않음
- 대형 `index.html` 수정 시 전체 재작성보다 타깃 문자열 교체 우선
- `:root[data-theme="dark"]` 토글 구조와 기존 테마 토큰은 임의로 제거하지 않고, 변경 시 반드시 사전 논의
