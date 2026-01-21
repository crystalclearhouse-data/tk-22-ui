// Internal signals used by scan engine
// These DO NOT leave the backend

export interface InternalSignals {
  ownership_percent: number;
  liquidity_flag: boolean;
  arbitrage_risk_score: number;
  honeypot_indicators: string[];
  contract_verified: boolean;
  anomaly_count: number;
}
