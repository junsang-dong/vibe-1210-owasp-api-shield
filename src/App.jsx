import { useState } from 'react';
import FileUploader from './components/FileUploader';
import SpecEditor from './components/SpecEditor';
import AnalysisResults from './components/AnalysisResults';
import ThreatModelViewer from './components/ThreatModelViewer';
import DefenseRecommendations from './components/DefenseRecommendations';
import CodeGenerator from './components/CodeGenerator';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [specText, setSpecText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const handleFileLoad = (content) => {
    setSpecText(content);
    setError(null);
  };

  const handleTextChange = (text) => {
    setSpecText(text);
    setError(null);
  };

  // 샘플 로드는 SpecEditor 컴포넌트에서 직접 처리

  const handleAnalyze = async () => {
    if (!specText.trim()) {
      setError('OpenAPI 스펙을 입력하거나 업로드해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ openApiSpec: specText }),
      });

      // 응답이 비어있는지 확인
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('서버가 JSON 응답을 반환하지 않았습니다. 로컬 개발 환경에서는 Vercel CLI를 사용하거나 프로덕션 환경에서 테스트해주세요.');
      }

      // 응답 본문 확인
      const text = await response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('서버로부터 빈 응답을 받았습니다. API 엔드포인트가 제대로 설정되었는지 확인해주세요.');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError, '응답 텍스트:', text);
        throw new Error('서버 응답을 파싱할 수 없습니다. 응답 형식이 올바르지 않습니다.');
      }

      if (!response.ok) {
        throw new Error(data.error || '분석 중 오류가 발생했습니다.');
      }

      // 원본 OpenAPI 스펙도 함께 저장
      setAnalysisResult({
        ...data,
        originalSpec: specText,
      });
      setActiveTab('summary');
    } catch (err) {
      console.error('분석 오류:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('API 서버에 연결할 수 없습니다. 로컬 개발 환경에서는 Vercel CLI를 사용하거나 프로덕션 환경에서 테스트해주세요.');
      } else {
        setError(err.message || '분석 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'summary', label: '📊 요약', component: AnalysisResults },
    { id: 'vulnerabilities', label: '🔍 취약점 상세', component: AnalysisResults },
    { id: 'threats', label: '🛡️ 위협 모델', component: ThreatModelViewer },
    { id: 'defense', label: '⚙️ 방어책', component: DefenseRecommendations },
    { id: 'code', label: '💻 코드', component: CodeGenerator },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">🔒 API Shield Nova</h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI 기반 API 보안 자동 분석기 - OpenAPI 스펙 업로드 → 3분 안에 OWASP 위협 모델링 + 방어 아키텍처 완성
              </p>
            </div>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Step 1: Input */}
        {!analysisResult && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Step 1: OpenAPI 스펙 입력</h2>
              
              <div className="space-y-6">
                <FileUploader onFileLoad={handleFileLoad} onTextChange={handleTextChange} />
                <SpecEditor
                  value={specText}
                  onChange={handleTextChange}
                />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || !specText.trim()}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    분석 중...
                  </span>
                ) : (
                  '🔍 보안 분석 시작'
                )}
              </button>
            </div>

            {loading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>🔍 OpenAPI 스펙 파싱 중...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>🛡️ OWASP Top 10 취약점 검사 중...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>🧠 STRIDE 위협 모델링 수행 중...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>⚙️ 방어 아키텍처 생성 중...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Results */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Step 2: 분석 결과</h2>
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setSpecText('');
                  setActiveTab('summary');
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-800 dark:text-gray-200"
              >
                새로 분석하기
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                        isActive
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {tabs.map((tab) => {
                if (activeTab !== tab.id) return null;
                const Component = tab.component;
                return (
                  <Component
                    key={tab.id}
                    data={analysisResult}
                    threatModel={analysisResult?.threatModel}
                    recommendations={analysisResult?.recommendations}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 기술 스택 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">기술 스택</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded">React 18</span>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded">Vite 5</span>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded">OpenAI GPT-4o-mini</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded">Vercel</span>
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded">Serverless Functions</span>
                  <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded">OWASP API Top 10</span>
                </div>
              </div>
            </div>

            {/* 개발자 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">개발자 정보</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>25.12.10 / 동준상.넥스트플랫폼</p>
                <p>
                  <a 
                    href="mailto:naebon@naver.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    naebon@naver.com
                  </a>
                </p>
                <p>
                  <a 
                    href="https://www.nextplatform.net" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    www.nextplatform.net
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          {/* 하단 저작권 정보 */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-500 text-sm">
            <p>API Shield Nova - OWASP API Security Top 10 기반 자동 보안 분석 도구</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
