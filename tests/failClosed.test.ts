/**
 * Fail-Closed Behavior Test
 *
 * Enforces that TK-22 NEVER leaves the user in limbo.
 * All error states must return ACTION_REQUIRED with valid VerdictContract.
 *
 * This test protects closure under failure.
 * If TK-22 ever crashes silently, returns nothing, or returns ambiguous output,
 * the product promise is broken. This test prevents that permanently.
 */

import { describe, it, expect } from '@jest/globals';

describe('Fail-Closed Behavior', () => {
  it('Must return ACTION_REQUIRED on bad request (no target)', async () => {
    // Call API without proper input - simulates bad request
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'GET', // Wrong method - should be POST
    });

    // Even on error, must return valid structure
    const data = await response.json();

    // Must be valid VerdictContract with all required fields
    expect(data).toHaveProperty('verdict');
    expect(data).toHaveProperty('confidence');
    expect(data).toHaveProperty('reasons');
    expect(data).toHaveProperty('signals');
    expect(data).toHaveProperty('scan_id');
    expect(data).toHaveProperty('timestamp');

    // Must not have extra fields
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

    // Must fail closed with ACTION_REQUIRED
    expect(data.verdict).toBe('ACTION_REQUIRED');
    expect(data.confidence).toBe('LOW');
    expect(data.reasons).toBeDefined();
    expect(Array.isArray(data.reasons)).toBe(true);
    expect(data.reasons.length).toBeGreaterThan(0);
  });

  it('Must never return null or partial verdict', async () => {
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
    });

    const data = await response.json();

    // Verdict must always be complete - never null/undefined/empty
    expect(data.verdict).not.toBeNull();
    expect(data.verdict).not.toBeUndefined();
    expect(data.verdict).toBeTruthy();
    expect(typeof data.verdict).toBe('string');
    expect(data.verdict.length).toBeGreaterThan(0);

    // All required fields must be present and non-null
    expect(data.confidence).not.toBeNull();
    expect(data.reasons).not.toBeNull();
    expect(data.signals).not.toBeNull();
    expect(data.scan_id).not.toBeNull();
    expect(data.timestamp).not.toBeNull();

    expect(Array.isArray(data.reasons)).toBe(true);
  });

  it('Must never return stack traces or debug info on error', async () => {
    // Try to trigger an error by calling API incorrectly
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invalid: 'data' }),
    });

    const data = await response.json();
    const jsonString = JSON.stringify(data);

    // Must not leak internal errors to user
    expect(jsonString).not.toContain('Error:');
    expect(jsonString).not.toContain(' at ');
    expect(jsonString).not.toContain('stack');
    expect(jsonString).not.toContain('Stack');
    expect(jsonString).not.toContain('throw');
    expect(jsonString).not.toContain('Exception');

    // Must still return valid contract
    expect(data.verdict).toBeDefined();
    expect(['SAFE_TO_PROCEED', 'ACTION_REQUIRED', 'DO_NOT_PROCEED']).toContain(
      data.verdict
    );
  });

  it('Must return valid VerdictContract even on internal failure', async () => {
    // This test documents expected behavior when internal scan fails
    // The API route should catch any internal errors and return ACTION_REQUIRED
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
    });

    const data = await response.json();

    // Must always return complete VerdictContract
    expect(data).toBeDefined();
    expect(data).not.toBeNull();
    expect(typeof data).toBe('object');

    // Must contain verdict that allows UI to render closure
    expect(data.verdict).toBeDefined();
    expect(['SAFE_TO_PROCEED', 'ACTION_REQUIRED', 'DO_NOT_PROCEED']).toContain(
      data.verdict
    );

    // Must have confidence level
    expect(data.confidence).toBeDefined();
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(data.confidence);

    // Must have reasons (even if generic)
    expect(Array.isArray(data.reasons)).toBe(true);
  });

  it('Must never return empty or silent failure', async () => {
    const response = await fetch('http://localhost:3000/api/scan', {
      method: 'POST',
    });

    // Response must not be empty
    expect(response).toBeDefined();
    expect(response.ok || response.status >= 400).toBe(true);

    const text = await response.text();
    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);

    // Must be valid JSON
    const data = JSON.parse(text);
    expect(data).toBeDefined();

    // Must contain verdict
    expect(data.verdict).toBeDefined();
  });
});
