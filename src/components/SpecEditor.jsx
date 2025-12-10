import { useState } from 'react';

export default function SpecEditor({ value, onChange, onLoadSample }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-300">
          또는 텍스트로 직접 입력
        </label>
        <div className="flex gap-2">
          <button
            onClick={onLoadSample}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            샘플 로드
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
          >
            {isExpanded ? '접기' : '펼치기'}
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isExpanded ? 'h-96' : 'h-32'
        }`}
        placeholder="OpenAPI 스펙을 JSON 또는 YAML 형식으로 입력하세요..."
      />
    </div>
  );
}

