import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot, User, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { sendChatMessage } from '@/api/agent';
import { useAppStore } from '@/store/useAppStore';
import { demoConversations } from '@/data/demoData';
import type { ChatMessage, ReferencedNode } from '@/types';

interface AgentChatProps {
  onNodeClick?: (nodeId: string) => void;
}

export default function AgentChat({ onNodeClick }: AgentChatProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [usedDemoQuestions, setUsedDemoQuestions] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sessionId, chatMessages, addChatMessage, setHighlightedNodeId, isDemoMode } = useAppStore();

  const mutation = useMutation({
    mutationFn: (message: string) => sendChatMessage(message, sessionId),
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        referenced_nodes: data.referenced_nodes,
        timestamp: new Date(),
      };
      addChatMessage(assistantMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    mutation.mutate(input.trim());
    setInput('');
  };

  const handleNodeLinkClick = (node: ReferencedNode) => {
    setHighlightedNodeId(node.id);
    onNodeClick?.(node.id);
  };

  // 데모 모드에서 버튼 클릭 시 자동 대화
  const handleDemoQuestion = (index: number) => {
    if (isTyping) return;

    const conversation = demoConversations[index];

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: conversation.question,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    setUsedDemoQuestions(prev => new Set([...prev, index]));

    // 타이핑 효과
    setIsTyping(true);

    // 1.5초 후 AI 응답 추가
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: conversation.answer,
        referenced_nodes: conversation.referencedNodes,
        timestamp: new Date(),
      };
      addChatMessage(assistantMessage);
      setIsTyping(false);
    }, 1500);
  };

  // 사용 가능한 데모 질문들 (아직 사용하지 않은 것들)
  const availableDemoQuestions = demoConversations.filter((_, index) => !usedDemoQuestions.has(index));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const renderMessageContent = (message: ChatMessage) => {
    // 노드 ID 링크 변환 ([node_xxx] 형식)
    const content = message.content;
    const parts = content.split(/(\[node_[^\]]+\])/g);

    return (
      <div className="space-y-2">
        <p className="whitespace-pre-wrap">
          {parts.map((part, index) => {
            const match = part.match(/\[(node_[^\]]+)\]/);
            if (match) {
              const nodeId = match[1];
              const refNode = message.referenced_nodes?.find((n) => n.id === nodeId);
              return (
                <button
                  key={index}
                  onClick={() =>
                    handleNodeLinkClick(refNode || { id: nodeId, title: nodeId, link: `/nodes/${nodeId}` })
                  }
                  className={`inline-flex items-center gap-1 underline ${
                    isDemoMode ? 'text-violet-400 hover:text-violet-300' : 'text-nova-600 hover:text-nova-700'
                  }`}
                >
                  {refNode?.title || nodeId}
                  <ExternalLink className="w-3 h-3" />
                </button>
              );
            }
            return part;
          })}
        </p>

        {/* 참조 노드 목록 */}
        {message.referenced_nodes && message.referenced_nodes.length > 0 && (
          <div className={`mt-3 pt-3 ${isDemoMode ? 'border-t border-white/10' : 'border-t border-gray-100'}`}>
            <p className={`text-xs mb-2 ${isDemoMode ? 'text-white/50' : 'text-gray-500'}`}>참조된 노드:</p>
            <div className="flex flex-wrap gap-2">
              {message.referenced_nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeLinkClick(node)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    isDemoMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/80'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {node.title.length > 30 ? `${node.title.slice(0, 30)}...` : node.title}
                  <ExternalLink className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${isDemoMode ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDemoMode ? 'dark-scrollbar' : ''}`}>
        {chatMessages.length === 0 && isDemoMode && (
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI 에이전트</h3>
            <p className="text-sm text-white/60 mb-6">
              아래 버튼을 클릭해서 AI 에이전트를 체험해보세요!
            </p>
            <div className="space-y-2">
              {demoConversations.map((conv, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoQuestion(index)}
                  className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl text-left text-sm text-white/80 transition-all hover:shadow-lg hover:shadow-violet-500/10"
                >
                  <span className="font-medium">{conv.question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.length === 0 && !isDemoMode && (
          <div className="text-center text-gray-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">무엇이든 물어보세요!</p>
            <p className="text-xs mt-1">
              예: "주제별로 분류해줘", "약한 연결을 찾아줘"
            </p>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? isDemoMode ? 'bg-violet-500/20' : 'bg-nova-100'
                  : isDemoMode ? 'bg-white/10' : 'bg-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <User className={`w-4 h-4 ${isDemoMode ? 'text-violet-400' : 'text-nova-600'}`} />
              ) : (
                <Bot className={`w-4 h-4 ${isDemoMode ? 'text-white/70' : 'text-gray-600'}`} />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? isDemoMode ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'bg-nova-600 text-white'
                  : isDemoMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'user' ? (
                <p>{message.content}</p>
              ) : (
                renderMessageContent(message)
              )}
            </div>
          </div>
        ))}

        {(mutation.isPending || isTyping) && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDemoMode ? 'bg-white/10' : 'bg-gray-100'}`}>
              <Bot className={`w-4 h-4 ${isDemoMode ? 'text-white/70' : 'text-gray-600'}`} />
            </div>
            <div className={`rounded-2xl px-4 py-3 ${isDemoMode ? 'bg-white/10' : 'bg-gray-100'}`}>
              <Loader2 className={`w-5 h-5 animate-spin ${isDemoMode ? 'text-violet-400' : 'text-gray-400'}`} />
            </div>
          </div>
        )}

        {/* 데모 모드: 대화 후 추가 질문 버튼 */}
        {isDemoMode && chatMessages.length > 0 && availableDemoQuestions.length > 0 && !isTyping && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 mb-3 text-center">더 궁금한 게 있으신가요?</p>
            <div className="space-y-2">
              {availableDemoQuestions.slice(0, 3).map((conv, _) => {
                const originalIndex = demoConversations.findIndex(d => d.question === conv.question);
                return (
                  <button
                    key={originalIndex}
                    onClick={() => handleDemoQuestion(originalIndex)}
                    className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 rounded-lg text-left text-sm text-white/70 transition-colors"
                  >
                    {conv.question}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - 데모 모드에서는 숨김 */}
      {!isDemoMode && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="질문을 입력하세요..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nova-500 focus:border-transparent"
              disabled={mutation.isPending}
            />
            <button
              type="submit"
              disabled={!input.trim() || mutation.isPending}
              className="px-4 py-2 bg-nova-600 text-white rounded-lg hover:bg-nova-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      {/* 데모 모드 안내 */}
      {isDemoMode && (
        <div className="p-3 border-t border-white/10 bg-gradient-to-r from-violet-500/10 to-indigo-500/10">
          <div className="flex items-center justify-center gap-2 text-xs text-white/50">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>60개의 문학 자료를 AI로 분석한 결과를 체험해보세요</span>
          </div>
        </div>
      )}
    </div>
  );
}
