import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node as FlowNode,
  type Edge as FlowEdge,
  type Viewport,
  type EdgeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import { getGraphData } from '@/api/nodes';
import { useAppStore } from '@/store/useAppStore';
import { demoGraphData, nodeClusterMap } from '@/data/demoData';
import type { GraphNode } from '@/types';

// 클러스터별 색상 팔레트
// 데모 모드: 모든 노드가 흰색
// 일반 모드: 클러스터별 색상
const clusterColors = [
  { main: '#5BC0EB', light: 'rgba(91, 192, 235, 0.3)' },  // 하늘색
  { main: '#E63946', light: 'rgba(230, 57, 70, 0.3)' },   // 빨강
  { main: '#F4A261', light: 'rgba(244, 162, 97, 0.3)' },  // 주황
  { main: '#2A9D8F', light: 'rgba(42, 157, 143, 0.3)' },  // 청록
  { main: '#9B5DE5', light: 'rgba(155, 93, 229, 0.3)' },  // 보라
  { main: '#6B705C', light: 'rgba(107, 112, 92, 0.3)' },  // 올리브
  { main: '#A8DADC', light: 'rgba(168, 218, 220, 0.3)' }, // 민트
  { main: '#BDB2FF', light: 'rgba(189, 178, 255, 0.3)' }, // 라벤더
  { main: '#FFB4A2', light: 'rgba(255, 180, 162, 0.3)' }, // 살몬
  { main: '#95D5B2', light: 'rgba(149, 213, 178, 0.3)' }, // 연두
];

// 데모용 클러스터별 색상 (스크린샷 스타일 - 파스텔톤)
const demoClusterColors = [
  { main: '#ffffff', light: 'rgba(255, 255, 255, 0.3)' },      // 클러스터 0: 흰색
  { main: '#DDA0DD', light: 'rgba(221, 160, 221, 0.3)' },      // 클러스터 1: 연보라색
  { main: '#98FB98', light: 'rgba(152, 251, 152, 0.3)' },      // 클러스터 2: 연두색
  { main: '#FFB6C1', light: 'rgba(255, 182, 193, 0.3)' },      // 클러스터 3: 분홍색
  { main: '#FFD700', light: 'rgba(255, 215, 0, 0.3)' },        // 클러스터 4: 노란색
  { main: '#87CEEB', light: 'rgba(135, 206, 235, 0.3)' },      // 클러스터 5: 하늘색
];

interface CustomNodeProps {
  data: {
    label: string;
    summary: string;
    isHighlighted: boolean;
    clusterColor: { main: string; light: string };
    size: number;
    isDemoMode: boolean;
  };
}

function CustomNode({ data }: CustomNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const size = data.size || 24;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ width: size, height: size }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white/95 text-gray-800 text-xs rounded-lg shadow-lg z-50 border border-gray-200"
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            width: 'auto',
            maxWidth: 'fit-content'
          }}
        >
          {data.summary}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/95" />
        </div>
      )}

      {/* Node - 데모: 사각형 흰색, 일반: 원형 색상 */}
      <div
        className={`transition-all cursor-pointer ${
          data.isDemoMode ? '' : 'rounded-full'
        } ${
          data.isHighlighted
            ? 'ring-2 ring-offset-2 scale-125 ' + (data.isDemoMode ? 'ring-white/80' : 'ring-white')
            : 'hover:scale-110 hover:brightness-110'
        }`}
        style={{
          width: size,
          height: size,
          backgroundColor: data.clusterColor.main,
          boxShadow: data.isHighlighted
            ? `0 0 20px ${data.clusterColor.main}`
            : data.isDemoMode
              ? '0 0 8px rgba(255,255,255,0.5)'
              : '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
      {/* 중앙에 연결되는 핸들 */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// 직선 엣지 (이미지 스타일 - 매우 얇고 연한 선)
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}: EdgeProps) {
  // 직선 path
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      fill="none"
    />
  );
}

const edgeTypes = { custom: CustomEdge };

// Union-Find 클러스터링
function findClusters(nodes: GraphNode[], edges: { source: string; target: string; weight: number }[]) {
  const nodeIds = nodes.map(n => n.id);
  const parent: Record<string, string> = {};

  nodeIds.forEach(id => { parent[id] = id; });

  function find(x: string): string {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x: string, y: string) {
    const px = find(x);
    const py = find(y);
    if (px !== py) {
      parent[px] = py;
    }
  }

  edges.forEach(edge => {
    if (edge.weight >= 0.6) {
      union(edge.source, edge.target);
    }
  });

  const clusterMap: Record<string, number> = {};
  let clusterId = 0;

  const result: Record<string, number> = {};
  nodeIds.forEach(id => {
    const root = find(id);
    if (!(root in clusterMap)) {
      clusterMap[root] = clusterId++;
    }
    result[id] = clusterMap[root];
  });

  return result;
}

interface NetworkViewInnerProps {
  onNodeClick?: (nodeId: string) => void;
}

function NetworkViewInner({ onNodeClick }: NetworkViewInnerProps) {
  const { highlightedNodeId, setHighlightedNodeId, isDemoMode } = useAppStore();
  const [edgeOpacity, setEdgeOpacity] = useState(1);
  const basePositionsRef = useRef<Record<string, { x: number; y: number }>>({});
  const centerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastZoomRef = useRef<number>(1);
  const isInitializedRef = useRef(false);

  const { data: serverGraphData, isLoading, error } = useQuery({
    queryKey: ['graph'],
    queryFn: () => getGraphData(),
    refetchInterval: 30000,
    enabled: !isDemoMode, // 데모 모드에서는 서버 호출 안함
  });

  // 데모 모드면 데모 데이터, 아니면 서버 데이터 사용
  const graphData = isDemoMode ? demoGraphData : serverGraphData;

  const { initialNodes, initialEdges, clusterCount } = useMemo(() => {
    if (!graphData?.nodes || !graphData?.edges) {
      return { initialNodes: [], initialEdges: [], clusterCount: 0 };
    }

    // 데모 모드: 명시적 클러스터 매핑 사용, 일반 모드: Union-Find 클러스터링
    const clusters: Record<string, number> = isDemoMode
      ? nodeClusterMap
      : findClusters(graphData.nodes, graphData.edges);

    // 데모 모드: 엣지는 이미 클러스터 간 연결만 있음
    // 일반 모드: 클러스터 간 연결만 필터링
    let filteredEdges = graphData.edges;

    if (!isDemoMode) {
      // 같은 클러스터(강한 연결)와 다른 클러스터(약한 연결) 분리
      const sameClusterEdges = graphData.edges.filter(edge =>
        clusters[edge.source] === clusters[edge.target]
      );
      const crossClusterEdges = graphData.edges.filter(edge =>
        clusters[edge.source] !== clusters[edge.target]
      );

      // 약한 연결(클러스터 간)은 상위 20%만 유지
      const WEAK_EDGE_KEEP_RATIO = 0.20;
      const sortedCrossEdges = [...crossClusterEdges].sort((a, b) => b.weight - a.weight);
      const keepCount = Math.max(1, Math.floor(sortedCrossEdges.length * WEAK_EDGE_KEEP_RATIO));
      const topCrossClusterEdges = sortedCrossEdges.slice(0, keepCount);

      // 강한 연결 전체 + 약한 연결 상위 20% 병합
      filteredEdges = [...sameClusterEdges, ...topCrossClusterEdges];
    }

    const uniqueClusterIds = [...new Set(Object.values(clusters))];
    const clusterCount = uniqueClusterIds.length;

    // 노드별 연결 수 계산 (크기 결정용) - 필터링된 엣지 기준
    const connectionCounts: Record<string, number> = {};
    filteredEdges.forEach(edge => {
      connectionCounts[edge.source] = (connectionCounts[edge.source] || 0) + 1;
      connectionCounts[edge.target] = (connectionCounts[edge.target] || 0) + 1;
    });
    const maxConnections = Math.max(...Object.values(connectionCounts), 1);

    // 클러스터별 노드 그룹화
    const clusterGroups: Record<number, string[]> = {};
    Object.entries(clusters).forEach(([nodeId, clusterId]) => {
      if (!clusterGroups[clusterId]) {
        clusterGroups[clusterId] = [];
      }
      clusterGroups[clusterId].push(nodeId);
    });

    // 클러스터 중심점 계산
    const clusterCenters: Record<number, { x: number; y: number }> = {};

    // 데모 모드: 2x3 그리드 배치 (엣지 교차 최소화)
    // 상단: 0(AI) - 5(데이터) - 1(웹)
    // 하단: 2(창작) - 4(학습) - 3(비즈니스)
    const demoClusterPositions: Record<number, { x: number; y: number }> = {
      0: { x: 150, y: 180 },   // AI/ML - 좌상
      5: { x: 400, y: 150 },   // 데이터 - 중상
      1: { x: 650, y: 180 },   // 웹개발 - 우상
      2: { x: 150, y: 450 },   // 창작 - 좌하
      4: { x: 400, y: 480 },   // 학습 - 중하
      3: { x: 650, y: 450 },   // 비즈니스 - 우하
    };

    // 일반 모드: 원형 배치
    const generalClusterPositions = [
      { x: 400, y: 120 },   // 상단 중앙
      { x: 650, y: 250 },   // 우상단
      { x: 650, y: 450 },   // 우하단
      { x: 400, y: 550 },   // 하단 중앙
      { x: 150, y: 450 },   // 좌하단
      { x: 150, y: 250 },   // 좌상단
      { x: 400, y: 330 },   // 중앙
      { x: 550, y: 330 },   // 우측 중앙
    ];

    uniqueClusterIds.forEach((clusterId) => {
      if (isDemoMode && demoClusterPositions[clusterId]) {
        clusterCenters[clusterId] = demoClusterPositions[clusterId];
      } else {
        const pos = generalClusterPositions[clusterId % generalClusterPositions.length];
        const offsetX = (clusterId * 37) % 40 - 20;
        const offsetY = (clusterId * 53) % 40 - 20;
        clusterCenters[clusterId] = {
          x: pos.x + offsetX,
          y: pos.y + offsetY,
        };
      }
    });

    // 노드 위치 계산
    const nodePositions: Record<string, { x: number; y: number }> = {};

    Object.entries(clusterGroups).forEach(([clusterIdStr, nodeIds]) => {
      const clusterId = parseInt(clusterIdStr);
      const center = clusterCenters[clusterId];
      const count = nodeIds.length;

      nodeIds.forEach((nodeId, index) => {
        if (count === 1) {
          nodePositions[nodeId] = { x: center.x, y: center.y };
        } else if (isDemoMode) {
          // 데모 모드: 더 컴팩트한 원형 배치
          const baseRadius = 55 + count * 3; // 작은 기본 반경

          // 동심원 배치 (안쪽 → 바깥쪽)
          const innerCount = Math.min(count, 4);
          const outerCount = count - innerCount;

          if (index < innerCount) {
            // 안쪽 원 (4개 이하)
            const angle = (index / innerCount) * Math.PI * 2 - Math.PI / 2;
            const radius = innerCount === 1 ? 0 : baseRadius * 0.4;
            nodePositions[nodeId] = {
              x: center.x + Math.cos(angle) * radius,
              y: center.y + Math.sin(angle) * radius,
            };
          } else {
            // 바깥쪽 원
            const outerIndex = index - innerCount;
            const angle = (outerIndex / outerCount) * Math.PI * 2 - Math.PI / 2;
            const radius = baseRadius * 0.85;
            nodePositions[nodeId] = {
              x: center.x + Math.cos(angle) * radius,
              y: center.y + Math.sin(angle) * radius,
            };
          }
        } else {
          // 일반 모드: 골든 앵글 분포
          const connections = connectionCounts[nodeId] || 0;
          const baseRadius = Math.max(60, count * 15);
          const normalizedConnections = connections / maxConnections;
          const radiusMultiplier = 0.3 + (1 - normalizedConnections) * 0.7;
          const radius = baseRadius * radiusMultiplier;

          const goldenAngle = Math.PI * (3 - Math.sqrt(5));
          const angle = index * goldenAngle;

          const jitterX = ((nodeId.charCodeAt(nodeId.length - 1) % 16) - 8);
          const jitterY = ((nodeId.charCodeAt(nodeId.length - 2) % 16) - 8);

          nodePositions[nodeId] = {
            x: center.x + Math.cos(angle) * radius + jitterX,
            y: center.y + Math.sin(angle) * radius + jitterY,
          };
        }
      });
    });

    const nodes: FlowNode[] = graphData.nodes.map((node: GraphNode) => {
      const clusterId = clusters[node.id] || 0;
      // 데모 모드: 클러스터별 파스텔 색상, 일반 모드: 클러스터별 색상
      const clusterColor = isDemoMode
        ? demoClusterColors[clusterId % demoClusterColors.length]
        : clusterColors[clusterId % clusterColors.length];
      const position = nodePositions[node.id] || { x: 0, y: 0 };

      // 데모 모드: 다양한 크기 (6~16px), 일반 모드: 연결 수에 따른 크기
      let size = 20;
      if (isDemoMode) {
        // 노드 ID 기반 랜덤 크기 (일관성 유지)
        const hash = node.id.charCodeAt(node.id.length - 1);
        size = 6 + (hash % 11); // 6~16px 범위
      } else {
        const connections = connectionCounts[node.id] || 0;
        size = 12 + (connections / maxConnections) * 24;
      }

      return {
        id: node.id,
        type: 'custom',
        position,
        data: {
          label: node.label,
          summary: node.summary,
          isHighlighted: node.id === highlightedNodeId,
          clusterColor,
          size,
          isDemoMode,
        },
      };
    });

    // 엣지 생성: 필터링된 엣지만 사용
    const edges: FlowEdge[] = filteredEdges
      .map((edge, index) => {
        const sourceCluster = clusters[edge.source];
        const targetCluster = clusters[edge.target];
        const isSameCluster = sourceCluster === targetCluster;

        // 선택된 노드와 연결된 엣지인지 확인
        const isConnectedToHighlighted = highlightedNodeId &&
          (edge.source === highlightedNodeId || edge.target === highlightedNodeId);

        let opacity = 0;
        let strokeWidth = 1;

        if (isConnectedToHighlighted) {
          // 선택된 노드와 연결된 엣지: 진하게 표시
          opacity = isDemoMode ? 0.8 : 1;
          strokeWidth = isDemoMode ? 1.5 : 3;
        } else if (isDemoMode) {
          // 데모 모드: 얇고 연한 선 (이미지 스타일)
          opacity = 0.25;
          strokeWidth = 0.5;
        } else if (!isSameCluster) {
          // 일반 모드 약한 연결 (클러스터 간): 연하게 표시
          opacity = 0.5;
          strokeWidth = 1;
        }

        return {
          id: `edge-${index}`,
          source: edge.source,
          target: edge.target,
          type: 'custom',
          style: {
            stroke: isDemoMode ? '#7d9cba' : '#9ca3af', // 데모: 연한 파란 회색, 일반: 회색
            strokeWidth,
            opacity,
          },
        };
      });

    return { initialNodes: nodes, initialEdges: edges, clusterCount };
  }, [graphData, highlightedNodeId, isDemoMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 그래프 데이터 변경 시 초기화 플래그 리셋
  useEffect(() => {
    if (graphData?.nodes) {
      isInitializedRef.current = false;
      lastZoomRef.current = 1;
    }
  }, [graphData]);

  // 초기 노드 위치 저장 및 중심점 계산
  useEffect(() => {
    if (initialNodes.length > 0 && !isInitializedRef.current) {
      // 기본 위치 저장
      const positions: Record<string, { x: number; y: number }> = {};
      let sumX = 0;
      let sumY = 0;

      initialNodes.forEach((node) => {
        positions[node.id] = { x: node.position.x, y: node.position.y };
        sumX += node.position.x;
        sumY += node.position.y;
      });

      basePositionsRef.current = positions;
      centerRef.current = {
        x: sumX / initialNodes.length,
        y: sumY / initialNodes.length,
      };
      isInitializedRef.current = true;
    }

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // 줌 레벨에 따라 엣지 투명도 및 노드 간격 조절
  const handleViewportChange = useCallback((viewport: Viewport) => {
    const zoom = viewport.zoom;

    // 줌 0.5 이하면 간선 안보임, 줌 1 이상이면 완전히 보임
    let opacity = 1;
    if (zoom < 0.3) {
      opacity = 0;
    } else if (zoom < 0.8) {
      opacity = (zoom - 0.3) / 0.5; // 0.3~0.8 사이에서 0~1로 변화
    }

    setEdgeOpacity(opacity);

    // 줌 변화량 계산 (기준 줌: 1.0)
    const zoomDelta = zoom - lastZoomRef.current;

    // 줌 변화가 충분히 클 때만 노드 위치 업데이트 (성능 최적화)
    if (Math.abs(zoomDelta) > 0.05 && Object.keys(basePositionsRef.current).length > 0) {
      lastZoomRef.current = zoom;

      // 줌 스케일 팩터: 줌 1.0 기준, 확대하면 노드가 퍼지고 축소하면 모임
      // 줌 0.5 → 스케일 0.7, 줌 1.0 → 스케일 1.0, 줌 2.0 → 스케일 1.5
      const scaleFactor = 0.4 + (zoom * 0.6);
      const center = centerRef.current;

      setNodes((nds) =>
        nds.map((node) => {
          const basePos = basePositionsRef.current[node.id];
          if (!basePos) return node;

          // 중심점으로부터의 거리를 스케일 팩터만큼 조정
          const newX = center.x + (basePos.x - center.x) * scaleFactor;
          const newY = center.y + (basePos.y - center.y) * scaleFactor;

          return {
            ...node,
            position: { x: newX, y: newY },
          };
        })
      );
    }
  }, [setNodes]);

  // 엣지 스타일 업데이트
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          opacity: edgeOpacity,
        },
      }))
    );
  }, [edgeOpacity, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      setHighlightedNodeId(node.id);
      onNodeClick?.(node.id);
    },
    [setHighlightedNodeId, onNodeClick]
  );

  if (isLoading && !isDemoMode) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-nova-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">네트워크 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error && !isDemoMode) {
    console.error('NetworkView error:', error);
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>네트워크를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm mt-2">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (!graphData?.nodes.length) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-2">아직 노드가 없습니다.</p>
          <p className="text-sm text-gray-400">자료를 추가하면 네트워크가 생성됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full" style={{ backgroundColor: isDemoMode ? '#1a2744' : '#f8fafc' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onMove={(_, viewport) => handleViewportChange(viewport)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ backgroundColor: isDemoMode ? '#1a2744' : '#f8fafc' }}
      >
        {!isDemoMode && <Background color="#f8fafc" gap={40} size={1} />}
        <Controls className={isDemoMode ? "bg-slate-800/80 backdrop-blur-sm [&>button]:text-white [&>button]:border-slate-600" : "bg-white/80 backdrop-blur-sm"} />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as CustomNodeProps['data'];
            return data.clusterColor?.main || '#94a3b8';
          }}
          maskColor={isDemoMode ? "rgba(26, 39, 68, 0.9)" : "rgba(255, 255, 255, 0.9)"}
          style={{ backgroundColor: isDemoMode ? '#1a2744' : '#f8fafc' }}
        />
      </ReactFlow>

      {/* 범례 - 데모 모드에서는 숨김 */}
      {!isDemoMode && (
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
        <p className="text-xs font-semibold text-gray-700 mb-3">클러스터 ({clusterCount}개)</p>
        <div className="space-y-2">
          {clusterColors.slice(0, Math.min(clusterCount, 6)).map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color.main }}
              />
              <span className="text-xs text-gray-600">그룹 {index + 1}</span>
            </div>
          ))}
          {clusterCount > 6 && (
            <span className="text-xs text-gray-400">+{clusterCount - 6}개 더</span>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

interface NetworkViewProps {
  onNodeClick?: (nodeId: string) => void;
}

export default function NetworkView({ onNodeClick }: NetworkViewProps) {
  return (
    <ReactFlowProvider>
      <NetworkViewInner onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
}
