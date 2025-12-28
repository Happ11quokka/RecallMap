import type { ActivityLogEntry } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 로컬 스토리지 키
const LOGS_STORAGE_KEY = 'recallmap_session_logs';

// 로컬 스토리지에서 로그 로드
function loadLogs(sessionId: string): ActivityLogEntry[] {
  try {
    const stored = localStorage.getItem(`${LOGS_STORAGE_KEY}_${sessionId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 로컬 스토리지에 로그 저장
function saveLogs(sessionId: string, logs: ActivityLogEntry[]): void {
  try {
    localStorage.setItem(`${LOGS_STORAGE_KEY}_${sessionId}`, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs:', e);
  }
}

export async function logNodeView(nodeId: string, sessionId: string): Promise<void> {
  await delay(50);

  const logs = loadLogs(sessionId);

  // 중복 제거 후 추가
  const filtered = logs.filter(l => l.node_id !== nodeId);
  filtered.unshift({
    node_id: nodeId,
    summary: `Node ${nodeId}`, // 실제로는 노드 정보를 가져와야 함
    viewed_at: new Date().toISOString(),
  });

  saveLogs(sessionId, filtered.slice(0, 50)); // 최대 50개 유지
}

export async function getSessionLogs(sessionId: string): Promise<ActivityLogEntry[]> {
  await delay(100);
  return loadLogs(sessionId);
}

export async function clearSessionLogs(sessionId: string): Promise<void> {
  await delay(100);
  saveLogs(sessionId, []);
}

export async function exportSessionLogs(sessionId: string) {
  await delay(200);
  const logs = loadLogs(sessionId);

  const references = logs.map(log => ({
    id: log.node_id,
    summary: log.summary,
    format: 'memo' as const,
    context: '',
    text_preview: '',
  }));

  return {
    session_id: sessionId,
    exported_at: new Date().toISOString(),
    total_references: references.length,
    references,
  };
}
