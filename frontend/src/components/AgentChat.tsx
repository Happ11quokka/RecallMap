import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot, User, Loader2, ExternalLink } from 'lucide-react';
import { sendChatMessage } from '@/api/agent';
import { useAppStore } from '@/store/useAppStore';
import type { ChatMessage, ReferencedNode } from '@/types';

interface AgentChatProps {
  onNodeClick?: (nodeId: string) => void;
}

export default function AgentChat({ onNodeClick }: AgentChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sessionId, chatMessages, addChatMessage, setHighlightedNodeId } = useAppStore();

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
                  className="inline-flex items-center gap-1 text-nova-600 hover:text-nova-700 underline"
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
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">참조된 노드:</p>
            <div className="flex flex-wrap gap-2">
              {message.referenced_nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeLinkClick(node)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors"
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
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
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
                message.role === 'user' ? 'bg-nova-100' : 'bg-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-nova-600" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-nova-600 text-white'
                  : 'bg-gray-100 text-gray-900'
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

        {mutation.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
    </div>
  );
}
