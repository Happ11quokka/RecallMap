import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Network, MessageSquare, Plus, ChevronLeft, X } from 'lucide-react';
import NetworkView from '@/components/NetworkView';
import AgentChat from '@/components/AgentChat';
import UploadForm from '@/components/UploadForm';
import NodeCard from '@/components/NodeCard';
import { getNode, deleteNode } from '@/api/nodes';
import { logNodeView } from '@/api/logs';
import { useAppStore } from '@/store/useAppStore';
import type { Node } from '@/types';

export default function MainApp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedNodeDetail, setSelectedNodeDetail] = useState<Node | null>(null);

  const { sessionId, setHighlightedNodeId } = useAppStore();

  const deleteMutation = useMutation({
    mutationFn: deleteNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      setSelectedNodeDetail(null);
    },
  });

  const handleNodeClick = useCallback(
    async (nodeId: string) => {
      try {
        const node = await getNode(nodeId);
        setSelectedNodeDetail(node);
        setHighlightedNodeId(nodeId);

        // 조회 로그 기록
        await logNodeView(nodeId, sessionId);
        queryClient.invalidateQueries({ queryKey: ['sessionLogs', sessionId] });
      } catch (error) {
        console.error('Failed to fetch node:', error);
      }
    },
    [sessionId, queryClient, setHighlightedNodeId]
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Network className="w-6 h-6 text-nova-600" />
              <span className="text-lg font-bold text-gray-900">NOVA</span>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-nova-600 text-white rounded-lg hover:bg-nova-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">자료 추가</span>
          </button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Network View (50%) */}
        <div className="w-1/2 border-r border-gray-200 relative">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
            <Network className="w-4 h-4 text-nova-600" />
            <span className="text-sm font-medium text-gray-700">Network</span>
          </div>
          <NetworkView onNodeClick={handleNodeClick} />
        </div>

        {/* Right - Agent Chat (50%) */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white">
            <MessageSquare className="w-4 h-4 text-nova-600" />
            <span className="text-sm font-medium text-gray-700">Agent</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <AgentChat onNodeClick={handleNodeClick} />
          </div>
        </div>
      </div>

      {/* Bottom Panel - Selected Node & Activity Log */}
      {selectedNodeDetail && (
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setSelectedNodeDetail(null);
                    setHighlightedNodeId(null);
                  }}
                  className="absolute -top-1 -right-1 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <NodeCard
                  node={selectedNodeDetail}
                  isSelected
                  onDelete={() => deleteMutation.mutate(selectedNodeDetail.id)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg">
            <div className="relative">
              <button
                onClick={() => setShowUploadForm(false)}
                className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <UploadForm onSuccess={() => setShowUploadForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
