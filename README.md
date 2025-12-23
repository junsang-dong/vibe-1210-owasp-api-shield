# 🔒 API Shield Nova

OWASP API Security Top 10 기반으로 API 스펙을 분석하여 취약점을 자동 탐지하고, STRIDE 위협 모델링을 수행한 뒤, 구체적인 방어 아키텍처를 추천하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- **API 스펙 자동 파싱**: JSON/YAML 파일 업로드 또는 텍스트 직접 입력
- **OWASP API Top 10 취약점 탐지**: 10가지 주요 API 보안 취약점 자동 탐지
- **STRIDE 위협 모델링**: 체계적인 위협 분석
- **방어 아키텍처 추천**: 인증/인가, Rate Limiting, WAF 룰 등 구체적 추천
- **실행 가능한 코드 생성**: 개선된 API 스펙 및 미들웨어 코드 예시
- **다국어 지원**: 한국어, 영어, 일본어 UI 및 API 응답 번역
- **다크/라이트 테마**: 사용자 선호에 따른 테마 전환
- **예시 문서 번역**: 6개의 API 스펙 예시 문서 다국어 지원

## 🛠 기술 스택

- **Frontend**: React 19 + Vite 7 + Tailwind CSS
- **API**: OpenAI GPT-4o-mini
- **Hosting**: Vercel (프론트엔드 + Serverless Functions)
- **Build Tool**: Vite
- **Package Manager**: npm
- **국제화**: React Context API 기반 다국어 지원
- **테마**: CSS Variables 기반 적응형 테마 시스템

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 설치

```bash
git clone https://github.com/junsang-dong/vibe_1223_api_shield_nova.git
cd vibe_1223_api_shield_nova
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 OpenAI API 키를 설정하세요:

```bash
OPENAI_API_KEY=your_openai_api_key_here
# 또는
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행

**옵션 1: 프론트엔드와 API 서버를 함께 실행 (권장)**

```bash
npm run dev:all
```

이 명령은 프론트엔드(Vite)와 API 서버(Express)를 동시에 실행합니다.

**옵션 2: 별도로 실행**

터미널 1 - API 서버:
```bash
npm run dev:server
```

터미널 2 - 프론트엔드:
```bash
npm run dev
```

브라우저에서 `http://localhost:5181`을 열어 확인하세요.

### 4. 샘플 데이터로 테스트

1. "샘플 로드" 버튼 클릭
2. "보안 분석 시작" 버튼 클릭
3. 분석 결과 확인

## 📚 지원하는 취약점

- **API1**: Broken Object Level Authorization (BOLA)
- **API2**: Broken Authentication
- **API3**: Broken Object Property Level Authorization
- **API4**: Unrestricted Resource Consumption
- **API5**: Broken Function Level Authorization
- **API6**: Unrestricted Access to Sensitive Business Flows
- **API7**: Server Side Request Forgery (SSRF)
- **API8**: Security Misconfiguration
- **API9**: Improper Inventory Management
- **API10**: Unsafe Consumption of APIs

## 🚀 프로덕션 배포 (Vercel)

### Vercel 서버리스 웹앱 배포 가이드

#### 1. GitHub 리포지토리 준비

먼저 코드를 GitHub에 푸시합니다:

```bash
# Git 초기화 (아직 안 했다면)
git init

# 원격 리포지토리 추가
git remote add origin https://github.com/junsang-dong/vibe_1223_api_shield_nova.git

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: API Shield Nova with i18n and theme support"

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

#### 2. Vercel 프로젝트 생성

1. **[Vercel](https://vercel.com) 접속** 및 로그인
2. **"Add New..." → "Project"** 클릭
3. **GitHub 리포지토리 선택**
   - `junsang-dong/vibe_1223_api_shield_nova` 선택
   - 또는 "Import Git Repository"에서 직접 URL 입력
4. **"Import"** 클릭

#### 3. 프로젝트 설정

**Framework Preset**: Vite 선택 (자동 감지됨)

**Root Directory**: `./` (기본값)

**Build Command**: `npm run build` (기본값)

**Output Directory**: `dist` (기본값)

**Install Command**: `npm install` (기본값)

#### 4. Environment Variables 설정

**Environment Variables** 섹션에서 다음 변수 추가:

```
OPENAI_API_KEY = your_openai_api_key_here
```

- **Environment**: Production, Preview, Development 모두 선택
- **Value**: 실제 OpenAI API 키 입력

> ⚠️ **중요**: `.env` 파일은 Git에 커밋하지 마세요. `.gitignore`에 포함되어 있습니다.

#### 5. 배포 실행

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 제공되는 URL로 접속

#### 6. 배포 후 확인

- 배포된 URL로 접속하여 앱이 정상 작동하는지 확인
- 설정 메뉴에서 테마/언어 전환 테스트
- 예시 문서 선택 및 분석 기능 테스트

#### 7. 자동 배포 설정

- **GitHub에 푸시할 때마다 자동 배포** (기본 활성화)
- `main` 브랜치에 푸시 → Production 배포
- 다른 브랜치에 푸시 → Preview 배포

### Vercel CLI를 사용한 로컬 테스트

프로덕션 환경과 동일하게 로컬에서 테스트하려면:

```bash
# Vercel CLI 설치
npm install -g vercel

# Vercel 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경 변수 설정
vercel env add OPENAI_API_KEY

# 로컬에서 Vercel 환경으로 실행
vercel dev
```

이제 `http://localhost:3000`에서 Vercel Serverless Functions와 함께 테스트할 수 있습니다.

### 배포 체크리스트

- [ ] GitHub 리포지토리에 코드 푸시 완료
- [ ] Vercel 프로젝트 생성 및 리포지토리 연결
- [ ] Environment Variables 설정 (OPENAI_API_KEY)
- [ ] 빌드 설정 확인 (Vite, Output: dist)
- [ ] 배포 성공 확인
- [ ] 배포된 URL에서 기능 테스트
- [ ] 다국어/테마 전환 테스트

## 📂 프로젝트 구조

```
vibe_1223_api_shield_nova/
├── src/
│   ├── components/
│   │   ├── FileUploader.jsx          # API 파일 업로드
│   │   ├── SpecEditor.jsx            # 텍스트 입력 에디터 (다국어 예시 문서 지원)
│   │   ├── AnalysisResults.jsx       # 분석 결과 표시
│   │   ├── ThreatModelViewer.jsx     # STRIDE 모델링 결과
│   │   ├── DefenseRecommendations.jsx # 방어 아키텍처 추천
│   │   ├── CodeGenerator.jsx         # 개선 코드 생성기
│   │   └── SettingsMenu.jsx          # 설정 메뉴 (테마/언어 선택)
│   ├── contexts/
│   │   └── LanguageContext.jsx       # 다국어 컨텍스트
│   ├── utils/
│   │   ├── openApiParser.js          # API 파싱 유틸
│   │   ├── vulnerabilityPatterns.js  # 취약점 패턴 DB
│   │   ├── translations.js           # 번역 딕셔너리
│   │   └── yamlTranslator.js         # YAML 스펙 번역 유틸
│   ├── App.jsx
│   └── main.jsx
├── api/
│   └── analyze.js                    # Vercel Serverless Function
├── public/
│   └── sample-specs/                 # 6개의 예시 API 스펙 문서
│       ├── vulnerable-api.yml
│       ├── no-auth-api.yml
│       ├── external-api-integration.yml
│       ├── microservices-api.yml
│       ├── basic-rest-api.yml
│       └── secure-api.yml
├── server.js                         # 로컬 개발용 Express 서버
├── vercel.json                       # Vercel 설정
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 보안 고려사항

1. **API 키 보호**: 절대 프론트엔드에 API 키 노출 금지. Vercel Serverless Function에서만 사용.
2. **입력 검증**: 업로드 파일 크기 제한 (5MB), JSON/YAML 유효성 검사
3. **Rate Limiting**: 무료 플랜 제한 고려

## 📖 사용 방법

1. **API 스펙 입력**
   - 예시 문서 선택 (6개의 다양한 예시 제공)
   - 또는 JSON/YAML 파일 업로드
   - 또는 텍스트로 직접 입력

2. **보안 분석 시작**
   - "보안 분석 시작" 버튼 클릭
   - 30초 카운트다운과 함께 분석 진행

3. **분석 결과 확인**
   - **📊 요약**: 전체 취약점 통계 및 핵심 분석
   - **🔍 취약점 상세**: 각 취약점의 상세 정보
   - **⚠️ 위협 모델**: STRIDE 분류 결과
   - **⚙️ 방어책**: 구체적인 방어 전략 및 아키텍처
   - **💻 코드**: 개선된 API 스펙 다운로드 (JSON/YAML/Markdown)

4. **설정 메뉴**
   - 헤더 우측 설정 아이콘 클릭
   - **디자인 테마**: 라이트/다크 모드 전환
   - **언어**: 한국어/영어/일본어 선택

## 🧪 로컬 테스트 (Vercel CLI 사용)

Vercel Serverless Function을 로컬에서 테스트하려면:

```bash
npm install -g vercel
vercel dev
```

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!
