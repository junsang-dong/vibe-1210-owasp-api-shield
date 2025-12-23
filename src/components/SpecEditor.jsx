import { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import { translateYamlSpec } from '../utils/yamlTranslator';

const SAMPLE_SPECS_CONFIG = [
  {
    id: 'vulnerable-api',
    key: 'vulnerableApi',
    file: '/sample-specs/vulnerable-api.yml',
    riskColor: 'critical',
  },
  {
    id: 'no-auth-api',
    key: 'noAuthApi',
    file: '/sample-specs/no-auth-api.yml',
    riskColor: 'critical',
  },
  {
    id: 'external-api-integration',
    key: 'externalApiIntegration',
    file: '/sample-specs/external-api-integration.yml',
    riskColor: 'high',
  },
  {
    id: 'microservices-api',
    key: 'microservicesApi',
    file: '/sample-specs/microservices-api.yml',
    riskColor: 'medium',
  },
  {
    id: 'basic-rest-api',
    key: 'basicRestApi',
    file: '/sample-specs/basic-rest-api.yml',
    riskColor: 'low',
  },
  {
    id: 'secure-api',
    key: 'secureApi',
    file: '/sample-specs/secure-api.yml',
    riskColor: 'low',
  },
];

export default function SpecEditor({ value, onChange, onLoadSample }) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  const SAMPLE_SPECS = useMemo(() => {
    return SAMPLE_SPECS_CONFIG.map((config) => {
      const tags = getTranslation(language, `sampleSpecs.${config.key}.tags`);
      return {
        id: config.id,
        name: getTranslation(language, `sampleSpecs.${config.key}.name`),
        description: getTranslation(language, `sampleSpecs.${config.key}.description`),
        file: config.file,
        impact: getTranslation(language, `sampleSpecs.${config.key}.impact`),
        importance: getTranslation(language, `sampleSpecs.${config.key}.importance`),
        risk: getTranslation(language, `sampleSpecs.${config.key}.risk`),
        riskColor: config.riskColor,
        tags: Array.isArray(tags) ? tags : [],
      };
    });
  }, [language]);

  const handleLoadSample = async (sample) => {
    try {
      const response = await fetch(sample.file);
      const text = await response.text();
      // 언어에 따라 YAML 내용 번역
      const translatedText = translateYamlSpec(text, language);
      onChange(translatedText);
      setSelectedSample(sample.id);
      onLoadSample && onLoadSample();
    } catch (err) {
      console.error('샘플 로드 실패:', err);
      const errorMsg = language === 'en' 
        ? 'Unable to load sample file.' 
        : language === 'ja' 
        ? 'サンプルファイルを読み込めませんでした。'
        : '샘플 파일을 불러올 수 없습니다.';
      alert(errorMsg);
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
    // 언어에 관계없이 높음/High/高, 중간/Medium/中, 낮음/Low/低를 처리
    const highValues = ['높음', 'High', '高'];
    const mediumValues = ['중간', 'Medium', '中'];
    const lowValues = ['낮음', 'Low', '低'];
    
    if (highValues.includes(impact)) return 'bg-red-600';
    if (mediumValues.includes(impact)) return 'bg-yellow-600';
    if (lowValues.includes(impact)) return 'bg-green-600';
    return 'bg-gray-600';
  };

  return (
    <div className="w-full space-y-4">
      {/* 예시 문서 선택 섹션 */}
      <div>
        <label className="text-sm font-medium text-adaptive-text mb-3 block">
          📚 {getTranslation(language, 'step1.sampleDocs')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_SPECS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className={`bg-adaptive-surface border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-adaptive-primary hover:shadow-lg ${
                selectedSample === sample.id
                  ? 'border-adaptive-primary shadow-lg'
                  : 'border-adaptive-border'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-adaptive-text text-sm">{sample.name}</h4>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${getRiskColorClass(
                    sample.riskColor
                  )}`}
                >
                  {sample.risk}
                </span>
              </div>
              <p className="text-xs text-adaptive-text/70 mb-3">{sample.description}</p>
              
              {/* 메트릭 */}
              <div className="flex gap-2 mb-3">
                <span className="text-xs text-adaptive-text/70">
                  {getTranslation(language, 'step1.impact')}: <span className={`px-1.5 py-0.5 rounded ${getImpactBadge(sample.impact)} text-white text-xs`}>{sample.impact}</span>
                </span>
                <span className="text-xs text-adaptive-text/70">
                  {getTranslation(language, 'step1.importance')}: <span className="text-gray-800 dark:text-gray-300">{sample.importance}</span>
                </span>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-1">
                {sample.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-adaptive-surface border border-adaptive-border text-adaptive-text rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {sample.tags.length > 2 && (
                  <span className="px-2 py-0.5 text-adaptive-text/70 text-xs">
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
          <label className="text-sm font-medium text-adaptive-text">
            {getTranslation(language, 'step1.orTextInput')}
          </label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-adaptive-surface hover:bg-adaptive-surface/80 border border-adaptive-border rounded text-adaptive-text"
          >
            {isExpanded ? getTranslation(language, 'step1.collapse') : getTranslation(language, 'step1.expand')}
          </button>
        </div>
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSelectedSample(null);
          }}
          className={`w-full bg-adaptive-surface border border-adaptive-border rounded-lg p-4 font-mono text-sm text-adaptive-text focus:outline-none focus:ring-2 focus:ring-adaptive-primary ${
            isExpanded ? 'h-96' : 'h-32'
          }`}
          placeholder={getTranslation(language, 'step1.placeholder')}
        />
      </div>
    </div>
  );
}
