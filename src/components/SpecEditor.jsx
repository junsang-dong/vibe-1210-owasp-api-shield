import { useState } from 'react';

const SAMPLE_SPECS = [
  {
    id: 'vulnerable-api',
    name: '취약한 사용자 관리 API',
    description: 'OWASP Top 10 취약점이 다수 포함된 예시',
    file: '/sample-specs/vulnerable-api.yml',
    impact: '높음',
    importance: '높음',
    risk: '매우 높음',
    riskColor: 'critical',
    tags: ['BOLA', '인증 취약', 'SSRF', 'Rate Limit 없음'],
  },
  {
    id: 'no-auth-api',
    name: '인증 없는 API',
    description: '인증 메커니즘이 전혀 없는 취약한 API',
    file: '/sample-specs/no-auth-api.yml',
    impact: '높음',
    importance: '높음',
    risk: '매우 높음',
    riskColor: 'critical',
    tags: ['인증 없음', '권한 체크 없음', '민감 정보 노출'],
  },
  {
    id: 'external-api-integration',
    name: '외부 API 통합 서비스',
    description: '외부 API를 호출하는 서비스 예시',
    file: '/sample-specs/external-api-integration.yml',
    impact: '중간',
    importance: '높음',
    risk: '높음',
    riskColor: 'high',
    tags: ['SSRF', '외부 API 검증 없음', '웹훅 위조'],
  },
  {
    id: 'microservices-api',
    name: '마이크로서비스 API',
    description: '여러 마이크로서비스로 구성된 API 예시',
    file: '/sample-specs/microservices-api.yml',
    impact: '중간',
    importance: '중간',
    risk: '중간',
    riskColor: 'medium',
    tags: ['API Key 인증', 'Rate Limit 권장', '마이크로서비스'],
  },
  {
    id: 'basic-rest-api',
    name: '기본 REST API',
    description: '기본적인 REST API 구조를 가진 예시',
    file: '/sample-specs/basic-rest-api.yml',
    impact: '낮음',
    importance: '중간',
    risk: '낮음',
    riskColor: 'low',
    tags: ['기본 구조', 'CRUD', '인증 미구현'],
  },
  {
    id: 'secure-api',
    name: '보안이 강화된 API',
    description: '보안 모범 사례를 따르는 잘 보호된 API 예시',
    file: '/sample-specs/secure-api.yml',
    impact: '낮음',
    importance: '높음',
    risk: '낮음',
    riskColor: 'low',
    tags: ['JWT 인증', 'HTTPS', '권한 체크', '모범 사례'],
  },
];

export default function SpecEditor({ value, onChange, onLoadSample }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  const handleLoadSample = async (sample) => {
    try {
      const response = await fetch(sample.file);
      const text = await response.text();
      onChange(text);
      setSelectedSample(sample.id);
      onLoadSample && onLoadSample();
    } catch (err) {
      console.error('샘플 로드 실패:', err);
      alert('샘플 파일을 불러올 수 없습니다.');
    }
  };

  const getRiskColorClass = (riskColor) => {
    const colorMap = {
      critical: 'bg-red-500/20 border-red-500/50 text-red-400',
      high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      low: 'bg-green-500/20 border-green-500/50 text-green-400',
    };
    return colorMap[riskColor] || colorMap.low;
  };

  const getImpactBadge = (impact) => {
    const colorMap = {
      높음: 'bg-red-600',
      중간: 'bg-yellow-600',
      낮음: 'bg-green-600',
    };
    return colorMap[impact] || 'bg-gray-600';
  };

  return (
    <div className="w-full space-y-4">
      {/* 예시 문서 선택 섹션 */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-3 block">
          📚 OpenAPI 스펙 예시 문서 선택
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_SPECS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className={`bg-gray-800 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 hover:shadow-lg ${
                selectedSample === sample.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white text-sm">{sample.name}</h4>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${getRiskColorClass(
                    sample.riskColor
                  )}`}
                >
                  {sample.risk}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{sample.description}</p>
              
              {/* 메트릭 */}
              <div className="flex gap-2 mb-3">
                <span className="text-xs text-gray-500">
                  영향력: <span className={`px-1.5 py-0.5 rounded ${getImpactBadge(sample.impact)} text-white text-xs`}>{sample.impact}</span>
                </span>
                <span className="text-xs text-gray-500">
                  중요도: <span className="text-gray-300">{sample.importance}</span>
                </span>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-1">
                {sample.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {sample.tags.length > 2 && (
                  <span className="px-2 py-0.5 text-gray-500 text-xs">
                    +{sample.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 텍스트 입력 섹션 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">
            또는 텍스트로 직접 입력
          </label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
          >
            {isExpanded ? '접기' : '펼치기'}
          </button>
        </div>
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSelectedSample(null);
          }}
          className={`w-full bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isExpanded ? 'h-96' : 'h-32'
          }`}
          placeholder="OpenAPI 스펙을 JSON 또는 YAML 형식으로 입력하세요..."
        />
      </div>
    </div>
  );
}
