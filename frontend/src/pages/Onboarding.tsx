import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Lightbulb,
  BookOpen,
  StickyNote,
  ArrowRight,
  Plus,
  X,
  Network
} from 'lucide-react';
import { createNode } from '@/api/nodes';
import type { NodeFormat } from '@/types';

const formatOptions: { value: NodeFormat; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'article', label: '기사', icon: <FileText className="w-5 h-5" />, description: '뉴스, 블로그 글 등' },
  { value: 'paper', label: '논문', icon: <BookOpen className="w-5 h-5" />, description: '학술 자료, 연구 논문' },
  { value: 'memo', label: '메모', icon: <StickyNote className="w-5 h-5" />, description: '간단한 메모, 노트' },
  { value: 'idea', label: '아이디어', icon: <Lightbulb className="w-5 h-5" />, description: '떠오른 생각, 영감' },
];

interface SourceItem {
  id: string;
  text: string;
  format: NodeFormat;
  context: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [sources, setSources] = useState<SourceItem[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentFormat, setCurrentFormat] = useState<NodeFormat>('memo');
  const [currentContext, setCurrentContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: createNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
    },
  });

  const handleAddSource = () => {
    if (!currentText.trim()) return;

    const newSource: SourceItem = {
      id: `temp-${Date.now()}`,
      text: currentText.trim(),
      format: currentFormat,
      context: currentContext.trim(),
    };

    setSources([...sources, newSource]);
    setCurrentText('');
    setCurrentContext('');
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const handleSubmitAll = async () => {
    if (sources.length === 0) {
      navigate('/app');
      return;
    }

    setIsSubmitting(true);

    try {
      for (const source of sources) {
        await mutation.mutateAsync({
          text: source.text,
          format: source.format,
          context: source.context || undefined,
        });
      }
      navigate('/app');
    } catch (error) {
      console.error('Failed to upload sources:', error);
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-7 h-7 text-nova-600" />
            <span className="text-xl font-bold text-gray-900">NOVA</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            건너뛰기
          </button>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              첫 번째 자료를 추가해보세요
            </h1>
            <p className="text-gray-600">
              저장하고 싶은 텍스트와 맥락을 입력하면 자동으로 네트워크가 생성됩니다.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-nova-600" />
            <div className={`w-16 h-0.5 ${sources.length > 0 ? 'bg-nova-600' : 'bg-gray-300'}`} />
            <div className={`w-3 h-3 rounded-full ${sources.length > 0 ? 'bg-nova-600' : 'bg-gray-300'}`} />
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">자료 형식</label>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCurrentFormat(option.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      currentFormat === option.value
                        ? 'bg-nova-50 border-2 border-nova-500 text-nova-700'
                        : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      currentFormat === option.value ? 'bg-nova-100' : 'bg-white'
                    }`}>
                      {option.icon}
                    </div>
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="저장할 텍스트를 입력하거나 붙여넣기 하세요..."
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nova-500 focus:border-transparent resize-none text-gray-900"
              />
            </div>

            {/* Context Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                맥락 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <input
                type="text"
                value={currentContext}
                onChange={(e) => setCurrentContext(e.target.value)}
                placeholder="이 자료를 어디서 발견했나요? 왜 저장하고 싶나요?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nova-500 focus:border-transparent"
              />
              <p className="mt-2 text-xs text-gray-500">
                예: "트위터에서 발견", "프로젝트 아이디어 회의 중", "책 읽다가 메모"
              </p>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddSource}
              disabled={!currentText.trim()}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              자료 추가
            </button>
          </div>

          {/* Added Sources List */}
          {sources.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">
                추가된 자료 ({sources.length}개)
              </h3>
              <div className="space-y-3">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="p-1.5 bg-white rounded-lg">
                      {formatOptions.find(f => f.value === source.format)?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2">{source.text}</p>
                      {source.context && (
                        <p className="text-xs text-gray-500 mt-1">맥락: {source.context}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveSource(source.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitAll}
            disabled={isSubmitting}
            className="w-full py-4 bg-nova-600 text-white rounded-xl font-semibold hover:bg-nova-700 disabled:bg-nova-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-nova-200"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                {sources.length > 0 ? `${sources.length}개 자료로 시작하기` : '빈 상태로 시작하기'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {sources.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              자료 없이 시작해도 됩니다. 나중에 언제든 추가할 수 있어요.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
