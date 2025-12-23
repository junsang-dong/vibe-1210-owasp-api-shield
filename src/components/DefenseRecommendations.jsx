import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function DefenseRecommendations({ recommendations }) {
  const { language } = useLanguage();
  if (!recommendations) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black dark:text-adaptive-text">⚙️ {getTranslation(language, 'defense.title')}</h3>

      {/* 인증 */}
      {recommendations.authentication && (
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
          <h4 className="text-lg font-semibold mb-3 text-black dark:text-adaptive-text">🔐 {getTranslation(language, 'defense.authentication')}</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-black dark:text-adaptive-text/70">{getTranslation(language, 'defense.type')}:</span>
              <span className="ml-2 text-black dark:text-white">{recommendations.authentication.type}</span>
            </div>
            <div>
              <span className="text-sm text-black dark:text-gray-400">구현 방법:</span>
              <p className="mt-1 text-black dark:text-adaptive-text">{recommendations.authentication.implementation}</p>
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
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
          <h4 className="text-lg font-semibold mb-3 text-black dark:text-adaptive-text">🔑 {getTranslation(language, 'defense.authorization')}</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-black dark:text-gray-400">{getTranslation(language, 'defense.pattern')}:</span>
              <span className="ml-2 text-black dark:text-white">{recommendations.authorization.pattern}</span>
            </div>
            <div>
              <span className="text-sm text-black dark:text-gray-400">{getTranslation(language, 'defense.implementation')}:</span>
              <p className="mt-1 text-black dark:text-adaptive-text">{recommendations.authorization.implementation}</p>
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
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
          <h4 className="text-lg font-semibold mb-3 text-black dark:text-adaptive-text">⏱️ {getTranslation(language, 'defense.rateLimit')}</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-black dark:text-gray-400">{getTranslation(language, 'defense.strategy')}:</span>
              <span className="ml-2 text-black dark:text-white">{recommendations.rateLimit.strategy}</span>
            </div>
            <div>
              <span className="text-sm text-black dark:text-gray-400">{getTranslation(language, 'defense.config')}:</span>
              <span className="ml-2 text-black dark:text-white">{recommendations.rateLimit.config}</span>
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
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
          <h4 className="text-lg font-semibold mb-3 text-black dark:text-adaptive-text">🛡️ {getTranslation(language, 'defense.wafRules')}</h4>
          <ul className="space-y-2">
            {recommendations.wafRules.map((rule, index) => (
                    <li key={index} className="text-black dark:text-adaptive-text pl-4 border-l-2 border-adaptive-primary">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* API Gateway */}
      {recommendations.apiGateway && (
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
          <h4 className="text-lg font-semibold mb-3 text-black dark:text-adaptive-text">🌐 {getTranslation(language, 'defense.apiGateway')}</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-black dark:text-gray-400">{getTranslation(language, 'defense.provider')}:</span>
              <span className="ml-2 text-black dark:text-white">{recommendations.apiGateway.provider}</span>
            </div>
            {recommendations.apiGateway.features && (
              <div>
                <span className="text-sm text-black dark:text-gray-400">{getTranslation(language, 'defense.features')}:</span>
                <ul className="mt-2 space-y-1">
                  {recommendations.apiGateway.features.map((feature, index) => (
                    <li key={index} className="text-black dark:text-adaptive-text pl-4">• {feature}</li>
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

