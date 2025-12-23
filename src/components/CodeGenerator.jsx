import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function CodeGenerator({ recommendations }) {
  const { language } = useLanguage();
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
      const markdown = `# ${getTranslation(language, 'code.title')}\n\n\`\`\`yaml\n${improvedSpec}\n\`\`\``;
      downloadFile(markdown, 'improved-openapi-spec.md', 'text/markdown');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">💻 {getTranslation(language, 'code.title')}</h3>
        {improvedSpec && (
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload('json')}
              className="px-4 py-2 bg-adaptive-primary hover:bg-adaptive-primary/90 rounded text-sm text-white"
            >
              {getTranslation(language, 'code.jsonDownload')}
            </button>
            <button
              onClick={() => handleDownload('yaml')}
              className="px-4 py-2 bg-adaptive-primary hover:bg-adaptive-primary/90 rounded text-sm text-white"
            >
              {getTranslation(language, 'code.yamlDownload')}
            </button>
            <button
              onClick={() => handleDownload('markdown')}
              className="px-4 py-2 bg-adaptive-primary hover:bg-adaptive-primary/90 rounded text-sm text-white"
            >
              {getTranslation(language, 'code.markdownDownload')}
            </button>
          </div>
        )}
      </div>

      {improvedSpec ? (
        <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFormat('openapi')}
                className={`px-4 py-2 rounded text-sm ${
                  selectedFormat === 'openapi'
                    ? 'bg-adaptive-primary text-white'
                    : 'bg-adaptive-surface border border-adaptive-border text-adaptive-text hover:bg-adaptive-surface/80'
                }`}
              >
                {getTranslation(language, 'code.apiSpec')}
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
        <div className="text-center py-8 text-adaptive-text/70">
          {getTranslation(language, 'code.noImprovedSpec')}
        </div>
      )}
    </div>
  );
}

