# TK-22 — System Brief (v1)

## What TK-22 Is
TK-22 is a decision finalization system.
It exists to end uncertainty by issuing a machine-evaluated verdict and explicit cognitive closure.

The product is the closure statement.

## What TK-22 Is Not
- Not a dashboard
- Not an analytics platform
- Not an advisory tool
- Not a monitoring system
- Not a UI for exploration

If a feature increases interpretation, it does not belong in TK-22.

## Frozen Surfaces
The following are frozen and must not be modified without versioning:
- `src/app/page.tsx`
- Verdict display flow
- Closure statement text
- VerdictContract v1

## Mutable Surfaces
The following may evolve freely:
- Scan engines
- Signal generation
- Risk logic
- Agent orchestration
- Data sources

All mutable systems must output `VerdictContract`.

## The Rule
If a change does not improve the correctness of the verdict,
it is not a valid change.

## Authority Model
Humans may override decisions.
The system never argues.
The system never persuades.
The system declares and closes.
