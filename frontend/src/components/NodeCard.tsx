import { FileText, Lightbulb, BookOpen, StickyNote, ExternalLink, Trash2 } from 'lucide-react';
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

interface NodeCardProps {
  node: Node;
  onClick?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  compact?: boolean;
}

export default function NodeCard({ node, onClick, onDelete, isSelected, compact }: NodeCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`p-3 rounded-lg border cursor-pointer transition-all ${
          isSelected
            ? 'border-nova-500 bg-nova-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-start gap-2">
          <span className={`p-1 rounded ${formatColors[node.format]}`}>
            {formatIcons[node.format]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 line-clamp-2">{node.summary}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border p-4 transition-all ${
        isSelected
          ? 'border-nova-500 shadow-md ring-2 ring-nova-100'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded ${formatColors[node.format]}`}>
            {formatIcons[node.format]}
          </span>
          <span className="text-xs text-gray-500">{formatLabels[node.format]}</span>
        </div>
        <div className="flex items-center gap-1">
          {onClick && (
            <button
              onClick={onClick}
              className="p-1.5 text-gray-400 hover:text-nova-600 transition-colors"
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
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <h4 className="font-medium text-gray-900 mb-2">{node.summary}</h4>

      {/* Text Preview */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{node.text}</p>

      {/* Context */}
      {node.context && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 mb-3">
          맥락: {node.context}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{formatDate(node.created_at)}</span>
        <span className="font-mono">{node.id.slice(0, 12)}</span>
      </div>
    </div>
  );
}
