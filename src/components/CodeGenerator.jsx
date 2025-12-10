import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

export default function CodeGenerator({ recommendations }) {
  const [selectedFormat, setSelectedFormat] = useState('openapi');

  if (!recommendations) return null;

  const improvedSpec = recommendations.improvedOpenApiSpec;

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (format) => {
    if (!improvedSpec) return;

    if (format === 'json') {
      try {
        const json = typeof improvedSpec === 'string' ? improvedSpec : JSON.stringify(improvedSpec, null, 2);
        downloadFile(json, 'improved-openapi-spec.json', 'application/json');
      } catch (e) {
        alert('JSON 변환 실패');
      }
    } else if (format === 'yaml') {
      downloadFile(improvedSpec, 'improved-openapi-spec.yaml', 'text/yaml');
    } else if (format === 'markdown') {
      const markdown = `# 개선된 OpenAPI 스펙\n\n\`\`\`yaml\n${improvedSpec}\n\`\`\``;
      downloadFile(markdown, 'improved-openapi-spec.md', 'text/markdown');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">💻 개선 코드 생성</h3>
        {improvedSpec && (
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload('json')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              JSON 다운로드
            </button>
            <button
              onClick={() => handleDownload('yaml')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              YAML 다운로드
            </button>
            <button
              onClick={() => handleDownload('markdown')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Markdown 다운로드
            </button>
          </div>
        )}
      </div>

      {improvedSpec ? (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFormat('openapi')}
                className={`px-4 py-2 rounded text-sm ${
                  selectedFormat === 'openapi'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                OpenAPI 스펙
              </button>
            </div>
          </div>

          <div className="mt-4">
            <SyntaxHighlighter
              language="yaml"
              style={vscDarkPlus}
              className="rounded"
              customStyle={{ maxHeight: '600px', overflow: 'auto' }}
            >
              {typeof improvedSpec === 'string' ? improvedSpec : JSON.stringify(improvedSpec, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          개선된 OpenAPI 스펙이 생성되지 않았습니다.
        </div>
      )}
    </div>
  );
}

