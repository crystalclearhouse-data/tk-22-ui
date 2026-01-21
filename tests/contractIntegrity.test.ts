/**
 * Contract Integrity Test
 * 
 * Enforces that /api/scan ALWAYS returns a complete, valid VerdictContract.
 * This test protects against:
 * - Missing fields
 * - Renamed fields
 * - Extra fields leaking
 * - Type mismatches
 */

import { describe, it, expect } from '@jest/globals';
import { VerdictContract } from '@/contracts/verdict';

describe('Contract Integrity', () => {
  it('API response must match VerdictContract exactly', async () => {
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
    });

    expect(response.ok).toBe(true);
    const data = await response.json();

    // Assert all required fields exist
    expect(data).toHaveProperty('verdict');
    expect(data).toHaveProperty('confidence');
    expect(data).toHaveProperty('reasons');
    expect(data).toHaveProperty('signals');
    expect(data).toHaveProperty('scan_id');
    expect(data).toHaveProperty('timestamp');

    // Assert no extra top-level fields
    const allowedKeys = [
      'verdict',
      'confidence',
      'reasons',
      'signals',
      'scan_id',
      'timestamp',
    ];
    const actualKeys = Object.keys(data);
    expect(actualKeys.sort()).toEqual(allowedKeys.sort());

    // Assert correct types
    expect(typeof data.verdict).toBe('string');
    expect(['SAFE_TO_PROCEED', 'ACTION_REQUIRED', 'DO_NOT_PROCEED']).toContain(
      data.verdict
    );

    expect(typeof data.confidence).toBe('string');
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(data.confidence);

    expect(Array.isArray(data.reasons)).toBe(true);
    data.reasons.forEach((reason: unknown) => {
      expect(typeof reason).toBe('string');
    });

    expect(typeof data.signals).toBe('object');
    expect(data.signals).not.toBeNull();

    expect(typeof data.scan_id).toBe('string');
    expect(data.scan_id.length).toBeGreaterThan(0);

    expect(typeof data.timestamp).toBe('string');
    expect(() => new Date(data.timestamp)).not.toThrow();
  });

  it('Must fail if verdict field is missing', async () => {
    // This test documents the expected behavior
    // If this passes, it means the contract is being honored
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
    });

    const data = await response.json();
    expect(data.verdict).toBeDefined();
  });

  it('Must fail if contract adds unauthorized field', async () => {
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
    });

    const data = await response.json();
    const keys = Object.keys(data);

    // If this test fails, an unauthorized field was added
    const unauthorizedFields = keys.filter(
      (key) =>
        ![
          'verdict',
          'confidence',
          'reasons',
          'signals',
          'scan_id',
          'timestamp',
        ].includes(key)
    );

    expect(unauthorizedFields).toEqual([]);
  });
});
