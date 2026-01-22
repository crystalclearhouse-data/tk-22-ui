export type Verdict = "SAFE" | "WARNING" | "FAIL_CLOSED";

export interface ScanReport {
  mint: string;
  verdict: Verdict;
  summary: string;
  data: {
    totalSupply: number | null;
    topHolders: Array<{ address: string; balance: number; percentage: number }>;
    mintAuthority: string | null;
    freezeAuthority: string | null;
    recentTxCount: number | null;
  };
  flags: string[];
  scannedAt: string;
}
