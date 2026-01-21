'use client';

import { useState } from 'react';
import { VerdictContract } from '@/contracts/verdict';

export default function Page() {
  const [verdict, setVerdict] = useState<VerdictContract | null>(null);

  const executeScan = () => {
    // Mock verdict — deterministic for v1
    setVerdict({
      verdict: 'DO_NOT_PROCEED',
      confidence: 'HIGH',
      reasons: [
        'Ownership concentration exceeds safe threshold'
      ],
      signals: {
        ownership_percent: 91,
        liquidity_flag: true
      },
      scan_id: 'tk22_mock_001',
      timestamp: new Date().toISOString()
    });
  };

  const getBackgroundColor = () => {
    if (!verdict) return '#000';
    switch (verdict.verdict) {
      case 'SAFE_TO_PROCEED':
        return '#0f3d2e';
      case 'ACTION_REQUIRED':
        return '#3d320f';
      case 'DO_NOT_PROCEED':
        return '#3d0f0f';
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 48,
        backgroundColor: getBackgroundColor(),
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: verdict ? 'center' : 'flex-start'
      }}
    >
      {!verdict && (
        <>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>
            TK-22 Control Surface
          </h1>
          <p style={{ opacity: 0.7, marginBottom: 40 }}>
            This interface exists to issue execution intent and receive closure.
          </p>

          <button
            onClick={executeScan}
            style={{
              padding: 20,
              fontSize: 18,
              background: '#fff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              maxWidth: 320
            }}
          >
            Execute Scan
          </button>
        </>
      )}

      {verdict && (
        <>
          <h1 style={{ fontSize: 48, marginBottom: 16 }}>
            {verdict.verdict.replaceAll('_', ' ')}
          </h1>

          <p style={{ fontSize: 18, marginBottom: 8 }}>
            Confidence: {verdict.confidence}
          </p>

          <p style={{ fontSize: 20, marginBottom: 32 }}>
            {verdict.reasons[0]}
          </p>

          <p style={{ opacity: 0.8 }}>
            No further action is required from you at this time.
          </p>
        </>
      )}
    </main>
  );
}
