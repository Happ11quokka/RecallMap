import { create } from 'zustand';
import type { Node, GraphNode, ChatMessage } from '@/types';

interface AppState {
  // Session
  sessionId: string;

  // Nodes
  nodes: Node[];
  selectedNode: Node | null;
  setNodes: (nodes: Node[]) => void;
  setSelectedNode: (node: Node | null) => void;

  // Graph
  graphNodes: GraphNode[];
  highlightedNodeId: string | null;
  setGraphNodes: (nodes: GraphNode[]) => void;
  setHighlightedNodeId: (id: string | null) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;

  // UI State
  activeTab: 'network' | 'agent';
  setActiveTab: (tab: 'network' | 'agent') => void;

  // Upload
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useAppStore = create<AppState>((set) => ({
  // Session
  sessionId: generateSessionId(),

  // Nodes
  nodes: [],
  selectedNode: null,
  setNodes: (nodes) => set({ nodes }),
  setSelectedNode: (node) => set({ selectedNode: node }),

  // Graph
  graphNodes: [],
  highlightedNodeId: null,
  setGraphNodes: (nodes) => set({ graphNodes: nodes }),
  setHighlightedNodeId: (id) => set({ highlightedNodeId: id }),

  // Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChatMessages: () => set({ chatMessages: [] }),

  // UI State
  activeTab: 'network',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Upload
  isUploading: false,
  setIsUploading: (value) => set({ isUploading: value }),
}));
