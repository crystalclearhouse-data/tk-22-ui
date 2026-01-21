# TK-22 Path A3: Authority Enforcement Tests

## Status: PARTIALLY COMPLETE

### ✅ Completed

1. **tests/ directory created** 
2. **contractIntegrity.test.ts** - COMPLETE AND COMMITTED
   - Enforces VerdictContract shape
   - Validates all required fields
   - Blocks unauthorized fields
   - Type checking for all contract fields

### 🚧 Remaining Test Files (To Be Created)

The following test files MUST be created to complete Path A3. Each protects a critical aspect of TK-22's authority model.

---

## 2️⃣ failClosed.test.ts

**Purpose**: Ensure TK-22 NEVER leaves users in limbo

**Critical Tests**:
- Error states return `ACTION_REQUIRED` + valid VerdictContract
- Never returns null/partial verdict
- Never leaks stack traces or debug info
- HTTP errors still produce valid contract

**Key Assertion**: `expect(data.verdict).toBe('ACTION_REQUIRED')` on errors

---

## 3️⃣ authorityBoundary.test.ts

**Purpose**: "Investigators cannot speak directly to the public"

**Critical Tests**:
- API response contains NO raw internal signal names (outside `signals` field)
- No analyzer-specific fields leak to frontend
- No debug output appears in production responses
- Verdict originates ONLY from verdict engine, not analyzers

**Key Assertion**: Response must not contain analyzer implementation details

---

## 4️⃣ determinism.test.ts

**Purpose**: Same signals → Same verdict (always)

**Critical Tests**:
- Mock internal signals produce consistent verdict
- Same confidence level every time
- Same reasons array
- No randomness in decision logic

**Key Assertion**: Given mocked signals, verdict must be deterministic

---

## 5️⃣ closureProtection.test.ts

**Purpose**: Frontend ALWAYS receives renderable verdict

**Critical Tests**:
- Verdict is never null
- Verdict is never partial
- Verdict is never empty string
- UI can ALWAYS render closure statement

**Key Assertion**: `expect(data.verdict).toBeTruthy()` and valid enum

---

## Implementation Notes

### Test Framework
- Use Jest (`@jest/globals`)
- Tests call `/api/scan` via `fetch()`
- Mock analyzers where needed, NOT the verdict engine

### Authority Principles Being Tested
1. **Contract Integrity**: Output shape never changes
2. **Fail-Closed**: Errors don't leak, always return safe verdict
3. **Authority Boundary**: Internal signals stay internal
4. **Determinism**: Same input = same output
5. **Closure**: User always gets finality

### Definition of A3 Complete

✅ All 5 test files created
✅ All tests pass
✅ Tests FAIL if:
  - VerdictContract changes shape
  - API returns partial data
  - Fail-closed logic removed
  - Authority boundary violated
  - Determinism breaks

✅ No UI/production code modified

---

## Next Steps

1. Create remaining 4 test files using specifications above
2. Run test suite: `npm test`
3. Verify all tests pass
4. Commit with message: "Complete A3 authority enforcement tests"
5. Report: "A3 complete. Authority and closure are enforced by tests."

---

## Why These Tests Matter

These are NOT feature tests.
These are NOT coverage tests.

**These are GUARDRAIL tests.**

They protect:
- Cognitive authority (who decides what)
- User closure (finality always provided)
- Contract integrity (stable interface)
- System safety (fail-closed behavior)

If a future change breaks these tests, it violates TK-22's constitutional principles.

---

**Created**: Path A3 implementation
**Author**: TK-22 Development
**Authority**: TK-22 System Brief (docs/TK22_SYSTEM_BRIEF.md)
