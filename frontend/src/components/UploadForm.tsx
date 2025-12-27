import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, Lightbulb, BookOpen, StickyNote } from 'lucide-react';
import { createNode } from '@/api/nodes';
import type { NodeFormat } from '@/types';

const formatOptions: { value: NodeFormat; label: string; icon: React.ReactNode }[] = [
  { value: 'article', label: '기사', icon: <FileText className="w-4 h-4" /> },
  { value: 'paper', label: '논문', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'memo', label: '메모', icon: <StickyNote className="w-4 h-4" /> },
  { value: 'idea', label: '아이디어', icon: <Lightbulb className="w-4 h-4" /> },
];

interface UploadFormProps {
  onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [text, setText] = useState('');
  const [format, setFormat] = useState<NodeFormat>('memo');
  const [context, setContext] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      setText('');
      setContext('');
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    mutation.mutate({
      text: text.trim(),
      format,
      context: context.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-nova-600" />
        <h3 className="font-semibold text-gray-900">새 자료 추가</h3>
      </div>

      <div className="space-y-4">
        {/* 형식 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">자료 형식</label>
          <div className="flex gap-2">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormat(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  format === option.value
                    ? 'bg-nova-100 text-nova-700 border-nova-300 border'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 텍스트 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="저장할 텍스트를 입력하세요..."
            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent resize-none"
          />
        </div>

        {/* 맥락 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            맥락 <span className="text-gray-400 font-normal">(선택)</span>
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="이 자료를 접한 상황이나 배경..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={!text.trim() || mutation.isPending}
          className="w-full py-3 bg-nova-600 text-white rounded-lg font-medium hover:bg-nova-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? '저장 중...' : '노드로 저장'}
        </button>

        {/* 성공 메시지 */}
        {mutation.isSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            노드가 성공적으로 저장되었습니다!
          </div>
        )}

        {/* 에러 메시지 */}
        {mutation.isError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            저장 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        )}
      </div>
    </form>
  );
}
