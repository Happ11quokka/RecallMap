import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { History, Download, Trash2, ExternalLink } from 'lucide-react';
import { getSessionLogs, clearSessionLogs, exportSessionLogs } from '@/api/logs';
import { useAppStore } from '@/store/useAppStore';

interface ActivityLogProps {
  onNodeClick?: (nodeId: string) => void;
}

export default function ActivityLog({ onNodeClick }: ActivityLogProps) {
  const { sessionId, setHighlightedNodeId } = useAppStore();
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['sessionLogs', sessionId],
    queryFn: () => getSessionLogs(sessionId),
    refetchInterval: 10000,
  });

  const clearMutation = useMutation({
    mutationFn: () => clearSessionLogs(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionLogs', sessionId] });
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => exportSessionLogs(sessionId),
    onSuccess: (data) => {
      // JSON 다운로드
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nova-references-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  const handleNodeClick = (nodeId: string) => {
    setHighlightedNodeId(nodeId);
    onNodeClick?.(nodeId);
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-nova-600" />
          <h3 className="font-semibold text-gray-900">참고한 노드</h3>
          {logs && logs.length > 0 && (
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {logs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending || !logs?.length}
            className="p-1.5 text-gray-400 hover:text-nova-600 disabled:opacity-50 transition-colors"
            title="내보내기"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => clearMutation.mutate()}
            disabled={clearMutation.isPending || !logs?.length}
            className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
            title="기록 지우기"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400 text-sm">로딩 중...</div>
        ) : !logs?.length ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            아직 참고한 노드가 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {logs.map((log) => (
              <li key={`${log.node_id}-${log.viewed_at}`}>
                <button
                  onClick={() => handleNodeClick(log.node_id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 line-clamp-2 group-hover:text-nova-600">
                      {log.summary}
                    </p>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-nova-500 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(log.viewed_at)}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
