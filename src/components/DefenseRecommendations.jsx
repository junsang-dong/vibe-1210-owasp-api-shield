import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function DefenseRecommendations({ recommendations }) {
  if (!recommendations) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">⚙️ 방어 아키텍처 추천</h3>

      {/* 인증 */}
      {recommendations.authentication && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold mb-3">🔐 인증 메커니즘</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-400">타입:</span>
              <span className="ml-2 text-white">{recommendations.authentication.type}</span>
            </div>
            <div>
              <span className="text-sm text-gray-400">구현 방법:</span>
              <p className="mt-1 text-gray-300">{recommendations.authentication.implementation}</p>
            </div>
            {recommendations.authentication.code && (
              <div>
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  className="rounded"
                >
                  {recommendations.authentication.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 인가 */}
      {recommendations.authorization && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold mb-3">🔑 인가 패턴</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-400">패턴:</span>
              <span className="ml-2 text-white">{recommendations.authorization.pattern}</span>
            </div>
            <div>
              <span className="text-sm text-gray-400">구현 방법:</span>
              <p className="mt-1 text-gray-300">{recommendations.authorization.implementation}</p>
            </div>
            {recommendations.authorization.code && (
              <div>
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  className="rounded"
                >
                  {recommendations.authorization.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rate Limiting */}
      {recommendations.rateLimit && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold mb-3">⏱️ Rate Limiting</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-400">전략:</span>
              <span className="ml-2 text-white">{recommendations.rateLimit.strategy}</span>
            </div>
            <div>
              <span className="text-sm text-gray-400">설정:</span>
              <span className="ml-2 text-white">{recommendations.rateLimit.config}</span>
            </div>
            {recommendations.rateLimit.code && (
              <div>
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  className="rounded"
                >
                  {recommendations.rateLimit.code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WAF Rules */}
      {recommendations.wafRules && recommendations.wafRules.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold mb-3">🛡️ WAF 룰셋</h4>
          <ul className="space-y-2">
            {recommendations.wafRules.map((rule, index) => (
              <li key={index} className="text-gray-300 pl-4 border-l-2 border-yellow-600">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* API Gateway */}
      {recommendations.apiGateway && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold mb-3">🌐 API Gateway 설정</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-400">제공자:</span>
              <span className="ml-2 text-white">{recommendations.apiGateway.provider}</span>
            </div>
            {recommendations.apiGateway.features && (
              <div>
                <span className="text-sm text-gray-400">기능:</span>
                <ul className="mt-2 space-y-1">
                  {recommendations.apiGateway.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 pl-4">• {feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

