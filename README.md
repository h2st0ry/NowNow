# NowNow

NowNow는 사용자의 하루 감정과 컨디션을 캐릭터와의 상호작용, 채팅, 리포트로 자연스럽게 기록하는 React Native iOS 앱입니다.

캐릭터 `뿡뿡이`와 대화하듯 기분을 고르고, 먹이 주기·놀아 주기·음악 듣기·휴식 취하기 같은 가벼운 상호작용을 통해 사용자의 취향과 상태를 기록합니다. 채팅 화면에서는 하루 이야기를 나누고, 리포트 화면에서는 심박수와 혈압 등 건강 지표를 확인할 수 있습니다.

## 주요 기능

- 홈 화면
  - 오늘의 기분 선택
  - 캐릭터 `뿡뿡이`와 상호작용
  - 먹이, 놀이, 음악, 휴식 선택지 랜덤 제공
  - 선택한 상호작용 기록 표시

- 채팅 화면
  - 캐릭터와 감정 일기 형식의 대화
  - 메시지별 시간 표시
  - 요약과 해결책 제안 흐름
  - 채팅 화면에서는 하단 네브바를 숨기고 상단 뒤로가기 제공

- 리포트 화면
  - 심박수 차트
  - 혈압 차트
  - 스트레스 원인 분석
  - 수면 패턴과 AI 추천 카드

- 내 설정 화면
  - 계정 설정
  - 알림 설정
  - 라이트/다크 모드 전환
  - 데이터 백업, 도움말, 스트레스 기준 관리
  - 로그아웃 메뉴

## 기술 스택

- React Native
- TypeScript
- React Navigation 없이 커스텀 하단 네브바 구현
- react-native-safe-area-context
- react-native-gesture-handler
- lucide-react-native
- date-fns

## 프로젝트 구조

```txt
src
 ├─ assets
 │   ├─ images
 │   ├─ icons
 │   └─ fonts
 ├─ components
 ├─ features
 ├─ navigation
 │   ├─ RootNavigator.tsx
 │   └─ TabNavigator.tsx
 ├─ screens
 │   ├─ Home
 │   ├─ Chat
 │   ├─ Report
 │   ├─ Profile
 │   ├─ Community
 │   ├─ Diary
 │   └─ Login
 ├─ services
 ├─ hooks
 ├─ store
 ├─ types
 ├─ constants
 ├─ utils
 └─ theme
```

화면별로 해당 화면에서만 사용하는 컴포넌트, 훅, 상수, 타입은 각 `screens/*` 폴더 내부에 배치했습니다. 여러 화면에서 재사용할 가능성이 높은 코드는 `src/components`, `src/hooks`, `src/theme` 같은 공통 영역으로 분리하는 방향입니다.

## 시작하기

### 1. 의존성 설치

```sh
npm install
```

### 2. iOS Pod 설치

iOS 실행 전 CocoaPods 의존성을 설치해야 합니다.

```sh
cd ios
bundle exec pod install
cd ..
```

### 3. Metro 실행

```sh
npm start
```

캐시 문제로 화면이 이상하게 보이면 아래 명령어로 Metro 캐시를 초기화할 수 있습니다.

```sh
npx react-native start --reset-cache
```

### 4. iOS 실행

```sh
npm run ios
```

## 개발 스크립트

```sh
npm run ios
npm run android
npm run lint
npm test
```

## 개발 메모

- 앱 진입점은 `App.tsx`입니다.
- 화면 전환은 `src/navigation/TabNavigator.tsx`의 커스텀 탭 상태로 관리합니다.
- 채팅 화면은 하단 네브바 없이 전체 화면으로 표시됩니다.
- 라이트/다크 모드는 `src/theme/ThemeProvider.tsx`에서 전역 상태로 관리합니다.
- 홈 화면 캐릭터 이미지는 `src/assets/images/charactor.png`를 사용합니다.

## 참고

이 프로젝트는 React Native CLI 기반으로 생성되었습니다. React Native 개발 환경 설정이 필요하다면 공식 문서를 참고하세요.

- https://reactnative.dev/docs/set-up-your-environment
