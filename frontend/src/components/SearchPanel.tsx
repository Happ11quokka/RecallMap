import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Search, Loader2, Sparkles, FileText, ExternalLink } from 'lucide-react';
import { searchDocuments, composeAnswer, type SearchResultItem } from '@/api/backend';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [project, setProject] = useState('');
  const [searchScope, setSearchScope] = useState<'summary' | 'content' | 'both'>('both');
  const [useRerank, setUseRerank] = useState(true);
  const [topK, setTopK] = useState(10);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [answer, setAnswer] = useState<{ answer: string; highlights: string[] } | null>(null);

  const searchMutation = useMutation({
    mutationFn: () =>
      searchDocuments({
        query,
        project: project || undefined,
        search_scope: searchScope,
        top_k: topK,
        use_rerank: useRerank,
      }),
    onSuccess: (data) => {
      setSearchResults(data.results);
      setAnswer(null);
      console.log('Search results:', data);
    },
  });

  const answerMutation = useMutation({
    mutationFn: () =>
      composeAnswer({
        query,
        top_results: searchResults,
        max_results_to_use: 3,
      }),
    onSuccess: (data) => {
      setAnswer({ answer: data.answer, highlights: data.highlights });
      console.log('Answer:', data);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchMutation.mutate();
  };

  const handleGenerateAnswer = () => {
    if (searchResults.length === 0) return;
    answerMutation.mutate();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-nova-600" />
          <h3 className="font-semibold text-gray-900">문서 검색</h3>
        </div>

        {/* 검색어 입력 */}
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="자연어로 검색하세요... (예: 비 오는 날 감성적인 글)"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent"
          />
        </div>

        {/* 옵션들 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 프로젝트 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 필터
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500"
            >
              <option value="">전체</option>
              <option value="work">업무</option>
              <option value="tech">기술</option>
              <option value="personal">개인</option>
              <option value="other">기타</option>
            </select>
          </div>

          {/* 검색 범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색 범위</label>
            <select
              value={searchScope}
              onChange={(e) => setSearchScope(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500"
            >
              <option value="both">요약 + 원문</option>
              <option value="summary">요약만</option>
              <option value="content">원문만</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Top K */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결과 개수: {topK}
            </label>
            <input
              type="range"
              min="3"
              max="20"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Rerank 토글 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">재랭킹</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRerank}
                onChange={(e) => setUseRerank(e.target.checked)}
                className="w-5 h-5 text-nova-600 rounded focus:ring-nova-500"
              />
              <span className="text-sm text-gray-700">
                {useRerank ? '사용 (정확도 향상)' : '사용 안 함'}
              </span>
            </label>
          </div>
        </div>

        {/* 검색 버튼 */}
        <button
          type="submit"
          disabled={!query.trim() || searchMutation.isPending}
          className="w-full py-3 bg-nova-600 text-white rounded-lg font-medium hover:bg-nova-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {searchMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              검색 중...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              검색
            </>
          )}
        </button>
      </form>

      {/* 답변 생성 섹션 */}
      {answer && (
        <div className="p-4 bg-gradient-to-br from-nova-50 to-purple-50 rounded-lg border border-nova-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-nova-600" />
            <h4 className="font-semibold text-gray-900">AI 답변</h4>
          </div>
          <p className="text-gray-800 mb-3">{answer.answer}</p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">핵심 포인트:</p>
            {answer.highlights.map((highlight, i) => (
              <p key={i} className="text-sm text-gray-700 pl-4">
                • {highlight}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              검색 결과 ({searchResults.length}개)
            </h4>
            {!answer && (
              <button
                onClick={handleGenerateAnswer}
                disabled={answerMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
              >
                {answerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    답변 생성
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={result.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-nova-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-nova-600">
                        #{index + 1}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {result.project}
                      </span>
                      {result.filename && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {result.filename}
                        </span>
                      )}
                    </div>
                    <h5 className="font-medium text-gray-900">{result.summary}</h5>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {(result.score * 100).toFixed(0)}%
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{result.preview}</p>

                {result.keywords && result.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {result.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}

                {result.evidence && (
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <p className="text-xs text-purple-700 flex items-start gap-1">
                      <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">Evidence: {result.evidence}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {searchMutation.isError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          검색 실패: {(searchMutation.error as Error).message}
        </div>
      )}

      {answerMutation.isError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          답변 생성 실패: {(answerMutation.error as Error).message}
        </div>
      )}
    </div>
  );
}
