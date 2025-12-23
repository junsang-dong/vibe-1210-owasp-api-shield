import { STRIDE_CATEGORIES } from '../utils/vulnerabilityPatterns';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function ThreatModelViewer({ threatModel }) {
  const { language } = useLanguage();
  if (!threatModel || !threatModel.stride) return null;

  const { stride } = threatModel;
  
  // STRIDE 카테고리 번역
  const getStrideLabel = (key) => {
    const labels = {
      ko: {
        spoofing: '스푸핑 (Spoofing)',
        tampering: '변조 (Tampering)',
        repudiation: '부인 (Repudiation)',
        informationDisclosure: '정보 공개 (Information Disclosure)',
        denialOfService: '서비스 거부 (Denial of Service)',
        elevationOfPrivilege: '권한 상승 (Elevation of Privilege)',
      },
      en: {
        spoofing: 'Spoofing',
        tampering: 'Tampering',
        repudiation: 'Repudiation',
        informationDisclosure: 'Information Disclosure',
        denialOfService: 'Denial of Service',
        elevationOfPrivilege: 'Elevation of Privilege',
      },
      ja: {
        spoofing: 'スプーフィング (Spoofing)',
        tampering: '改ざん (Tampering)',
        repudiation: '否認 (Repudiation)',
        informationDisclosure: '情報開示 (Information Disclosure)',
        denialOfService: 'サービス拒否 (Denial of Service)',
        elevationOfPrivilege: '権限昇格 (Elevation of Privilege)',
      },
    };
    return labels[language]?.[key] || STRIDE_CATEGORIES[key] || key;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">🛡️ STRIDE {language === 'en' ? 'Threat Modeling Results' : language === 'ja' ? '脅威モデリング結果' : '위협 모델링 결과'}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(STRIDE_CATEGORIES).map(([key, label]) => {
          const threats = stride[key] || [];
          
          return (
            <div
              key={key}
              className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border"
            >
              <h4 className="text-lg font-semibold mb-3">{getStrideLabel(key)}</h4>
              {threats.length > 0 ? (
                <ul className="space-y-2">
                  {threats.map((threat, index) => (
                    <li
                      key={index}
                      className="text-sm text-adaptive-text pl-4 border-l-2 border-adaptive-primary"
                    >
                      {typeof threat === 'string' ? threat : threat.description || JSON.stringify(threat)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-adaptive-text/70">
                  {language === 'en' 
                    ? 'No threats found in this category.' 
                    : language === 'ja' 
                    ? 'このカテゴリで脅威は見つかりませんでした。'
                    : '해당 위협이 발견되지 않았습니다.'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

