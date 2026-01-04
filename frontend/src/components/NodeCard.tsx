import { FileText, Lightbulb, BookOpen, StickyNote, ExternalLink, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Node, NodeFormat } from '@/types';

const formatIcons: Record<NodeFormat, React.ReactNode> = {
  article: <FileText className="w-4 h-4" />,
  paper: <BookOpen className="w-4 h-4" />,
  memo: <StickyNote className="w-4 h-4" />,
  idea: <Lightbulb className="w-4 h-4" />,
};

const formatLabels: Record<NodeFormat, string> = {
  article: '기사',
  paper: '논문',
  memo: '메모',
  idea: '아이디어',
};

const formatColors: Record<NodeFormat, string> = {
  article: 'bg-blue-100 text-blue-700',
  paper: 'bg-purple-100 text-purple-700',
  memo: 'bg-yellow-100 text-yellow-700',
  idea: 'bg-green-100 text-green-700',
};

const formatColorsDark: Record<NodeFormat, string> = {
  article: 'bg-blue-500/20 text-blue-400',
  paper: 'bg-purple-500/20 text-purple-400',
  memo: 'bg-yellow-500/20 text-yellow-400',
  idea: 'bg-green-500/20 text-green-400',
};

interface NodeCardProps {
  node: Node;
  onClick?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  compact?: boolean;
}

export default function NodeCard({ node, onClick, onDelete, isSelected, compact }: NodeCardProps) {
  const { isDemoMode } = useAppStore();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const colorClasses = isDemoMode ? formatColorsDark[node.format] : formatColors[node.format];

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`p-3 rounded-lg border cursor-pointer transition-all ${
          isSelected
            ? isDemoMode ? 'border-violet-500 bg-violet-500/10' : 'border-nova-500 bg-nova-50'
            : isDemoMode ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-start gap-2">
          <span className={`p-1 rounded ${colorClasses}`}>
            {formatIcons[node.format]}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm line-clamp-2 ${isDemoMode ? 'text-white' : 'text-gray-900'}`}>{node.summary}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isDemoMode
          ? isSelected
            ? 'bg-slate-800/80 border-violet-500 shadow-lg shadow-violet-500/10 ring-2 ring-violet-500/20'
            : 'bg-slate-800/50 border-white/10 hover:shadow-lg'
          : isSelected
            ? 'bg-white border-nova-500 shadow-md ring-2 ring-nova-100'
            : 'bg-white border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded ${colorClasses}`}>
            {formatIcons[node.format]}
          </span>
          <span className={`text-xs ${isDemoMode ? 'text-white/50' : 'text-gray-500'}`}>{formatLabels[node.format]}</span>
        </div>
        <div className="flex items-center gap-1">
          {onClick && (
            <button
              onClick={onClick}
              className={`p-1.5 transition-colors ${isDemoMode ? 'text-white/40 hover:text-violet-400' : 'text-gray-400 hover:text-nova-600'}`}
              title="상세 보기"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`p-1.5 transition-colors ${isDemoMode ? 'text-white/40 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <h4 className={`font-medium mb-2 ${isDemoMode ? 'text-white' : 'text-gray-900'}`}>{node.summary}</h4>

      {/* Text Preview */}
      <p className={`text-sm line-clamp-3 mb-3 ${isDemoMode ? 'text-white/70' : 'text-gray-600'}`}>{node.text}</p>

      {/* Context */}
      {node.context && (
        <div className={`text-xs rounded px-2 py-1 mb-3 ${isDemoMode ? 'text-white/50 bg-white/5' : 'text-gray-500 bg-gray-50'}`}>
          맥락: {node.context}
        </div>
      )}

      {/* Footer */}
      <div className={`flex items-center justify-between text-xs ${isDemoMode ? 'text-white/40' : 'text-gray-400'}`}>
        <span>{formatDate(node.created_at)}</span>
        <span className="font-mono">{node.id.slice(0, 12)}</span>
      </div>
    </div>
  );
}
