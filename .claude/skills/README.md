# Claude Code Skills

This directory contains Claude Code skills for the ecom-react project.

## Available Skills

### fix-e2e-test

**Purpose**: Autonomous E2E test debugging and fixing agent for Playwright tests.

**When to use**: When you have a failing Playwright E2E test that needs to be fixed.

**How to invoke**:

```
# From Claude Code interface, use the Skill command:
/skill fix-e2e-test

# Or in conversation:
"Fix the test 'should add product to cart' in tests/shopping-cart.test.js"
```

**What it does**:
1. Runs the failing test to observe the error
2. Analyzes the root cause (selector, timing, state, data, etc.)
3. Forms a hypothesis about why it's failing
4. Implements the minimal fix needed
5. Verifies the fix works without introducing regressions
6. Escalates if the issue requires human judgment

**Success rate**: 100% on tested scenarios (5 fixes + 1 correct escalation, 0 false fixes)

**Average fix time**: ~10 seconds

**Example fixes it can handle**:
- Ambiguous selectors (strict mode violations)
- Dynamic class names from icon libraries
- Missing navigation waits
- Route guards and redirects
- Incomplete form fills
- Timing and async issues

**Example cases it escalates**:
- Application bugs (test is correct, app is broken)
- Obsolete tests for removed features
- Fundamental test design issues
- Ambiguous requirements

## Skill Architecture

The skill uses a **behavior-driven approach** rather than rule-based pattern matching:

1. **Exploration & Understanding** - Examines context before acting
2. **Pattern Recognition** - Identifies common failure patterns
3. **Systematic Debugging** - Forms hypotheses, tests incrementally
4. **Selector Strategy** - Prefers semantic selectors (role > label > testid)
5. **Timing Intelligence** - Uses event-based waits (not arbitrary timeouts)
6. **Context Management** - Follows existing codebase patterns
7. **Validation & Verification** - Confirms fixes work, checks for regressions
8. **Escalation Judgment** - Knows when to ask for human help

## Testing

The skill was tested against 6 diverse failure scenarios:
- Selector failures (ambiguous, missing, dynamic classes)
- Async/timing failures (missing waits)
- Navigation/routing failures (route guards)
- Form interaction failures (missing fills)

See `/home/user/ecom-react/AGENT_TESTING_LOG.md` for detailed results.

## Documentation

- **Full prompt**: `/home/user/ecom-react/E2E_TEST_AGENT_PROMPT_V1.md`
- **Test taxonomy**: `/home/user/ecom-react/TEST_BREAKING_PLAN.md`
- **Testing log**: `/home/user/ecom-react/AGENT_TESTING_LOG.md`
- **Final report**: `/home/user/ecom-react/E2E_AGENT_FINAL_REPORT.md`

## Version History

### v1.0.0 (2025-11-14)
- Initial release
- Tested on 6 scenarios with 100% success rate
- Supports Playwright E2E tests for React applications
- Handles selectors, timing, navigation, forms, and more
