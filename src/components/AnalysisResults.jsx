import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function AnalysisResults({ data, activeTab }) {
  const { language } = useLanguage();
  if (!data) return null;

  const { summary, vulnerabilities, threatModel, recommendations, originalSpec } = data;
  
  // 탭에 따라 표시할 섹션 결정
  const showSummary = activeTab === 'summary';
  const showVulnerabilities = activeTab === 'vulnerabilities';

  // 분석 요약 생성 (JSX 반환)
  const analysisSummary = useMemo(() => {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return <p>{getTranslation(language, 'analysis.noVulnerabilities')}</p>;
    }

    const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const mediumCount = vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
    const lowCount = vulnerabilities.filter(v => v.severity === 'LOW').length;

    // 1. 취약점 분석 핵심: 취약점 발견 결과 요약
    let section1Text = '';
    if (language === 'en') {
      section1Text = `As a result of analyzing this API specification, a total of ${vulnerabilities.length} vulnerabilities were found. `;
      if (criticalCount > 0) {
        section1Text += `It includes ${criticalCount} vulnerabilities with very high severity (CRITICAL), requiring immediate action. `;
      }
      if (highCount > 0) {
        section1Text += `${highCount} vulnerabilities with high (HIGH) severity were found. `;
      }
      if (mediumCount > 0 || lowCount > 0) {
        section1Text += `There are also ${mediumCount} medium and ${lowCount} low severity vulnerabilities. `;
      }
    } else if (language === 'ja') {
      section1Text = `このAPI仕様の分析結果、合計${vulnerabilities.length}個の脆弱性が発見されました。 `;
      if (criticalCount > 0) {
        section1Text += `深刻度が非常に高い(CRITICAL)脆弱性${criticalCount}個が含まれており、即座の対応が必要です。 `;
      }
      if (highCount > 0) {
        section1Text += `高い(HIGH)深刻度の脆弱性${highCount}個が発見されました。 `;
      }
      if (mediumCount > 0 || lowCount > 0) {
        section1Text += `中程度(Medium)${mediumCount}個、低(Low)${lowCount}個の脆弱性も存在します。 `;
      }
    } else {
      section1Text = `이 API 스펙 분석 결과, 총 ${vulnerabilities.length}개의 취약점이 발견되었습니다. `;
      if (criticalCount > 0) {
        section1Text += `심각도가 매우 높은(CRITICAL) 취약점 ${criticalCount}개가 포함되어 있어 즉시 조치가 필요합니다. `;
      }
      if (highCount > 0) {
        section1Text += `높은(HIGH) 심각도 취약점 ${highCount}개가 발견되었습니다. `;
      }
      if (mediumCount > 0 || lowCount > 0) {
        section1Text += `중간(Medium) ${mediumCount}개, 낮음(Low) ${lowCount}개의 취약점도 존재합니다. `;
      }
    }

    // 2. 주요 취약점 목록 (블릿 기호 문장으로 목록화)
    const owaspCategories = [...new Set(vulnerabilities.map(v => v.owaspCategory))];
    const vulnerabilityList = [];
    if (owaspCategories.length > 0) {
      owaspCategories.forEach((category) => {
        const categoryVulns = vulnerabilities.filter(v => v.owaspCategory === category);
        const severityCounts = {
          CRITICAL: categoryVulns.filter(v => v.severity === 'CRITICAL').length,
          HIGH: categoryVulns.filter(v => v.severity === 'HIGH').length,
          MEDIUM: categoryVulns.filter(v => v.severity === 'MEDIUM').length,
          LOW: categoryVulns.filter(v => v.severity === 'LOW').length,
        };
        const severityText = [];
        const countUnit = language === 'en' ? '' : language === 'ja' ? '個' : '개';
        if (severityCounts.CRITICAL > 0) severityText.push(`CRITICAL ${severityCounts.CRITICAL}${countUnit}`);
        if (severityCounts.HIGH > 0) severityText.push(`HIGH ${severityCounts.HIGH}${countUnit}`);
        if (severityCounts.MEDIUM > 0) severityText.push(`MEDIUM ${severityCounts.MEDIUM}${countUnit}`);
        if (severityCounts.LOW > 0) severityText.push(`LOW ${severityCounts.LOW}${countUnit}`);
        
        vulnerabilityList.push(
          <li key={category} className="mb-1">
            • {category} ({severityText.join(', ')})
          </li>
        );
      });
    }

    // 3. 결론: 취약점 대응 방법
    let section3Text = '';
    
    // 위협 모델 요약
    if (threatModel && threatModel.stride) {
      const strideThreats = Object.entries(threatModel.stride)
        .filter(([_, threats]) => threats && threats.length > 0)
        .map(([key]) => key);
      if (strideThreats.length > 0) {
        if (language === 'en') {
          section3Text += `STRIDE threat modeling results confirmed threats such as ${strideThreats.join(', ')}. `;
        } else if (language === 'ja') {
          section3Text += `STRIDE脅威モデリング結果、${strideThreats.join('、')}などの脅威が確認されました。 `;
        } else {
          section3Text += `STRIDE 위협 모델링 결과, ${strideThreats.join(', ')} 등의 위협이 확인되었습니다. `;
        }
      }
    }

    // 방어책 요약 (API 응답 데이터 사용 - 이미 번역됨)
    if (recommendations) {
      // API에서 이미 번역된 텍스트를 사용하므로 추가 번역 불필요
      // 하지만 텍스트가 없는 경우를 대비해 기본 메시지 추가
    }

    return (
      <div className="space-y-4">
        {/* 1. 취약점 분석 핵심 */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-adaptive-text">1. {getTranslation(language, 'analysis.keyAnalysis')}</h4>
          <p className="text-adaptive-text leading-relaxed">{section1Text}</p>
        </div>

        {/* 2. 주요 취약점 목록 */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-adaptive-text">2. {getTranslation(language, 'analysis.vulnerabilityList')}</h4>
          <ul className="list-none space-y-1 text-adaptive-text">
            {vulnerabilityList}
          </ul>
        </div>

        {/* 3. 결론: 취약점 대응 방법 */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-adaptive-text">3. {getTranslation(language, 'analysis.conclusion')}</h4>
          <p className="text-adaptive-text leading-relaxed">{section3Text}</p>
        </div>
      </div>
    );
  }, [vulnerabilities, threatModel, recommendations, language]);

  // API 문서를 라인별로 분할하고 취약점 매칭
  const highlightedLines = useMemo(() => {
    if (!originalSpec || !vulnerabilities || vulnerabilities.length === 0) {
      return originalSpec ? originalSpec.split('\n').map(line => ({ line, severity: null })) : [];
    }

    const lines = originalSpec.split('\n');
    const result = lines.map((line, lineIndex) => {
      let matchedSeverity = null;
      
      // 각 취약점에 대해 라인 매칭
      for (const vuln of vulnerabilities) {
        const { endpoint, method } = vuln;
        
        // 엔드포인트 경로 매칭
        const endpointPattern = endpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (line.includes(endpoint) || line.match(new RegExp(endpointPattern))) {
          matchedSeverity = vuln.severity;
          break;
        }
        
        // HTTP 메서드 매칭
        if (line.toLowerCase().includes(method.toLowerCase() + ':') || 
            line.toLowerCase().includes(method.toLowerCase() + ':')) {
          matchedSeverity = vuln.severity;
          break;
        }
      }
      
      return { line, severity: matchedSeverity, lineNumber: lineIndex + 1 };
    });

    return result;
  }, [originalSpec, vulnerabilities]);

  const getSeverityStyles = (severity) => {
    const styles = {
      CRITICAL: {
        bg: 'bg-red-500/30',
        border: 'border-l-4 border-red-500',
        text: 'text-red-300',
      },
      HIGH: {
        bg: 'bg-orange-500/30',
        border: 'border-l-4 border-orange-500',
        text: 'text-orange-300',
      },
      MEDIUM: {
        bg: 'bg-yellow-500/30',
        border: 'border-l-4 border-yellow-500',
        text: 'text-yellow-300',
      },
      LOW: {
        bg: 'bg-green-500/30',
        border: 'border-l-4 border-green-500',
        text: 'text-green-300',
      },
    };
    return styles[severity] || { bg: '', border: '', text: 'text-adaptive-text' };
  };

  return (
    <div className="space-y-6">
      {/* 분석 요약 모듈 - 요약 탭에만 표시 */}
      {showSummary && (
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
          <h3 className="text-xl font-bold mb-4 text-adaptive-text">📋 {getTranslation(language, 'analysis.summary')}</h3>
          <div className="bg-adaptive-bg rounded-lg p-4 border border-adaptive-border">
            {analysisSummary}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="text-sm text-adaptive-text/70">
              {getTranslation(language, 'analysis.totalVulnerabilities')}: <span className="text-adaptive-text font-semibold">{vulnerabilities?.length || 0}</span>
            </div>
            {summary && (
              <>
                <div className="text-sm text-adaptive-text/70">
                  {getTranslation(language, 'analysis.critical')}: <span className="text-red-600 dark:text-red-400 font-semibold">{summary.criticalIssues || 0}</span>
                </div>
                <div className="text-sm text-adaptive-text/70">
                  {getTranslation(language, 'analysis.high')}: <span className="text-orange-600 dark:text-orange-400 font-semibold">{summary.highIssues || 0}</span>
                </div>
                <div className="text-sm text-adaptive-text/70">
                  {getTranslation(language, 'analysis.medium')}: <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{summary.mediumIssues || 0}</span>
                </div>
                <div className="text-sm text-adaptive-text/70">
                  {getTranslation(language, 'analysis.low')}: <span className="text-green-600 dark:text-green-400 font-semibold">{summary.lowIssues || 0}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 문서 내 취약점 모듈 - 취약점 상세 탭에만 표시 */}
      {showVulnerabilities && (
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-adaptive-text">📄 {getTranslation(language, 'analysis.documentVulnerabilities')}</h3>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-red-500/30 border border-red-500 rounded">Critical</span>
            <span className="px-2 py-1 bg-orange-500/30 border border-orange-500 rounded">High</span>
            <span className="px-2 py-1 bg-yellow-500/30 border border-yellow-500 rounded">Medium</span>
            <span className="px-2 py-1 bg-green-500/30 border border-green-500 rounded">Low</span>
          </div>
        </div>
        
        {originalSpec ? (
          <div className="relative">
            <div className="bg-adaptive-bg rounded-lg border border-adaptive-border overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="text-sm font-mono p-4">
                {highlightedLines.map(({ line, severity, lineNumber }, index) => {
                  const styles = getSeverityStyles(severity);
                  return (
                    <div
                      key={index}
                      className={`${styles.bg} ${styles.border} ${styles.text} px-2 py-0.5 ${
                        severity ? 'font-semibold' : 'text-adaptive-text'
                      }`}
                      title={severity ? `심각도: ${severity}` : ''}
                    >
                      <span className="text-adaptive-text/50 text-xs mr-2">{lineNumber}</span>
                      <span>{line || ' '}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
            
            {/* 취약점 범례 */}
            {vulnerabilities && vulnerabilities.length > 0 && (
              <div className="mt-4 p-4 bg-adaptive-bg rounded-lg border border-adaptive-border">
                <h4 className="text-sm font-semibold mb-2 text-adaptive-text">{getTranslation(language, 'analysis.highlightedVulnerabilities')}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {vulnerabilities.map((vuln, index) => {
                    const severityColors = {
                      CRITICAL: 'bg-red-500/20 border-red-500/50 text-red-400',
                      HIGH: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
                      MEDIUM: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
                      LOW: 'bg-green-500/20 border-green-500/50 text-green-400',
                    };
                    const colorClass = severityColors[vuln.severity] || severityColors.LOW;
                    
                    return (
                      <div
                        key={vuln.id || index}
                        className={`p-2 rounded border ${colorClass} text-sm`}
                      >
                        <div className="font-semibold">{vuln.owaspCategory}</div>
                        <div className="text-xs opacity-80 font-mono">
                          {vuln.method} {vuln.endpoint}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-adaptive-text/70">
            {getTranslation(language, 'analysis.noOriginalSpec')}
          </div>
        )}
        </div>
      )}
    </div>
  );
}
