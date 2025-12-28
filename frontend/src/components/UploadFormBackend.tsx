import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText } from 'lucide-react';
import { uploadText } from '@/api/backend';

const projectOptions = [
  { value: 'work', label: '업무', color: 'bg-blue-100 text-blue-700' },
  { value: 'tech', label: '기술', color: 'bg-purple-100 text-purple-700' },
  { value: 'personal', label: '개인', color: 'bg-green-100 text-green-700' },
  { value: 'other', label: '기타', color: 'bg-gray-100 text-gray-700' },
];

interface UploadFormBackendProps {
  onSuccess?: () => void;
}

export default function UploadFormBackend({ onSuccess }: UploadFormBackendProps) {
  const [text, setText] = useState('');
  const [project, setProject] = useState('personal');
  const [filename, setFilename] = useState('');
  const [uploadMode, setUploadMode] = useState<'text' | 'file'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (uploadMode === 'file' && selectedFile) {
        const { uploadFile } = await import('@/api/backend');
        return uploadFile(selectedFile, project);
      } else {
        return uploadText({
          text: text.trim(),
          project,
          filename: filename.trim() || undefined,
        });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setText('');
      setFilename('');
      setSelectedFile(null);
      onSuccess?.();
      console.log('Document uploaded:', data);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.txt')) {
        alert('txt 파일만 업로드 가능합니다.');
        return;
      }
      setSelectedFile(file);
      setFilename(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadMode === 'file' && !selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    if (uploadMode === 'text' && !text.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-nova-600" />
        <h3 className="font-semibold text-gray-900">문서 업로드</h3>
      </div>

      <div className="space-y-4">
        {/* 업로드 모드 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">업로드 방식</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUploadMode('text')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                uploadMode === 'text'
                  ? 'bg-nova-100 text-nova-700 border-nova-300 border'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              텍스트 입력
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                uploadMode === 'file'
                  ? 'bg-nova-100 text-nova-700 border-nova-300 border'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-1" />
              파일 업로드
            </button>
          </div>
        </div>

        {/* 프로젝트 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트</label>
          <div className="flex gap-2">
            {projectOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProject(option.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  project === option.value
                    ? option.color + ' border-2'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 파일 업로드 모드 */}
        {uploadMode === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">파일 선택</label>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                선택된 파일: {selectedFile.name}
              </p>
            )}
          </div>
        )}

        {/* 텍스트 입력 모드 */}
        {uploadMode === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일명 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="예: my_note.txt"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="저장할 텍스트를 입력하세요..."
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent resize-none"
              />
            </div>
          </>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 bg-nova-600 text-white rounded-lg font-medium hover:bg-nova-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? '업로드 중...' : '기억으로 저장'}
        </button>

        {/* 성공 메시지 */}
        {mutation.isSuccess && mutation.data && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
            <p className="font-semibold text-green-800 mb-2">업로드 성공!</p>
            <p className="text-green-700">요약: {mutation.data.summary}</p>
            <p className="text-green-700 mt-1">
              키워드: {mutation.data.keywords.join(', ')}
            </p>
          </div>
        )}

        {/* 에러 메시지 */}
        {mutation.isError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            업로드 실패: {(mutation.error as Error).message}
          </div>
        )}
      </div>
    </form>
  );
}
