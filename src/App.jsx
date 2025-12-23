import { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import SpecEditor from './components/SpecEditor';
import AnalysisResults from './components/AnalysisResults';
import ThreatModelViewer from './components/ThreatModelViewer';
import DefenseRecommendations from './components/DefenseRecommendations';
import CodeGenerator from './components/CodeGenerator';
import SettingsMenu from './components/SettingsMenu';
import { useLanguage } from './contexts/LanguageContext';
import { getTranslation } from './utils/translations';

// 방패 아이콘 컴포넌트
const ShieldIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

function App() {
  const { language } = useLanguage();
  const [specText, setSpecText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [countdown, setCountdown] = useState(30);

  const handleFileLoad = (content) => {
    setSpecText(content);
    setError(null);
  };

  const handleTextChange = (text) => {
    setSpecText(text);
    setError(null);
  };

  // 샘플 로드는 SpecEditor 컴포넌트에서 직접 처리

  // 카운트다운 타이머
  useEffect(() => {
    let timer;
    if (loading) {
      setCountdown(30);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(30);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [loading]);

  const handleAnalyze = async () => {
    if (!specText.trim()) {
      setError(getTranslation(language, 'step1.error'));
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
        body: JSON.stringify({ openApiSpec: specText, language }),
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

      // 원본 API 스펙도 함께 저장
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
    { id: 'summary', label: `📊 ${getTranslation(language, 'step2.summary')}`, component: AnalysisResults },
    { id: 'vulnerabilities', label: `🔍 ${getTranslation(language, 'step2.vulnerabilities')}`, component: AnalysisResults },
    { id: 'threats', label: `🛡️ ${getTranslation(language, 'step2.threats')}`, component: ThreatModelViewer },
    { id: 'defense', label: `⚙️ ${getTranslation(language, 'step2.defense')}`, component: DefenseRecommendations },
    { id: 'code', label: `💻 ${getTranslation(language, 'step2.code')}`, component: CodeGenerator },
  ];

  return (
    <div className="min-h-screen bg-adaptive-bg text-adaptive-text transition-colors">
      {/* Header */}
      <header className="bg-ocean-blue border-b border-ocean-blue/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
                <ShieldIcon className="w-8 h-8 text-white" />
                {getTranslation(language, 'header.title')}
              </h1>
              <p className="text-white/90">
                {getTranslation(language, 'header.subtitle')}
              </p>
            </div>
            <div className="ml-4">
              <SettingsMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Step 1: Input */}
        {!analysisResult && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
              <h2 className="text-2xl font-bold mb-4">{getTranslation(language, 'step1.title')}</h2>
              
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
                className="mt-6 w-full py-3 bg-ocean-blue hover:bg-ocean-blue/90 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold text-lg text-white transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {getTranslation(language, 'common.analyzing')} ({countdown})
                  </span>
                ) : (
                  getTranslation(language, 'common.analyze')
                )}
              </button>
            </div>

            {loading && (
              <div className="bg-adaptive-surface rounded-lg p-6 border border-adaptive-border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-adaptive-primary rounded-full"></div>
                    <span>🔍 {getTranslation(language, 'step1.parsing')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-adaptive-primary rounded-full"></div>
                    <span>🛡️ {getTranslation(language, 'step1.checking')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-adaptive-primary rounded-full"></div>
                    <span>🧠 {getTranslation(language, 'step1.modeling')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse w-2 h-2 bg-adaptive-primary rounded-full"></div>
                    <span>⚙️ {getTranslation(language, 'step1.generating')}</span>
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
              <h2 className="text-2xl font-bold">{getTranslation(language, 'step2.title')}</h2>
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setSpecText('');
                  setActiveTab('summary');
                }}
                className="px-4 py-2 bg-adaptive-surface hover:bg-adaptive-surface/80 rounded text-adaptive-text border border-adaptive-border"
              >
                {getTranslation(language, 'step2.newAnalysis')}
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-adaptive-border">
              <div className="flex gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                        isActive
                          ? 'border-adaptive-primary text-adaptive-primary'
                          : 'border-transparent text-adaptive-text/70 hover:text-adaptive-text'
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
                    activeTab={activeTab}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-adaptive-border bg-adaptive-bg">
        <div className="container mx-auto px-4">
          <ul className="space-y-2 text-sm text-adaptive-text/80">
            <li>• {getTranslation(language, 'footer.techStack')}: React 18, Vite 5, Tailwind CSS, OpenAI GPT-4o-mini, Vercel, Serverless Functions, OWASP API Top 10</li>
            <li>• {getTranslation(language, 'footer.developerInfo')}: JUN / <a href="mailto:naebon@naver.com" className="text-blue-400 hover:text-blue-300 transition-colors">naebon@naver.com</a> / <a href="https://www.nextplatform.net" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">www.nextplatform.net</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
