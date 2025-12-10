# 🚀 Vercel 배포 가이드

API Shield Nova를 Vercel에 배포하는 방법입니다.

## 📋 사전 준비사항

1. GitHub 계정
2. Vercel 계정 (https://vercel.com)
3. OpenAI API 키

## 🔧 배포 단계

### 1단계: Vercel 계정 생성 및 로그인

1. [Vercel](https://vercel.com)에 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (권장)

### 2단계: 프로젝트 Import

1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub 리포지토리 목록에서 `junsang-dong/vibe-1210-owasp-api-shield` 선택
3. "Import" 클릭

### 3단계: 프로젝트 설정

#### Framework Preset
- **Framework Preset**: Vite (자동 감지됨)

#### Build Settings
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `dist` (기본값)
- **Install Command**: `npm install` (기본값)

#### Root Directory
- 기본값 유지 (프로젝트 루트)

### 4단계: Environment Variables 설정

**중요**: 환경 변수를 반드시 설정해야 합니다!

1. "Environment Variables" 섹션으로 이동
2. 다음 변수 추가:

```
변수 이름: OPENAI_API_KEY
값: your_openai_api_key_here (실제 OpenAI API 키 입력)
Environment: Production, Preview, Development (모두 선택)
```

**설정 방법:**
- "Add" 버튼 클릭
- Name: `OPENAI_API_KEY`
- Value: 실제 OpenAI API 키 입력
- Environment: Production, Preview, Development 모두 체크
- "Save" 클릭

### 5단계: 배포 실행

1. "Deploy" 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 제공되는 URL로 접속

## ✅ 배포 확인

배포가 완료되면:

1. Vercel 대시보드에서 제공하는 URL로 접속
   - 예: `https://vibe-1210-owasp-api-shield.vercel.app`
2. 웹앱이 정상적으로 로드되는지 확인
3. 샘플 OpenAPI 스펙으로 분석 테스트

## 🔄 자동 배포 설정

GitHub에 푸시할 때마다 자동으로 배포됩니다:

- `main` 브랜치에 푸시 → Production 배포
- 다른 브랜치에 푸시 → Preview 배포

## 🛠️ 문제 해결

### 문제 1: API 호출 실패

**증상**: 분석 실행 시 오류 발생

**해결 방법**:
1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
3. 환경 변수 수정 후 "Redeploy" 클릭

### 문제 2: 빌드 실패

**증상**: 배포 중 빌드 오류

**해결 방법**:
1. Vercel 대시보드 → Deployments → 실패한 배포 클릭
2. 빌드 로그 확인
3. 일반적인 원인:
   - 의존성 설치 실패 → `package.json` 확인
   - 빌드 명령 오류 → `vite.config.js` 확인
   - 환경 변수 누락 → Environment Variables 확인

### 문제 3: Serverless Function 타임아웃

**증상**: 분석 중 타임아웃 오류

**해결 방법**:
1. `vercel.json`에서 `maxDuration` 확인 (현재 60초)
2. 필요시 증가:
   ```json
   {
     "functions": {
       "api/**/*.js": {
         "memory": 1024,
         "maxDuration": 120
       }
     }
   }
   ```

## 📝 추가 설정 (선택사항)

### 커스텀 도메인 설정

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정 안내에 따라 DNS 레코드 추가

### 환경별 설정

- **Production**: 프로덕션 환경
- **Preview**: PR 및 브랜치별 미리보기
- **Development**: 로컬 개발 환경

각 환경에 다른 `OPENAI_API_KEY`를 설정할 수 있습니다.

## 🎉 배포 완료!

배포가 완료되면 다음 URL로 접속할 수 있습니다:

```
https://vibe-1210-owasp-api-shield.vercel.app
```

(실제 URL은 Vercel 대시보드에서 확인하세요)

## 📚 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

