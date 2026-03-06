import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../../Styles/KiduStyles/AiAssistant.css';

// ─── Types ───────────────────────────────────────────────────────────────────

type AssistantTypeStrict = 1 | 2 | 3 | 4 | 5 | 6;
export type AssistantType = AssistantTypeStrict | number | string;

interface StepItem {
  state: 'done' | 'active' | 'pending';
  label: string;
  badge: string;
  badgeCls: string;
}

interface CaseItem {
  id: string;
  name: string;
  status: string;
  dot: string;
  cls: string;
}

interface MiniCard {
  id: string;
  type: string;
  chip: string;
  chipCls: string;
  colorCls: string;
  dotColor: string;
  eta: string;
}

interface RoleConfig {
  fabLabel: string;
  name: string;
  subtitle: string;
  pill: string;
  pillCls: string;
  cardTitle: string;
  cardSub: string;
  actionLabel: string;
  nextStep: string;
  steps: StepItem[];
  chips: string[];
  replies: string[];
  cases: CaseItem[];
  miniCards: MiniCard[];
}

interface Message {
  id: string;
  role: 'user' | 'bot' | 'system';
  text: string;
}

interface KiduAiAssistantProps {
  type: AssistantType;
}

interface FabPosition {
  x: number; // distance from LEFT edge of viewport
  y: number; // distance from BOTTOM edge of viewport
}

// ─── Role Configurations ──────────────────────────────────────────────────────

const ROLE_CONFIGS: Record<AssistantTypeStrict, RoleConfig> = {
  1: {
    fabLabel: 'DSO Assistant',
    name: 'DSO Assistant',
    subtitle: 'Smart Organisation Assistant · Powered by AI',
    pill: '🏢 DSO',
    pillCls: 'rp-dso',
    cardTitle: '3 cases across your practices need attention',
    cardSub: '2 require action — shade confirmation pending and 1 delivery overdue by 2 days.',
    actionLabel: 'DSO Action Required',
    nextStep: 'Review Action Items',
    steps: [
      { state: 'done', label: '54 Cases Submitted', badge: 'Submitted', badgeCls: 'sb-completed' },
      { state: 'done', label: 'Labs Assigned', badge: 'Assigned', badgeCls: 'sb-finished' },
      { state: 'active', label: '2 Cases Need Action', badge: 'Attention', badgeCls: 'sb-inprog' },
      { state: 'pending', label: 'QC & Delivery', badge: 'Upcoming', badgeCls: 'sb-awaiting' },
    ],
    chips: ['📊 Practice performance', '⚠️ Cases needing attention', '📈 Monthly case volume', '💬 Message all labs', '🗂️ Export full report', '🏥 Practice breakdown'],
    replies: [
      'Across your practices: **54 cases** total — 2 require urgent action.',
      '**Case I-11278** needs shade confirmation and **Case D-45902** is overdue by 2 days.',
      'This month: Crown cases ↑18%, Implant cases steady. Top practice: Bedford Demo.',
      'Message sent to all labs. They\'ll respond within 2 business hours.',
      'DSO report generated: 54 submitted, 94% on-track rate. Ready to export.',
    ],
    cases: [
      { id: 'P700840', name: 'Jen Millward', status: 'Submitted', dot: '#22c55e', cls: 'dds-done' },
      { id: 'MLCLS700831', name: 'GLENN MARVEL', status: 'Submitted', dot: '#22c55e', cls: 'dds-done' },
      { id: 'P700767', name: 'Alex 2', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
    ],
    miniCards: [
      { id: 'Practice-A', type: 'Bedford Practice', chip: 'ON TRACK', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: '12 active cases' },
      { id: 'Practice-B', type: 'MLC Practice', chip: 'ACTION NEEDED', chipCls: 'mcc-amber', colorCls: 'mc-amber', dotColor: '#f59e0b', eta: 'Shade Required' },
      { id: 'Practice-C', type: 'Infinity Practice', chip: 'DELAYED', chipCls: 'mcc-red', colorCls: 'mc-red', dotColor: '#ef4444', eta: 'Overdue by 2 Days' },
    ],
  },
  2: {
    fabLabel: 'Lab Assistant',
    name: 'Lab Assistant',
    subtitle: 'Smart Case Assistant · Powered by AI',
    pill: '🏥 Lab',
    pillCls: 'rp-lab',
    cardTitle: 'Your crown case is currently in milling',
    cardSub: 'and is expected to be delivered tomorrow.',
    actionLabel: 'Lab Action Required',
    nextStep: 'Quality Control Review',
    steps: [
      { state: 'done', label: 'Scans Received', badge: 'Completed', badgeCls: 'sb-completed' },
      { state: 'done', label: 'Design Phase', badge: 'Finished', badgeCls: 'sb-finished' },
      { state: 'active', label: 'Milling', badge: 'In Progress', badgeCls: 'sb-inprog' },
      { state: 'pending', label: 'QC Pending', badge: 'Awaiting Approval', badgeCls: 'sb-awaiting' },
    ],
    chips: ['📋 Show all on-hold cases', '⏰ Any overdue cases?', '🔔 Notify lab about delays', '📦 What\'s in transit?', '📊 Weekly summary', '🔍 Search a case'],
    replies: [
      'I found **10 cases** currently on hold. The oldest is DILS700042 from 02/12/2025. Want me to prioritise them?',
      'There are **2 cases overdue** by more than 3 days — DILS700048 and DILS700052 need immediate attention.',
      'I\'ve flagged the lab about the delay on MYLS700568. They\'ll be notified within the hour.',
      '**4 cases** are in transit. Deliveries expected between today and Thursday.',
      'This week: 10 on hold · 48 in production · 77 submitted. Production rate ↑12% from last week.',
    ],
    cases: [
      { id: 'MYLS700588', name: 'WILL BIL', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'MYLS700578', name: 'SHIRLEY WILL', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'MYLS700568', name: 'GILL WILL', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'MYLS700666', name: 'FIONA CHURCH', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'MYLS700642', name: 'MARY BRANDO', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'DILS700072', name: 'GRIFFEN CHARLES', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
    ],
    miniCards: [
      { id: 'Case C-23891', type: 'Crown Case', chip: 'ON TRACK', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: 'ETA: Tomorrow' },
      { id: 'Case I-11278', type: 'Implant Case', chip: 'ACTION NEEDED', chipCls: 'mcc-amber', colorCls: 'mc-amber', dotColor: '#f59e0b', eta: 'Shade Confirmation Required' },
      { id: 'Case D-45902', type: 'Denture Case', chip: 'DELAYED', chipCls: 'mcc-red', colorCls: 'mc-red', dotColor: '#ef4444', eta: 'Overdue by 2 Days' },
    ],
  },
  3: {
    fabLabel: 'Doctor Assistant',
    name: 'Doctor Assistant',
    subtitle: 'Smart Clinical Assistant · Powered by AI',
    pill: '👨‍⚕️ Doctor',
    pillCls: 'rp-doctor',
    cardTitle: 'Shade confirmation needed for your implant case',
    cardSub: 'Patient SHIRLEY WILL — please confirm shade to proceed with manufacturing.',
    actionLabel: 'Doctor Action Required',
    nextStep: 'Confirm Shade Selection',
    steps: [
      { state: 'done', label: 'Case Submitted', badge: 'Submitted', badgeCls: 'sb-completed' },
      { state: 'done', label: 'Lab Received', badge: 'Received', badgeCls: 'sb-finished' },
      { state: 'active', label: 'Shade Confirmation', badge: 'Action Needed', badgeCls: 'sb-inprog' },
      { state: 'pending', label: 'Manufacturing', badge: 'Pending', badgeCls: 'sb-awaiting' },
    ],
    chips: ['🦷 My active patient cases', '✅ Confirm shade approval', '📅 Delivery schedule', '📝 Add clinical notes', '🔔 Message the lab', '📊 My case history'],
    replies: [
      'Your patient **WILL BIL** (Case MYLS700588) has a crown in milling — delivery expected tomorrow.',
      'Shade confirmation request sent to MYLAB. You\'ll be notified once approved.',
      'You have **3 cases in production**, 2 on hold, and 1 awaiting shade approval this week.',
      'Clinical notes added to Case MYLS700568 for **GILL WILL**. The lab has been notified.',
      'Case MYLS700588 is on track — currently in milling, due tomorrow.',
    ],
    cases: [
      { id: 'MYLS700588', name: 'WILL BIL', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'MYLS700578', name: 'SHIRLEY WILL', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'MYLS700568', name: 'GILL WILL', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
      { id: 'MYLS700666', name: 'FIONA CHURCH', status: 'On Hold', dot: '#ef4444', cls: 'dds-hold' },
    ],
    miniCards: [
      { id: 'Case C-23891', type: 'Crown Case', chip: 'ON TRACK', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: 'ETA: Tomorrow' },
      { id: 'Case I-11278', type: 'Implant Case', chip: 'ACTION NEEDED', chipCls: 'mcc-amber', colorCls: 'mc-amber', dotColor: '#f59e0b', eta: 'Shade Confirmation Required' },
      { id: 'Case D-45902', type: 'Denture Case', chip: 'DELAYED', chipCls: 'mcc-red', colorCls: 'mc-red', dotColor: '#ef4444', eta: 'Overdue by 2 Days' },
    ],
  },
  4: {
    fabLabel: 'Practice Assistant',
    name: 'Practice Assistant',
    subtitle: 'Smart Practice Assistant · Powered by AI',
    pill: '🦷 Practice',
    pillCls: 'rp-practice',
    cardTitle: 'Your practice has 9 submitted cases today',
    cardSub: '1 case pending QC approval. Clearance expected by 4 PM today.',
    actionLabel: 'Practice Action Required',
    nextStep: 'Approve QC for Case P700840',
    steps: [
      { state: 'done', label: '9 Cases Submitted', badge: 'Submitted', badgeCls: 'sb-completed' },
      { state: 'done', label: 'All Labs Received', badge: 'Received', badgeCls: 'sb-finished' },
      { state: 'active', label: 'QC Review', badge: 'In Progress', badgeCls: 'sb-inprog' },
      { state: 'pending', label: 'Dispatch', badge: 'Pending', badgeCls: 'sb-awaiting' },
    ],
    chips: ['✓ QC approval status', '📅 Delivery timeline', '📈 Submission trends', '📥 Download report', '🔍 Search submitted cases', '📊 Lab performance'],
    replies: [
      'All 9 submitted cases accounted for. 1 pending QC at MLC LAB — expected by 4 PM.',
      'QC approval pending for **Case P700840**. Lab notified to expedite.',
      'Submission trend: ↑23% this week vs last. Peak day: Wednesday.',
      'Full case report ready for download — 9 cases with status, ETA and lab assignment.',
      'Lab performance: MLC LAB 98% on-time · Dental Infinity 94% on-time this month.',
    ],
    cases: [
      { id: 'P700840', name: 'Jen Millward', status: 'Submitted', dot: '#22c55e', cls: 'dds-done' },
      { id: 'P700841', name: 'Mlc Test Lizzie', status: 'Submitted', dot: '#22c55e', cls: 'dds-done' },
      { id: 'MLCLS700831', name: 'GLENN MARVEL', status: 'Submitted', dot: '#22c55e', cls: 'dds-done' },
    ],
    miniCards: [
      { id: 'Lab MLC', type: 'MLC LAB', chip: 'ON TRACK', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: '7 cases active' },
      { id: 'Lab DILS', type: 'Dental Infinity', chip: 'ACTION NEEDED', chipCls: 'mcc-amber', colorCls: 'mc-amber', dotColor: '#f59e0b', eta: 'QC Pending' },
      { id: 'Lab MY', type: 'MYLAB', chip: 'ON TRACK', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: 'ETA: Today' },
    ],
  },
  5: {
    fabLabel: 'Integrator Assistant',
    name: 'Integrator Assistant',
    subtitle: 'Smart Integration Assistant · Powered by AI',
    pill: '🔗 Integrator',
    pillCls: 'rp-integrator',
    cardTitle: 'Integration health is nominal across all endpoints',
    cardSub: '2 API warnings detected — rate limit approaching on the scan endpoint.',
    actionLabel: 'Integration Review',
    nextStep: 'Review API Rate Limits',
    steps: [
      { state: 'done', label: 'Core APIs Connected', badge: 'Connected', badgeCls: 'sb-completed' },
      { state: 'done', label: 'Data Sync Active', badge: 'Syncing', badgeCls: 'sb-finished' },
      { state: 'active', label: 'Rate Limit Warning', badge: 'Attention', badgeCls: 'sb-inprog' },
      { state: 'pending', label: 'Optimisation', badge: 'Scheduled', badgeCls: 'sb-awaiting' },
    ],
    chips: ['🔗 API health status', '⚠️ Active warnings', '📊 Throughput report', '🔄 Sync status', '📝 Integration logs', '⚡ Rate limit details'],
    replies: [
      'All **6 integration endpoints** are operational. 2 warnings on scan API.',
      'Rate limit at **78%** on scan endpoint — recommend increasing quota or throttling requests.',
      'Last sync completed at 10:42 AM with **0 errors**. Next scheduled: 11:42 AM.',
      'Integration logs exported for the last 7 days — 12,847 successful API calls.',
      'Optimisation scheduled for tonight at 2 AM. Expect 5 min downtime on the scan endpoint.',
    ],
    cases: [
      { id: 'INT-001', name: 'Scan API Endpoint', status: 'Warning', dot: '#f59e0b', cls: 'dds-hold' },
      { id: 'INT-002', name: 'Order Webhook', status: 'Active', dot: '#22c55e', cls: 'dds-done' },
      { id: 'INT-003', name: 'Patient Sync', status: 'Active', dot: '#22c55e', cls: 'dds-done' },
    ],
    miniCards: [
      { id: 'API Health', type: 'Core API', chip: 'NOMINAL', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: 'Uptime: 99.9%' },
      { id: 'Scan API', type: 'Scan Endpoint', chip: 'WARNING', chipCls: 'mcc-amber', colorCls: 'mc-amber', dotColor: '#f59e0b', eta: 'Rate: 78% capacity' },
      { id: 'Webhooks', type: 'Webhook System', chip: 'NOMINAL', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: 'All hooks firing' },
    ],
  },
  6: {
    fabLabel: 'Admin Assistant',
    name: 'Admin Assistant',
    subtitle: 'Smart Platform Assistant · Powered by AI',
    pill: '⚙️ Admin',
    pillCls: 'rp-admin',
    cardTitle: 'Platform is running smoothly across all tenants',
    cardSub: '248 active users · 3 tenants with pending onboarding actions.',
    actionLabel: 'Admin Action Required',
    nextStep: 'Complete Tenant Onboarding',
    steps: [
      { state: 'done', label: 'Platform Health', badge: 'Nominal', badgeCls: 'sb-completed' },
      { state: 'done', label: 'User Sessions', badge: '248 Active', badgeCls: 'sb-finished' },
      { state: 'active', label: 'Tenant Onboarding', badge: '3 Pending', badgeCls: 'sb-inprog' },
      { state: 'pending', label: 'Audit Review', badge: 'Scheduled', badgeCls: 'sb-awaiting' },
    ],
    chips: ['👥 Active user count', '🏢 Tenant status', '📊 Platform metrics', '⚠️ System alerts', '📋 Audit logs', '🔧 Maintenance mode'],
    replies: [
      '**248 users** currently active across 12 tenants. Peak load is within normal bounds.',
      'Tenant onboarding pending for: Bedford Practice, MLC Lab, and Infinity Dental.',
      'Platform uptime this month: **99.97%**. Last incident was 18 days ago.',
      'Audit log exported — last 30 days, 15,432 events across all tenants.',
      'No system alerts currently. All services operational. Next maintenance: Sunday 2 AM.',
    ],
    cases: [
      { id: 'TENANT-01', name: 'Bedford Practice', status: 'Pending', dot: '#f59e0b', cls: 'dds-hold' },
      { id: 'TENANT-02', name: 'MLC Lab', status: 'Active', dot: '#22c55e', cls: 'dds-done' },
      { id: 'TENANT-03', name: 'Infinity Dental', status: 'Active', dot: '#22c55e', cls: 'dds-done' },
    ],
    miniCards: [
      { id: 'Users', type: 'Active Sessions', chip: 'NOMINAL', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: '248 online now' },
      { id: 'Tenants', type: 'Tenant Health', chip: 'ACTION NEEDED', chipCls: 'mcc-amber', colorCls: 'mc-amber', dotColor: '#f59e0b', eta: '3 pending setup' },
      { id: 'System', type: 'Platform Health', chip: 'NOMINAL', chipCls: 'mcc-green', colorCls: 'mc-green', dotColor: '#22c55e', eta: 'Uptime 99.97%' },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_NAME_MAP: Record<string, AssistantTypeStrict> = {
  dso: 1, lab: 2, doctor: 3, practice: 4, integrator: 5, appadmin: 6, admin: 6,
};

function resolveAssistantType(raw: AssistantType): AssistantTypeStrict {
  const n = Number(raw);
  if (!isNaN(n) && n >= 1 && n <= 6) return n as AssistantTypeStrict;
  if (typeof raw === 'string') {
    const mapped = ROLE_NAME_MAP[raw.toLowerCase().trim()];
    if (mapped) return mapped;
  }
  if (import.meta.env.DEV) {
    console.warn(`[KiduAiAssistant] Unrecognised assistantType="${raw}". Falling back to Lab (2).`);
  }
  return 2;
}

/**
 * Default FAB position — sits in the pagination bar row, between the
 * "Go" button and the "Records per page" dropdown (the blue-circled area).
 *
 * Layout reference (from screenshots):
 *   - Viewport width ≈ 1456px
 *   - "Records per page" label+dropdown occupies the far right ~180px
 *   - FAB is ~160px wide
 *   - We place it at right ≈ 190px so it clears the Records dropdown
 *     and sits right where the blue circle was drawn.
 *
 * We calculate x from the LEFT using window.innerWidth so it stays
 * correct on any screen size.
 */
function getDefaultFabPosition(): FabPosition {
  const fabWidth = 160;
  const rightOffset = 400;  // pushes it left of "Records per page" dropdown
  const x = Math.max(0, window.innerWidth - fabWidth - rightOffset);
  return { x, y: 18 };  // y:18 aligns it with the pagination row bottom
}

// ─── AI Avatar SVG ────────────────────────────────────────────────────────────

const AiAvatarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="transparent" />
    <ellipse cx="20" cy="16" rx="8" ry="8.5" fill={color} fillOpacity="0.95" />
    <path d="M8 34c0-6.627 5.373-12 12-12h0c6.627 0 12 5.373 12 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <circle cx="17" cy="15" r="1.3" fill="#ef0d50" />
    <circle cx="23" cy="15" r="1.3" fill="#ef0d50" />
    <path d="M16.5 19.5 Q20 22 23.5 19.5" stroke="#ef0d50" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="10" r="1" fill={color} fillOpacity="0.6" />
    <circle cx="17" cy="11.5" r="0.7" fill={color} fillOpacity="0.4" />
    <circle cx="23" cy="11.5" r="0.7" fill={color} fillOpacity="0.4" />
  </svg>
);

// ─── Step icons ───────────────────────────────────────────────────────────────

const DoneIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ActiveIcon = () => (
  <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
  </svg>
);
const PendingIcon = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const KiduAiAssistant: React.FC<KiduAiAssistantProps> = ({ type }) => {
  const resolvedKey = resolveAssistantType(type);
  const config: RoleConfig = ROLE_CONFIGS[resolvedKey];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    () => ROLE_CONFIGS[resolveAssistantType(type)]?.cases[0]?.id ?? ''
  );
  const [caseDDOpen, setCaseDDOpen] = useState(false);
  const [caseSearch, setCaseSearch] = useState('');

  // ── Draggable FAB ──────────────────────────────────────────────────────────
  const [fabPos, setFabPos] = useState<FabPosition>(() => getDefaultFabPosition());
  const [isDragging, setIsDragging] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);
  const dragStart = useRef<{ mouseX: number; mouseY: number; fabX: number; fabY: number } | null>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const hasDragged = useRef(false);

  // Auto-hide drag hint
  useEffect(() => {
    const t = setTimeout(() => setShowDragHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Mouse drag — start
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    hasDragged.current = false;
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, fabX: fabPos.x, fabY: fabPos.y };
    setIsDragging(true);
  }, [fabPos]);

  // Mouse drag — move + end
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
      const fabW = fabRef.current?.offsetWidth ?? 160;
      const fabH = fabRef.current?.offsetHeight ?? 46;
      setFabPos({
        x: Math.max(0, Math.min(dragStart.current.fabX + dx, window.innerWidth - fabW)),
        y: Math.max(0, Math.min(dragStart.current.fabY - dy, window.innerHeight - fabH)),
      });
    };
    const onUp = () => { setIsDragging(false); dragStart.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging]);

  // Touch drag — start
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    const t = e.touches[0];
    hasDragged.current = false;
    dragStart.current = { mouseX: t.clientX, mouseY: t.clientY, fabX: fabPos.x, fabY: fabPos.y };
    setIsDragging(true);
  }, [fabPos]);

  // Touch drag — move + end
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: TouchEvent) => {
      if (!dragStart.current) return;
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - dragStart.current.mouseX;
      const dy = t.clientY - dragStart.current.mouseY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
      const fabW = fabRef.current?.offsetWidth ?? 160;
      const fabH = fabRef.current?.offsetHeight ?? 46;
      setFabPos({
        x: Math.max(0, Math.min(dragStart.current.fabX + dx, window.innerWidth - fabW)),
        y: Math.max(0, Math.min(dragStart.current.fabY - dy, window.innerHeight - fabH)),
      });
    };
    const onEnd = () => { setIsDragging(false); dragStart.current = null; };
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
  }, [isDragging]);

  // Click opens panel only if it was NOT a drag
  const handleFabClick = useCallback(() => {
    if (hasDragged.current) return;
    openPanel();
  }, []);

  // ── Chat logic ─────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const caseDDRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (caseDDRef.current && !caseDDRef.current.contains(e.target as Node)) setCaseDDOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openPanel = () => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 400); };
  const closePanel = () => setIsOpen(false);
  const clearChat = () => setMessages([]);

  const sendMessage = (text?: string) => {
    const msg = (text ?? inputValue).trim();
    if (!msg || isTyping) return;
    setInputValue('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      const reply = config.replies[Math.floor(Math.random() * config.replies.length)];
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: reply }]);
      setIsTyping(false);
    }, 900 + Math.random() * 700);
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip.replace(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}⚠✅✓]\s*/u, ''));
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCaseDDOpen(false);
    setCaseSearch('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `Now discussing ${caseId}` }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const quickAction = (action: 'view' | 'why' | 'notify') => {
    const msgs = {
      view: 'Show me the full case details.',
      why: 'Why is this case in its current status?',
      notify: 'Notify the lab about this case.',
    };
    const resp = {
      view: `Here are the full details for **${selectedCaseId}** — currently in the ${config.steps.find(s => s.state === 'active')?.label ?? 'processing'} stage.`,
      why: 'This case is in the current stage because the previous step was completed recently and it\'s been queued for the next action.',
      notify: '✓ Notification sent to the assigned lab. They typically respond within 1 hour.',
    };
    sendMessage(msgs[action]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => m.text !== msgs[action]),
        { id: Date.now().toString(), role: 'user', text: msgs[action] },
        { id: (Date.now() + 1).toString(), role: 'bot', text: resp[action] },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const filteredCases = config.cases.filter(c =>
    c.id.toLowerCase().includes(caseSearch.toLowerCase()) ||
    c.name.toLowerCase().includes(caseSearch.toLowerCase())
  );

  const renderBoldText = (text: string) =>
    text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );

  if (!config) return null;

  // Inline style: position driven fully by JS state (left + bottom)
  const fabStyle: React.CSSProperties = {
    left: `${fabPos.x}px`,
    bottom: `${fabPos.y}px`,
    right: 'unset',        // override any CSS right value
    top: 'unset',          // ensure top doesn't interfere
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      <button
        ref={fabRef}
        className={`kai-fab ${isOpen ? 'kai-fab--hidden' : ''} ${isDragging ? 'kai-fab--dragging' : ''}`}
        style={fabStyle}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleFabClick}
        aria-label="Open AI Assistant"
      >
        {showDragHint && !isOpen && (
          <span className="kai-fab__drag-hint" aria-hidden="true">✥ Drag to move</span>
        )}
        <div className="kai-fab__ico">
          <AiAvatarIcon size={18} color="white" />
        </div>
        <span className="kai-fab__label">{config.fabLabel}</span>
        <div className="kai-fab__badge" />
      </button>

      {/* ── Overlay + Panel ── */}
      <div
        className={`kai-overlay ${isOpen ? 'kai-overlay--open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) closePanel(); }}
      >
        <div className={`kai-panel ${isOpen ? 'kai-panel--open' : ''}`} role="dialog" aria-modal="true" aria-label="AI Assistant">

          {/* Header */}
          <div className="kai-hdr">
            <div className="kai-hdr__logo"><AiAvatarIcon size={22} color="white" /></div>
            <div className="kai-hdr__titles">
              <div className="kai-hdr__name">{config.name}</div>
              <div className="kai-hdr__sub">{config.subtitle}</div>
            </div>

            <div className="kai-case-wrap" ref={caseDDRef}>
              <button className="kai-case-sel" onClick={() => setCaseDDOpen(v => !v)}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                <span>{selectedCaseId ? `Case: ${selectedCaseId}` : 'Select Case'}</span>
                <svg className={`kai-chevron ${caseDDOpen ? 'kai-chevron--open' : ''}`} width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={`kai-case-dd ${caseDDOpen ? 'kai-case-dd--open' : ''}`}>
                <div className="kai-case-dd__hdr">Select a case to discuss</div>
                <div className="kai-case-dd__search">
                  <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input type="text" placeholder="Search cases…" value={caseSearch} onChange={e => setCaseSearch(e.target.value)} className="kai-case-dd__input" />
                </div>
                <div className="kai-case-dd__list">
                  {filteredCases.map(c => (
                    <div key={c.id} className={`kai-case-dd__item ${selectedCaseId === c.id ? 'kai-case-dd__item--active' : ''}`} onClick={() => handleSelectCase(c.id)}>
                      <div className="kai-case-dd__dot" style={{ background: c.dot }} />
                      <div className="kai-case-dd__info">
                        <div className="kai-case-dd__id">{c.id}</div>
                        <div className="kai-case-dd__name">{c.name}</div>
                      </div>
                      <span className={`kai-case-dd__status ${c.cls}`}>{c.status}</span>
                    </div>
                  ))}
                  {filteredCases.length === 0 && <div className="kai-case-dd__empty">No cases found</div>}
                </div>
              </div>
            </div>

            <div className="kai-hdr__actions">
              <span className={`kai-role-pill ${config.pillCls}`}>{config.pill}</span>
              <div className="kai-secure">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Secure</span>
              </div>
              <button className="kai-icon-btn" onClick={clearChat} title="Clear chat" aria-label="Clear chat">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </button>
              <button className="kai-close" onClick={closePanel} aria-label="Close assistant">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="kai-body">
            <div className="kai-messages" id="kai-messages">
              <div className="kai-two-col">
                <div className="kai-left-col">
                  <div className="kai-main-card">
                    <div className="kai-main-card__avatar"><AiAvatarIcon size={26} color="#ef0d50" /></div>
                    <div className="kai-main-card__body">
                      <div className="kai-main-card__title">{config.cardTitle}</div>
                      <div className="kai-main-card__sub">{config.cardSub}</div>
                      <div className="kai-main-card__meta">
                        <span className="kai-main-card__tick">✓</span>
                        <span>Based on system data</span>
                        <span className="kai-main-card__sep">|</span>
                        <span>Last updated 10:42 AM</span>
                      </div>
                      <div className="kai-main-card__btns">
                        <button className="kai-btn-primary" onClick={() => quickAction('view')}>View Details</button>
                        <button className="kai-btn-ghost" onClick={() => quickAction('why')}>Why?</button>
                        <button className="kai-btn-outline" onClick={() => quickAction('notify')}>
                          Notify
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="kai-mini-cards">
                    {config.miniCards.map(card => (
                      <div key={card.id} className={`kai-mini-c ${card.colorCls}`}>
                        <div className="kai-mc__top">
                          <span className="kai-mc__id">{card.id}</span>
                          <div className="kai-mc__dot" style={{ background: card.dotColor }} />
                        </div>
                        <div className="kai-mc__type">{card.type}</div>
                        <span className={`kai-mc__chip ${card.chipCls}`}>{card.chip}</span>
                        <div className="kai-mc__divider" />
                        <div className="kai-mc__eta">{card.eta}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="kai-right-col">
                  <div className="kai-status-card">
                    <div className="kai-status-card__title">Details &amp; Status</div>
                    <div className="kai-steps">
                      {config.steps.map((step, i) => (
                        <div key={i} className="kai-step-row">
                          <div className={`kai-step-dot kai-step-dot--${step.state}`}>
                            {step.state === 'done' && <DoneIcon />}
                            {step.state === 'active' && <ActiveIcon />}
                            {step.state === 'pending' && <PendingIcon />}
                          </div>
                          <span className="kai-step-lbl">{step.label}</span>
                          <span className={`kai-step-badge ${step.badgeCls}`}>{step.badge}</span>
                        </div>
                      ))}
                    </div>
                    <div className="kai-next-step"><strong>Next Step:</strong> {config.nextStep}</div>
                    <div className="kai-action-bar">
                      <div className="kai-pulse-dot" />
                      <span>{config.actionLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {messages.map(msg => {
                if (msg.role === 'system') return <div key={msg.id} className="kai-sys-msg">{msg.text}</div>;
                if (msg.role === 'user') return <div key={msg.id} className="kai-user-bubble">{msg.text}</div>;
                return (
                  <div key={msg.id} className="kai-bot-bubble">
                    <div className="kai-bot-bubble__avatar"><AiAvatarIcon size={13} color="white" /></div>
                    <div className="kai-bot-bubble__text">{renderBoldText(msg.text)}</div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="kai-bot-bubble">
                  <div className="kai-bot-bubble__avatar"><AiAvatarIcon size={13} color="white" /></div>
                  <div className="kai-typing-dots"><span /><span /><span /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="kai-chips-wrap">
              {config.chips.map((chip, i) => (
                <button key={i} className="kai-chip" onClick={() => handleChipClick(chip)}>{chip}</button>
              ))}
            </div>

            <div className="kai-input-bar">
              <div className="kai-input-field">
                <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  className="kai-input-field__input"
                  placeholder="Ask about cases, delays, or actions..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="kai-inp-btn" title="Voice input" aria-label="Voice input">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                  </svg>
                </button>
                <button className="kai-inp-btn" title="Attach file" aria-label="Attach file">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
              </div>
              <button className="kai-send" onClick={() => sendMessage()} aria-label="Send message">
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KiduAiAssistant;