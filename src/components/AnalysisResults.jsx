import { useMemo } from 'react';

export default function AnalysisResults({ data }) {
  if (!data) return null;

  const { summary, vulnerabilities, threatModel, recommendations, originalSpec } = data;

  // 300자 한글 요약 생성
  const analysisSummary = useMemo(() => {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return '분석 결과 취약점이 발견되지 않았습니다. 이 API는 보안 모범 사례를 잘 따르고 있습니다.';
    }

    const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const mediumCount = vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
    const lowCount = vulnerabilities.filter(v => v.severity === 'LOW').length;

    let summary = `이 OpenAPI 스펙 분석 결과, 총 ${vulnerabilities.length}개의 취약점이 발견되었습니다. `;
    
    if (criticalCount > 0) {
      summary += `심각도가 매우 높은(CRITICAL) 취약점 ${criticalCount}개가 포함되어 있어 즉시 조치가 필요합니다. `;
    }
    if (highCount > 0) {
      summary += `높은(HIGH) 심각도 취약점 ${highCount}개가 발견되었습니다. `;
    }
    if (mediumCount > 0 || lowCount > 0) {
      summary += `중간(Medium) ${mediumCount}개, 낮음(Low) ${lowCount}개의 취약점도 존재합니다. `;
    }

    // 주요 취약점 유형
    const owaspCategories = [...new Set(vulnerabilities.map(v => v.owaspCategory))];
    if (owaspCategories.length > 0) {
      summary += `주요 취약점 유형으로는 ${owaspCategories.slice(0, 3).join(', ')} 등이 있습니다. `;
    }

    // 위협 모델 요약
    if (threatModel && threatModel.stride) {
      const strideThreats = Object.entries(threatModel.stride)
        .filter(([_, threats]) => threats && threats.length > 0)
        .map(([key]) => key);
      if (strideThreats.length > 0) {
        summary += `STRIDE 위협 모델링 결과, ${strideThreats.join(', ')} 등의 위협이 확인되었습니다. `;
      }
    }

    // 방어책 요약
    if (recommendations) {
      if (recommendations.authentication && recommendations.authentication.type) {
        summary += `인증 방식으로는 ${recommendations.authentication.type}을 권장합니다. `;
      }
      if (recommendations.rateLimit && recommendations.rateLimit.strategy) {
        summary += `Rate Limiting 전략으로 ${recommendations.rateLimit.strategy}를 적용해야 합니다. `;
      }
    }

    // 300자 제한
    if (summary.length > 300) {
      summary = summary.substring(0, 297) + '...';
    }

    return summary;
  }, [vulnerabilities, threatModel, recommendations]);

  // OpenAPI 문서를 라인별로 분할하고 취약점 매칭
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
    return styles[severity] || { bg: '', border: '', text: 'text-gray-100' };
  };

  return (
    <div className="space-y-6">
      {/* 분석 요약 모듈 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">📋 분석 요약</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {analysisSummary}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 취약점: <span className="text-gray-900 dark:text-white font-semibold">{vulnerabilities?.length || 0}개</span>
          </div>
          {summary && (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Critical: <span className="text-red-600 dark:text-red-400 font-semibold">{summary.criticalIssues || 0}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                High: <span className="text-orange-600 dark:text-orange-400 font-semibold">{summary.highIssues || 0}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Medium: <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{summary.mediumIssues || 0}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Low: <span className="text-green-600 dark:text-green-400 font-semibold">{summary.lowIssues || 0}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 문서 내 취약점 모듈 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">📄 문서 내 취약점</h3>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-red-500/30 border border-red-500 rounded">Critical</span>
            <span className="px-2 py-1 bg-orange-500/30 border border-orange-500 rounded">High</span>
            <span className="px-2 py-1 bg-yellow-500/30 border border-yellow-500 rounded">Medium</span>
            <span className="px-2 py-1 bg-green-500/30 border border-green-500 rounded">Low</span>
          </div>
        </div>
        
        {originalSpec ? (
          <div className="relative">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="text-sm font-mono p-4">
                {highlightedLines.map(({ line, severity, lineNumber }, index) => {
                  const styles = getSeverityStyles(severity);
                  return (
                    <div
                      key={index}
                      className={`${styles.bg} ${styles.border} ${styles.text} px-2 py-0.5 ${
                        severity ? 'font-semibold' : 'text-gray-900 dark:text-gray-100'
                      }`}
                      title={severity ? `심각도: ${severity}` : ''}
                    >
                      <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">{lineNumber}</span>
                      <span>{line || ' '}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
            
            {/* 취약점 범례 */}
            {vulnerabilities && vulnerabilities.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">하이라이팅된 취약점:</h4>
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
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            원본 OpenAPI 스펙이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
