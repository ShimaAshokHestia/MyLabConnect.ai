// src/Types/PipelineMonitor/PipelineMonitor.types.ts

export interface SystemHealth {
  overallStatus: "Healthy" | "Degraded" | "Failed";
  lastSuccessfulRun: string | null;
  currentCycleStatus: "Running" | "Idle" | "Stuck";
  nextScheduledRun: string | null;
  uptimeSince: string;
  activeAlertCount: number;
  criticalAlertCount: number;
}

export interface PipelineFunnel {
  rawPagesFetchedToday: number;
  totalCasesInRaw: number;
  rawFailedCount: number;
  totalCasesProcessed: number;
  processingFailed: number;
  totalResolved: number;
  resolutionFailed: number;
  pendingResolution: number;
  totalRegistered: number;
  registrationFailed: number;
  pendingRegistration: number;
}

export interface TokenHealth {
  labCode: string;
  companyId: string;
  lastRefreshed: string | null;
  status: "Fresh" | "Stale" | "Expired";
  hoursSinceRefresh: number;
  isActive: boolean;
}

export interface PerLabStats {
  labCode: string;
  labName: string;
  tokenStatus: string;
  tokenLastRefreshed: string | null;
  casesFetchedToday: number;
  casesRegisteredToday: number;
  stuckCasesCount: number;
  failedCasesCount: number;
  lastErrorMessage: string | null;
  lastResolutionError: string | null;
}

export interface ErrorGroup {
  stage: string;
  errorReason: string;
  count: number;
  exampleCaseId: string;
  lastOccurred: string;
}

export interface StuckCase {
  shapeCaseId: number;
  caseId: string;
  patientName: string;
  labCode: string;
  stuckAt: string;
  hoursStuck: number;
  lastError: string | null;
  createdAt: string;
}

export interface DeadLetter {
  pendingCount: number;
  retryingCount: number;
  abandonedCount: number;
  resolvedCount: number;
  oldestPending: string | null;
  casesExceededRetry: number;
}

export interface AutoCreatedDoctor {
  doctorId: number;
  triosDoctorId: string;
  name: string;
  email: string;
  dso: string;
  casesLinked: number;
  createdAt: string;
}

export interface PipelineRunLog {
  id: number;
  workerName: string;
  stage: string;
  labCode: string | null;
  cycleStart: string;
  cycleEnd: string | null;
  status: "Running" | "Completed" | "Failed";
  tokensSynced: number;
  casesFetched: number;
  casesProcessed: number;
  casesResolved: number;
  casesRegistered: number;
  errorCount: number;
  durationSeconds: number;
  errorSummary: string | null;
}

export interface PipelineAlert {
  id: number;
  alertType: string;
  severity: "Critical" | "Warning" | "Info";
  message: string;
  labCode: string | null;
  stage: string | null;
  triggeredAt: string;
  isResolved: boolean;
}

export interface PipelineDashboard {
  systemHealth: SystemHealth;
  funnel: PipelineFunnel;
  tokens: TokenHealth[];
  labBreakdown: PerLabStats[];
  errorGroups: ErrorGroup[];
  stuckCases: StuckCase[];
  deadLetter: DeadLetter;
  autoCreatedDoctors: AutoCreatedDoctor[];
  recentRuns: PipelineRunLog[];
  activeAlerts: PipelineAlert[];
}
