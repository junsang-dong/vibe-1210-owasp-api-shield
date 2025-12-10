import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { openApiSpec } = req.body;

  if (!openApiSpec) {
    return res.status(400).json({ error: 'OpenAPI 스펙이 필요합니다.' });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'OpenAI API 키가 설정되지 않았습니다.',
      hint: '.env 파일에 OPENAI_API_KEY 또는 VITE_OPENAI_API_KEY를 설정해주세요.'
    });
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `당신은 CISSP, CISA, CISM 자격을 보유한 API 보안 전문가입니다.

주어진 OpenAPI 스펙을 분석하여 다음을 수행하세요:

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

4. 개선된 OpenAPI 스펙 생성

분석 결과는 반드시 다음 JSON 포맷으로 출력하세요:
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
    "improvedOpenApiSpec": "개선된 OpenAPI 3.0 YAML 스펙"
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `다음 OpenAPI 스펙을 분석해주세요:\n\n${openApiSpec}` },
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

app.listen(port, () => {
  console.log(`🚀 로컬 개발 서버가 http://localhost:${port}에서 실행 중입니다.`);
  console.log(`📝 API 엔드포인트: http://localhost:${port}/api/analyze`);
});

