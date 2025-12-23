import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5181;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { openApiSpec, language = 'ko' } = req.body;

  if (!openApiSpec) {
    const errorMessages = {
      ko: 'API 스펙이 필요합니다.',
      en: 'API specification is required.',
      ja: 'API仕様が必要です。',
    };
    return res.status(400).json({ error: errorMessages[language] || errorMessages.ko });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'OpenAI API 키가 설정되지 않았습니다.',
      hint: '.env 파일에 OPENAI_API_KEY 또는 VITE_OPENAI_API_KEY를 설정해주세요.'
    });
  }

  const openai = new OpenAI({ apiKey });

  // 언어별 프롬프트 생성
  const getSystemPrompt = (lang) => {
    const prompts = {
      ko: `당신은 CISSP, CISA, CISM 자격을 보유한 API 보안 전문가입니다.

주어진 API 스펙을 분석하여 다음을 수행하세요:

1. OWASP API Security Top 10 (2023) 기준 취약점 탐지
   - API1: Broken Object Level Authorization (BOLA)
   - API2: Broken Authentication
   - API3: Broken Object Property Level Authorization
   - API4: Unrestricted Resource Consumption
   - API5: Broken Function Level Authorization
   - API6: Unrestricted Access to Sensitive Business Flows
   - API7: Server Side Request Forgery (SSRF)
   - API8: Security Misconfiguration
   - API9: Improper Inventory Management
   - API10: Unsafe Consumption of APIs

2. 각 취약점에 대해:
   - 심각도 (CRITICAL/HIGH/MEDIUM/LOW)
   - 공격 시나리오 (실제 가능한 해킹 방법)
   - CVE 또는 실제 사례 참조
   - STRIDE 모델 매핑

3. 구체적인 방어 전략:
   - 인증/인가 메커니즘 추천
   - Rate Limiting 설정
   - WAF 룰
   - API Gateway 설정
   - 실행 가능한 코드 (Express.js, FastAPI, Go Gin 등)

4. 개선된 API 스펙 생성

분석 결과는 반드시 다음 JSON 포맷으로 출력하세요. 모든 텍스트는 한국어로 작성하세요:
{
  "summary": {
    "totalEndpoints": 숫자,
    "criticalIssues": 숫자,
    "highIssues": 숫자,
    "mediumIssues": 숫자,
    "lowIssues": 숫자
  },
  "vulnerabilities": [
    {
      "id": "API1-001",
      "owaspCategory": "API1:2023 - Broken Object Level Authorization",
      "endpoint": "/api/users/{userId}",
      "method": "GET",
      "severity": "CRITICAL",
      "description": "상세 설명",
      "attackScenario": "공격 시나리오",
      "cveReference": "CVE 참조 또는 실제 사례",
      "stride": ["Information Disclosure", "Elevation of Privilege"]
    }
  ],
  "threatModel": {
    "stride": {
      "spoofing": ["위협 설명"],
      "tampering": ["위협 설명"],
      "repudiation": ["위협 설명"],
      "informationDisclosure": ["위협 설명"],
      "denialOfService": ["위협 설명"],
      "elevationOfPrivilege": ["위협 설명"]
    }
  },
  "recommendations": {
    "authentication": {
      "type": "JWT Bearer Token",
      "implementation": "구현 방법 설명",
      "code": "실행 가능한 코드"
    },
    "authorization": {
      "pattern": "RBAC",
      "implementation": "구현 방법 설명",
      "code": "실행 가능한 코드"
    },
    "rateLimit": {
      "strategy": "Token Bucket per User",
      "config": "100 requests/minute per user",
      "code": "실행 가능한 코드"
    },
    "wafRules": ["WAF 룰 목록"],
    "apiGateway": {
      "provider": "AWS API Gateway 또는 Kong",
      "features": ["기능 목록"]
    },
    "improvedOpenApiSpec": "개선된 API 3.0 YAML 스펙"
  }
}`,
      en: `You are an API security expert with CISSP, CISA, and CISM certifications.

Analyze the given API specification and perform the following:

1. Detect vulnerabilities based on OWASP API Security Top 10 (2023)
   - API1: Broken Object Level Authorization (BOLA)
   - API2: Broken Authentication
   - API3: Broken Object Property Level Authorization
   - API4: Unrestricted Resource Consumption
   - API5: Broken Function Level Authorization
   - API6: Unrestricted Access to Sensitive Business Flows
   - API7: Server Side Request Forgery (SSRF)
   - API8: Security Misconfiguration
   - API9: Improper Inventory Management
   - API10: Unsafe Consumption of APIs

2. For each vulnerability:
   - Severity (CRITICAL/HIGH/MEDIUM/LOW)
   - Attack scenario (actual possible hacking methods)
   - CVE reference or real-world examples
   - STRIDE model mapping

3. Specific defense strategies:
   - Authentication/authorization mechanism recommendations
   - Rate Limiting configuration
   - WAF rules
   - API Gateway configuration
   - Executable code (Express.js, FastAPI, Go Gin, etc.)

4. Generate improved API specification

Output the analysis results in the following JSON format. All text must be in English:
{
  "summary": {
    "totalEndpoints": number,
    "criticalIssues": number,
    "highIssues": number,
    "mediumIssues": number,
    "lowIssues": number
  },
  "vulnerabilities": [
    {
      "id": "API1-001",
      "owaspCategory": "API1:2023 - Broken Object Level Authorization",
      "endpoint": "/api/users/{userId}",
      "method": "GET",
      "severity": "CRITICAL",
      "description": "Detailed description",
      "attackScenario": "Attack scenario",
      "cveReference": "CVE reference or real-world example",
      "stride": ["Information Disclosure", "Elevation of Privilege"]
    }
  ],
  "threatModel": {
    "stride": {
      "spoofing": ["Threat description"],
      "tampering": ["Threat description"],
      "repudiation": ["Threat description"],
      "informationDisclosure": ["Threat description"],
      "denialOfService": ["Threat description"],
      "elevationOfPrivilege": ["Threat description"]
    }
  },
  "recommendations": {
    "authentication": {
      "type": "JWT Bearer Token",
      "implementation": "Implementation method description",
      "code": "Executable code"
    },
    "authorization": {
      "pattern": "RBAC",
      "implementation": "Implementation method description",
      "code": "Executable code"
    },
    "rateLimit": {
      "strategy": "Token Bucket per User",
      "config": "100 requests/minute per user",
      "code": "Executable code"
    },
    "wafRules": ["WAF rule list"],
    "apiGateway": {
      "provider": "AWS API Gateway or Kong",
      "features": ["Feature list"]
    },
    "improvedOpenApiSpec": "Improved API 3.0 YAML specification"
  }
}`,
      ja: `あなたはCISSP、CISA、CISMの資格を持つAPIセキュリティ専門家です。

指定されたAPI仕様を分析し、以下を実行してください：

1. OWASP API Security Top 10 (2023)基準の脆弱性検出
   - API1: Broken Object Level Authorization (BOLA)
   - API2: Broken Authentication
   - API3: Broken Object Property Level Authorization
   - API4: Unrestricted Resource Consumption
   - API5: Broken Function Level Authorization
   - API6: Unrestricted Access to Sensitive Business Flows
   - API7: Server Side Request Forgery (SSRF)
   - API8: Security Misconfiguration
   - API9: Improper Inventory Management
   - API10: Unsafe Consumption of APIs

2. 各脆弱性について：
   - 深刻度 (CRITICAL/HIGH/MEDIUM/LOW)
   - 攻撃シナリオ (実際に可能なハッキング方法)
   - CVE参照または実際の事例
   - STRIDEモデルマッピング

3. 具体的な防御戦略：
   - 認証/認可メカニズムの推奨
   - Rate Limiting設定
   - WAFルール
   - API Gateway設定
   - 実行可能なコード (Express.js, FastAPI, Go Ginなど)

4. 改善されたAPI仕様の生成

分析結果は必ず次のJSON形式で出力してください。すべてのテキストは日本語で記述してください：
{
  "summary": {
    "totalEndpoints": 数値,
    "criticalIssues": 数値,
    "highIssues": 数値,
    "mediumIssues": 数値,
    "lowIssues": 数値
  },
  "vulnerabilities": [
    {
      "id": "API1-001",
      "owaspCategory": "API1:2023 - Broken Object Level Authorization",
      "endpoint": "/api/users/{userId}",
      "method": "GET",
      "severity": "CRITICAL",
      "description": "詳細な説明",
      "attackScenario": "攻撃シナリオ",
      "cveReference": "CVE参照または実際の事例",
      "stride": ["Information Disclosure", "Elevation of Privilege"]
    }
  ],
  "threatModel": {
    "stride": {
      "spoofing": ["脅威の説明"],
      "tampering": ["脅威の説明"],
      "repudiation": ["脅威の説明"],
      "informationDisclosure": ["脅威の説明"],
      "denialOfService": ["脅威の説明"],
      "elevationOfPrivilege": ["脅威の説明"]
    }
  },
  "recommendations": {
    "authentication": {
      "type": "JWT Bearer Token",
      "implementation": "実装方法の説明",
      "code": "実行可能なコード"
    },
    "authorization": {
      "pattern": "RBAC",
      "implementation": "実装方法の説明",
      "code": "実行可能なコード"
    },
    "rateLimit": {
      "strategy": "Token Bucket per User",
      "config": "100 requests/minute per user",
      "code": "実行可能なコード"
    },
    "wafRules": ["WAFルールリスト"],
    "apiGateway": {
      "provider": "AWS API GatewayまたはKong",
      "features": ["機能リスト"]
    },
    "improvedOpenApiSpec": "改善されたAPI 3.0 YAML仕様"
  }
}`,
    };
    return prompts[lang] || prompts.ko;
  };

  const systemPrompt = getSystemPrompt(language);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: language === 'en' 
          ? `Please analyze the following API specification:\n\n${openApiSpec}`
          : language === 'ja'
          ? `次のAPI仕様を分析してください：\n\n${openApiSpec}`
          : `다음 API 스펙을 분석해주세요:\n\n${openApiSpec}` },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    let result;

    try {
      result = JSON.parse(content);
    } catch (parseError) {
      // JSON 파싱 실패 시 텍스트에서 JSON 추출 시도
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('GPT 응답을 파싱할 수 없습니다.');
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    return res.status(500).json({
      error: '분석 중 오류가 발생했습니다.',
      details: error.message,
    });
  }
});

// 빌드된 정적 파일 서빙 (프로덕션 모드)
const distPath = join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA 라우팅: API가 아닌 모든 GET 요청을 index.html로 리다이렉트
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 서버가 http://localhost:${port}에서 실행 중입니다.`);
  console.log(`📝 API 엔드포인트: http://localhost:${port}/api/analyze`);
  console.log(`🌐 웹앱: http://localhost:${port}`);
});

