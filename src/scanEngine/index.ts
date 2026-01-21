import { VerdictContract } from '@/contracts/verdict';
import { InternalSignals } from '@/types/internalSignals';
import { analyzeOwnership } from './ownershipAnalyzer';
import { analyzeLiquidity } from './liquidityAnalyzer';
import { analyzeArbitrage } from './arbitrageAnalyzer';

// Main scan orchestrator
export async function executeScan(): Promise<VerdictContract> {
  // Run all analyzers in parallel
  const [ownership, liquidity, arbitrage] = await Promise.all([
    Promise.resolve(analyzeOwnership()),
    Promise.resolve(analyzeLiquidity()),
    Promise.resolve(analyzeArbitrage()),
  ]);

  // Merge internal signals
  const signals: InternalSignals = {
    ...ownership,
    ...liquidity,
    ...arbitrage,
    honeypot_indicators: [],
    contract_verified: true,
    anomaly_count: 0,
  } as InternalSignals;

  // Decision logic (backend-only)
  const verdict = determineVerdict(signals);
  const confidence = determineConfidence(signals);
  const reasons = generateReasons(signals, verdict);

  // Return only VerdictContract (no signals)
  return {
    verdict,
    confidence,
    reasons,
    signals: {
      ownership_percent: signals.ownership_percent,
      liquidity_flag: signals.liquidity_flag,
    },
    scan_id: `tk22_mock_001`,
    timestamp: new Date().toISOString(),
  };
}

function determineVerdict(
  signals: InternalSignals
): 'SAFE_TO_PROCEED' | 'ACTION_REQUIRED' | 'DO_NOT_PROCEED' {
  if (signals.ownership_percent > 80) return 'DO_NOT_PROCEED';
  return 'ACTION_REQUIRED';
}

function determineConfidence(
  signals: InternalSignals
): 'LOW' | 'MEDIUM' | 'HIGH' {
  return 'HIGH';
}

function generateReasons(
  signals: InternalSignals,
  verdict: string
): string[] {
  const reasons: string[] = [];

  if (signals.ownership_percent > 50) {
    reasons.push('Ownership concentration exceeds safe threshold');
  }

  return reasons.length > 0
    ? reasons
    : ['No further action is required from you at this time.'];
}
