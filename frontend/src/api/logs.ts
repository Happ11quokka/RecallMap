import type { ActivityLogEntry } from '@/types';
import { loadLogs, saveLogs, loadNodes } from '@/mocks/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function logNodeView(nodeId: string, sessionId: string): Promise<void> {
  await delay(50);

  const logs = loadLogs(sessionId);
  const nodes = loadNodes();
  const node = nodes.find(n => n.id === nodeId);

  if (node) {
    // 중복 제거 후 추가
    const filtered = logs.filter(l => l.node_id !== nodeId);
    filtered.unshift({
      node_id: nodeId,
      summary: node.summary,
      viewed_at: new Date().toISOString(),
    });

    saveLogs(sessionId, filtered.slice(0, 50)); // 최대 50개 유지
  }
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
  const nodes = loadNodes();

  const references = logs.map(log => {
    const node = nodes.find(n => n.id === log.node_id);
    return {
      id: log.node_id,
      summary: log.summary,
      format: node?.format || 'memo',
      context: node?.context || '',
      text_preview: node?.text.slice(0, 200) || '',
    };
  });

  return {
    session_id: sessionId,
    exported_at: new Date().toISOString(),
    total_references: references.length,
    references,
  };
}
