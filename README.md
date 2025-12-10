# 🔒 API Shield Nova

OWASP API Security Top 10 기반으로 OpenAPI 스펙을 분석하여 취약점을 자동 탐지하고, STRIDE 위협 모델링을 수행한 뒤, 구체적인 방어 아키텍처를 추천하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- **OpenAPI 스펙 자동 파싱**: JSON/YAML 파일 업로드 또는 텍스트 직접 입력
- **OWASP API Top 10 취약점 탐지**: 10가지 주요 API 보안 취약점 자동 탐지
- **STRIDE 위협 모델링**: 체계적인 위협 분석
- **방어 아키텍처 추천**: 인증/인가, Rate Limiting, WAF 룰 등 구체적 추천
- **실행 가능한 코드 생성**: 개선된 OpenAPI 스펙 및 미들웨어 코드 예시

## 🛠 기술 스택

- **Frontend**: React 18 + Vite 5 + Tailwind CSS
- **API**: OpenAI GPT-4o-mini
- **Hosting**: Vercel (프론트엔드 + Serverless Functions)
- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 설치

```bash
git clone <repository-url>
cd vibe-1210-owasp-api-shield
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

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

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

### 1. GitHub 리포지토리 생성 및 푸시

```bash
git init
git add .
git commit -m "Initial commit: API Security Analyzer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/api-security-analyzer.git
git push -u origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com)에서 GitHub 연동
2. 프로젝트 Import
3. Environment Variables 설정:
   - `OPENAI_API_KEY` = your_openai_api_key
4. 자동 배포 완료

## 📂 프로젝트 구조

```
api-security-analyzer/
├── src/
│   ├── components/
│   │   ├── FileUploader.jsx          # OpenAPI 파일 업로드
│   │   ├── SpecEditor.jsx            # 텍스트 입력 에디터
│   │   ├── AnalysisResults.jsx       # 분석 결과 표시
│   │   ├── ThreatModelViewer.jsx     # STRIDE 모델링 결과
│   │   ├── DefenseRecommendations.jsx # 방어 아키텍처 추천
│   │   └── CodeGenerator.jsx         # 개선 코드 생성기
│   ├── utils/
│   │   ├── openApiParser.js          # OpenAPI 파싱 유틸
│   │   └── vulnerabilityPatterns.js  # 취약점 패턴 DB
│   ├── App.jsx
│   └── main.jsx
├── api/
│   └── analyze.js                    # Vercel Serverless Function
├── public/
│   └── sample-specs/
│       └── vampi-openapi3.yml        # 샘플 취약한 API 스펙
├── vercel.json
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 보안 고려사항

1. **API 키 보호**: 절대 프론트엔드에 API 키 노출 금지. Vercel Serverless Function에서만 사용.
2. **입력 검증**: 업로드 파일 크기 제한 (5MB), JSON/YAML 유효성 검사
3. **Rate Limiting**: 무료 플랜 제한 고려

## 📖 사용 방법

1. OpenAPI 스펙 파일 업로드 또는 텍스트로 직접 입력
2. "보안 분석 시작" 버튼 클릭
3. 분석 결과 확인:
   - **요약**: 전체 취약점 통계
   - **취약점 상세**: 각 취약점의 상세 정보
   - **위협 모델**: STRIDE 분류 결과
   - **방어책**: 구체적인 방어 전략
   - **코드**: 개선된 OpenAPI 스펙 다운로드

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
