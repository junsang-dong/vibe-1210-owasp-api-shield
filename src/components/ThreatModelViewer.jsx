import { STRIDE_CATEGORIES } from '../utils/vulnerabilityPatterns';

export default function ThreatModelViewer({ threatModel }) {
  if (!threatModel || !threatModel.stride) return null;

  const { stride } = threatModel;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">🛡️ STRIDE 위협 모델링 결과</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(STRIDE_CATEGORIES).map(([key, label]) => {
          const threats = stride[key] || [];
          
          return (
            <div
              key={key}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <h4 className="text-lg font-semibold mb-3">{label}</h4>
              {threats.length > 0 ? (
                <ul className="space-y-2">
                  {threats.map((threat, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-300 pl-4 border-l-2 border-blue-600"
                    >
                      {typeof threat === 'string' ? threat : threat.description || JSON.stringify(threat)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">해당 위협이 발견되지 않았습니다.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

