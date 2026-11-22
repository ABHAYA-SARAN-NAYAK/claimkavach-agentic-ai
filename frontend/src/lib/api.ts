import { Case, Approval, Message, Rule, GlossaryItem, HighlightRect } from './types';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchConfig() {
  const res = await fetch(`${API_BASE}/config`);
  return res.json();
}

export async function testGeminiKey(key: string, model?: string, fallbackModel?: string) {
  const headers: Record<string, string> = { 'X-Gemini-Key': key };
  if (model) headers['X-Gemini-Model'] = model;
  if (fallbackModel) headers['X-Gemini-Fallback-Model'] = fallbackModel;
  const res = await fetch(`${API_BASE}/settings/test-key`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to verify key');
  return res.json();
}

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/profile`);
  return res.json();
}

export async function updateProfile(data: any) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  return res.json();
}

export async function uploadDocument(file: File, kind: string) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/uploads?kind=${kind}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function createCase(payload: any, geminiKey?: string): Promise<{ case_id: string; status: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (geminiKey) headers['X-Gemini-Key'] = geminiKey;
  const res = await fetch(`${API_BASE}/cases`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Case creation failed');
  return res.json();
}

export async function fetchCases(status?: string): Promise<Case[]> {
  const url = status && status !== 'all' ? `${API_BASE}/cases?status=${status}` : `${API_BASE}/cases`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchCurrentClaim(): Promise<{ case_id: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/claims/current`);
    if (!res.ok) return { case_id: null };
    return res.json();
  } catch {
    return { case_id: null };
  }
}

export async function fetchClaimSummary(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/claims/${id}/summary`);
  if (!res.ok) throw new Error('Failed to fetch claim summary');
  return res.json();
}

export async function fetchCase(id: string): Promise<Case> {
  const res = await fetch(`${API_BASE}/cases/${id}`);
  if (!res.ok) throw new Error('Case not found');
  return res.json();
}

export async function fetchTimeline(id: string) {
  const res = await fetch(`${API_BASE}/cases/${id}/timeline`);
  return res.json();
}

export async function fetchHighlights(id: string, doc: string, quote: string): Promise<HighlightRect[]> {
  const res = await fetch(`${API_BASE}/cases/${id}/highlights?doc=${encodeURIComponent(doc)}&quote=${encodeURIComponent(quote)}`);
  return res.json();
}

export async function fetchCaseMessages(id: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/cases/${id}/messages`);
  return res.json();
}

export async function fetchApprovals(status: string = 'pending'): Promise<Approval[]> {
  const res = await fetch(`${API_BASE}/approvals?status=${status}`);
  return res.json();
}

export async function approveAction(id: number, editedBody?: string) {
  const res = await fetch(`${API_BASE}/approvals/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ edited_body: editedBody }),
  });
  if (!res.ok) throw new Error('Approval failed');
  return res.json();
}

export async function undoApproval(id: number) {
  const res = await fetch(`${API_BASE}/approvals/${id}/undo`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Undo expired or failed');
  return res.json();
}

export async function rejectApproval(id: number) {
  const res = await fetch(`${API_BASE}/approvals/${id}/reject`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchClock() {
  const res = await fetch(`${API_BASE}/clock`);
  return res.json();
}

export async function advanceClock(days: number) {
  const res = await fetch(`${API_BASE}/clock/advance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days }),
  });
  return res.json();
}

export async function setClock(date: string) {
  const res = await fetch(`${API_BASE}/clock/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  });
  return res.json();
}

export async function resetClock() {
  const res = await fetch(`${API_BASE}/clock/reset`, {
    method: 'POST',
  });
  return res.json();
}

export async function loadJudgeDemo(geminiKey?: string): Promise<{ case_id: string; status: string }> {
  const headers: Record<string, string> = {};
  if (geminiKey) headers['X-Gemini-Key'] = geminiKey;
  const res = await fetch(`${API_BASE}/judge/load-demo`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) throw new Error('Demo load failed');
  return res.json();
}

export async function updateJudgeConfig(cfg: any) {
  const res = await fetch(`${API_BASE}/judge/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cfg),
  });
  return res.json();
}

export async function fetchRules(): Promise<Rule[]> {
  const res = await fetch(`${API_BASE}/rules`);
  return res.json();
}

export async function fetchGlossary(): Promise<GlossaryItem[]> {
  const res = await fetch(`${API_BASE}/glossary`);
  return res.json();
}

export async function fetchPolicies() {
  const res = await fetch(`${API_BASE}/policies`);
  return res.json();
}

export async function deleteData() {
  const res = await fetch(`${API_BASE}/data/delete`, { method: 'POST' });
  return res.json();
}

export async function fetchInsurerMessages(): Promise<Message[]> {
  const res = await fetch('/twin/insurer/messages');
  return res.json();
}

export async function fetchRegulatorComplaints(): Promise<Message[]> {
  const res = await fetch('/twin/regulator/complaints');
  return res.json();
}
