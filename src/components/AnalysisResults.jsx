import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SEVERITY_LEVELS } from '../utils/vulnerabilityPatterns';

export default function AnalysisResults({ data }) {
  if (!data) return null;

  const { summary, vulnerabilities } = data;

  const getSeverityStyles = (severity) => {
    const level = SEVERITY_LEVELS[severity] || SEVERITY_LEVELS.LOW;
    const colorMap = {
      critical: {
        text: 'text-red-500',
        bg: 'bg-red-500/20',
        border: 'border-red-500/50',
      },
      high: {
        text: 'text-orange-500',
        bg: 'bg-orange-500/20',
        border: 'border-orange-500/50',
      },
      medium: {
        text: 'text-yellow-500',
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/50',
      },
      low: {
        text: 'text-green-500',
        bg: 'bg-green-500/20',
        border: 'border-green-500/50',
      },
    };
    return colorMap[level.color] || colorMap.low;
  };

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4">📊 보안 스코어 요약</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-critical">
              {summary.criticalIssues || 0}
            </div>
            <div className="text-sm text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-high">
              {summary.highIssues || 0}
            </div>
            <div className="text-sm text-gray-400">High</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-medium">
              {summary.mediumIssues || 0}
            </div>
            <div className="text-sm text-gray-400">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-low">
              {summary.lowIssues || 0}
            </div>
            <div className="text-sm text-gray-400">Low</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            총 엔드포인트: <span className="text-white">{summary.totalEndpoints || 0}</span>
          </div>
        </div>
      </div>

      {/* 취약점 목록 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">🔍 발견된 취약점</h3>
        {vulnerabilities && vulnerabilities.length > 0 ? (
          vulnerabilities.map((vuln, index) => {
            const styles = getSeverityStyles(vuln.severity);
            return (
            <div
              key={vuln.id || index}
              className={`bg-gray-800 rounded-lg p-6 border-2 ${styles.border}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${styles.text} ${styles.bg}`}>
                      {vuln.severity}
                    </span>
                    <span className="text-lg font-semibold">{vuln.owaspCategory}</span>
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    {vuln.method} {vuln.endpoint}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">문제점</h4>
                  <p className="text-gray-300">{vuln.description}</p>
                </div>

                {vuln.attackScenario && (
                  <div>
                    <h4 className="font-semibold mb-1">공격 시나리오</h4>
                    <p className="text-gray-300 whitespace-pre-line">{vuln.attackScenario}</p>
                  </div>
                )}

                {vuln.cveReference && (
                  <div>
                    <h4 className="font-semibold mb-1">참고 사례</h4>
                    <p className="text-gray-300">{vuln.cveReference}</p>
                  </div>
                )}

                {vuln.stride && vuln.stride.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">STRIDE 분류</h4>
                    <div className="flex flex-wrap gap-2">
                      {vuln.stride.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-400">
            취약점이 발견되지 않았습니다.
          </div>
        )}
      </div>
    </div>
  );
}

