import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Network, MessageSquare, Plus, ChevronLeft, X, Sparkles, Search, ArrowRight, CheckCircle } from 'lucide-react';
import NetworkView from '@/components/NetworkView';
import AgentChat from '@/components/AgentChat';
import UploadForm from '@/components/UploadForm';
import NodeCard from '@/components/NodeCard';
import { getNode, deleteNode } from '@/api/nodes';
import { logNodeView } from '@/api/logs';
import { useAppStore } from '@/store/useAppStore';
import { demoNodeDetails } from '@/data/demoData';
import type { Node } from '@/types';

// 온보딩 오버레이 튜토리얼 컴포넌트 - 네트워크 위에 직접 표시
function OnboardingOverlay({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 반투명 오버레이 - 네트워크 영역만 살짝 어둡게 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Step 0: 노드 설명 */}
      {currentStep === 0 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="flex flex-col items-center gap-6">
            {/* 노드 예시 그래픽 */}
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl shadow-blue-500/50 animate-pulse" />
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-2xl shadow-purple-500/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-2xl shadow-green-500/50 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>

            {/* 설명 박스 */}
            <div className="bg-slate-900/95 backdrop-blur-sm border border-violet-500/50 rounded-2xl p-6 shadow-2xl shadow-violet-500/20 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 bg-violet-500 text-white text-xs font-bold rounded-full">
                  Step 1/3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-white" />
                이게 노드예요!
              </h3>
              <p className="text-white/80 text-base leading-relaxed mb-4">
                각 네모(노드)는 저장한 자료입니다.<br/>
                논문, 기사, 메모, 아이디어 등<br/>
                모든 것이 노드가 됩니다.
              </p>
              <p className="text-violet-300 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                노드를 클릭하면 상세 내용을 볼 수 있어요!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: 엣지 설명 */}
      {currentStep === 1 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="flex flex-col items-center gap-6">
            {/* 엣지 예시 그래픽 - 노드들과 연결선 */}
            <div className="relative">
              <svg width="400" height="120" className="drop-shadow-2xl">
                {/* 연결선들 */}
                <line x1="80" y1="60" x2="200" y2="60" stroke="#a78bfa" strokeWidth="3" className="animate-pulse" />
                <line x1="200" y1="60" x2="320" y2="60" stroke="#a78bfa" strokeWidth="3" className="animate-pulse" style={{ animationDelay: '0.3s' }} />

                {/* 노드들 */}
                <rect x="40" y="40" width="40" height="40" rx="6" fill="url(#grad1)" />
                <rect x="180" y="40" width="40" height="40" rx="6" fill="url(#grad2)" />
                <rect x="300" y="40" width="40" height="40" rx="6" fill="url(#grad3)" />

                {/* 그라디언트 정의 */}
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* 설명 박스 */}
            <div className="bg-slate-900/95 backdrop-blur-sm border border-violet-500/50 rounded-2xl p-6 shadow-2xl shadow-violet-500/20 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 bg-violet-500 text-white text-xs font-bold rounded-full">
                  Step 2/3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-10 h-0.5 bg-violet-400 rounded" />
                이게 엣지예요!
              </h3>
              <p className="text-white/80 text-base leading-relaxed mb-4">
                노드 사이의 선(엣지)은<br/>
                자료 간의 연결을 나타냅니다.<br/>
                AI가 관련 자료끼리 자동 연결해요.
              </p>
              <p className="text-violet-300 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                비슷한 색상의 노드는 같은 주제군!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: AI 에이전트 설명 - 오른쪽 채팅 영역 */}
      {currentStep === 2 && (
        <>
          {/* 채팅 영역 하이라이트 - 오른쪽 절반 전체 */}
          <div className="absolute right-0 top-[12%] w-[50%] h-[85%] pointer-events-none">
            <div className="absolute inset-0 border-4 border-violet-400 rounded-lg animate-pulse" />
          </div>

          {/* 화살표 + 설명 박스 */}
          <div className="absolute right-[52%] top-[45%] pointer-events-auto">
            {/* 화살표 SVG */}
            <svg width="100" height="40" className="absolute -right-24 top-8">
              <defs>
                <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa" />
                </marker>
              </defs>
              <path
                d="M 10 20 L 90 20"
                stroke="#a78bfa"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead3)"
              />
            </svg>

            {/* 설명 박스 */}
            <div className="bg-slate-900/95 backdrop-blur-sm border border-violet-500/50 rounded-2xl p-5 shadow-2xl shadow-violet-500/20 max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 bg-violet-500 text-white text-xs font-bold rounded-full">
                  Step 3/3
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-violet-400" />
                AI 에이전트
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                오른쪽 채팅창에서 AI에게 질문하세요!<br/>
                저장된 자료를 기반으로<br/>
                맥락을 이해하고 답변합니다.
              </p>
              <p className="text-violet-300 text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                "한국 시 자료를 정리해줘" 같이 질문해보세요!
              </p>
            </div>
          </div>
        </>
      )}

      {/* 하단 버튼 영역 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center gap-4 bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 shadow-2xl">
          {/* 진행 도트 */}
          <div className="flex gap-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  step === currentStep
                    ? 'bg-violet-500 scale-125'
                    : step < currentStep
                      ? 'bg-violet-400'
                      : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-white/20" />

          <button
            onClick={handleSkip}
            className="text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            건너뛰기
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-sm font-medium hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center gap-2"
          >
            {currentStep === 2 ? '시작하기' : '다음'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MainApp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedNodeDetail, setSelectedNodeDetail] = useState<Node | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const { sessionId, setHighlightedNodeId, isDemoMode, setDemoMode } = useAppStore();

  // 데모 모드 진입 시 튜토리얼 표시 (첫 방문 시)
  useEffect(() => {
    if (isDemoMode) {
      const hasSeenTutorial = localStorage.getItem('nova_demo_tutorial_seen');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [isDemoMode]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('nova_demo_tutorial_seen', 'true');
  };

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
        // 데모 모드에서는 데모 데이터 사용
        if (isDemoMode) {
          const demoNode = demoNodeDetails[nodeId];
          if (demoNode) {
            setSelectedNodeDetail(demoNode as Node);
            setHighlightedNodeId(nodeId);
          }
          return;
        }

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
    [sessionId, queryClient, setHighlightedNodeId, isDemoMode]
  );

  // 홈으로 돌아갈 때 데모 모드 해제
  const handleGoHome = () => {
    setDemoMode(false);
    navigate('/');
  };

  return (
    <div className={`h-screen flex flex-col ${isDemoMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Onboarding Tutorial for Demo Mode */}
      {showTutorial && isDemoMode && (
        <OnboardingOverlay onComplete={handleTutorialComplete} />
      )}

      {/* Header */}
      <header className={`px-4 py-3 ${
        isDemoMode
          ? 'bg-slate-900/90 backdrop-blur-md border-b border-white/10'
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoHome}
              className={`p-2 rounded-lg transition-colors ${
                isDemoMode
                  ? 'hover:bg-white/10 text-white/70 hover:text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className={`w-5 h-5 ${isDemoMode ? '' : 'text-gray-600'}`} />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDemoMode
                  ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                  : ''
              }`}>
                {isDemoMode ? (
                  <Sparkles className="w-5 h-5 text-white" />
                ) : (
                  <Network className="w-6 h-6 text-nova-600" />
                )}
              </div>
              <span className={`text-lg font-bold ${isDemoMode ? 'text-white' : 'text-gray-900'}`}>NOVA</span>
            </div>
            {/* 데모 모드 표시 */}
            {isDemoMode && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-medium text-violet-300">Demo Mode</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 튜토리얼 다시보기 버튼 - 데모 모드에서만 */}
            {isDemoMode && (
              <button
                onClick={() => setShowTutorial(true)}
                className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors"
              >
                가이드 보기
              </button>
            )}
            {/* Add Button - 데모 모드에서는 숨김 */}
            {!isDemoMode && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-nova-600 text-white rounded-lg hover:bg-nova-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">자료 추가</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Network View (50%) */}
        <div className={`w-1/2 relative ${isDemoMode ? 'border-r border-white/10' : 'border-r border-gray-200'}`}>
          <div className={`absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm ${
            isDemoMode
              ? 'bg-slate-800/90 backdrop-blur-sm border border-white/10'
              : 'bg-white/90 backdrop-blur-sm'
          }`}>
            <Network className={`w-4 h-4 ${isDemoMode ? 'text-violet-400' : 'text-nova-600'}`} />
            <span className={`text-sm font-medium ${isDemoMode ? 'text-white' : 'text-gray-700'}`}>Network</span>
          </div>
          <NetworkView onNodeClick={handleNodeClick} />
        </div>

        {/* Right - Agent Chat (50%) */}
        <div className={`w-1/2 flex flex-col ${isDemoMode ? 'bg-slate-900' : ''}`}>
          <div className={`flex items-center gap-2 px-4 py-3 ${
            isDemoMode
              ? 'border-b border-white/10 bg-slate-900'
              : 'border-b border-gray-100 bg-white'
          }`}>
            <MessageSquare className={`w-4 h-4 ${isDemoMode ? 'text-violet-400' : 'text-nova-600'}`} />
            <span className={`text-sm font-medium ${isDemoMode ? 'text-white' : 'text-gray-700'}`}>Agent</span>
          </div>
          <div className={`flex-1 overflow-hidden ${isDemoMode ? 'bg-slate-900' : ''}`}>
            <AgentChat onNodeClick={handleNodeClick} />
          </div>
        </div>
      </div>

      {/* Bottom Panel - Selected Node & Activity Log */}
      {selectedNodeDetail && (
        <div className={`p-4 ${
          isDemoMode
            ? 'border-t border-white/10 bg-slate-800/50 backdrop-blur-sm'
            : 'border-t border-gray-200 bg-white'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setSelectedNodeDetail(null);
                    setHighlightedNodeId(null);
                  }}
                  className={`absolute -top-1 -right-1 p-1 rounded-full transition-colors z-10 ${
                    isDemoMode
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <X className={`w-4 h-4 ${isDemoMode ? 'text-white/70' : 'text-gray-500'}`} />
                </button>
                <NodeCard
                  node={selectedNodeDetail}
                  isSelected
                  onDelete={isDemoMode ? undefined : () => deleteMutation.mutate(selectedNodeDetail.id)}
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
