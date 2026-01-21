// TK-22 Verdict Contract v1
// This file is IMMUTABLE once published

export type VerdictType =
  | 'SAFE_TO_PROCEED'
  | 'ACTION_REQUIRED'
  | 'DO_NOT_PROCEED';

export type ConfidenceLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export interface VerdictContract {
  verdict: VerdictType;

  confidence: ConfidenceLevel;

  reasons: string[];
  // Human-readable, plain-English explanations.
  // Multiple reasons allowed. Order matters.

  signals: Record<string, any>;
  // Raw or structured data that informed the verdict.
  // Machine-facing. UI does NOT interpret these.

  scan_id: string;
  // Unique identifier for this evaluation.
  // Enables auditability, replay, and proof-of-decision.

  timestamp: string;
  // ISO 8601 timestamp (UTC).
}
