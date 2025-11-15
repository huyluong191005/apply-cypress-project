# Comprehensive Plan for Breaking E2E Tests

## Philosophy

This plan focuses on **fundamental agent behaviors** rather than exhaustive if-else cases. The goal is to identify what core capabilities an e2e test-fixing agent needs to handle diverse failure scenarios autonomously.

## Categories of Test Failures

### 1. SELECTOR FAILURES

These test fundamental agent abilities: **element identification**, **DOM understanding**, **specificity reasoning**

#### 1.1 Ambiguous Selectors (Multiple Element Matches)
- **Break**: Change `page.locator('text=Submit')` when there are multiple Submit buttons
- **Agent Behavior Needed**:
  - Recognize strict mode violations
  - Understand context/scope requirements
  - Scope to appropriate parent containers

#### 1.2 Missing Elements (Elements Don't Exist)
- **Break**: Reference element that was removed from UI (`text=Old Feature`)
- **Agent Behavior Needed**:
  - Distinguish between timing issues vs. removed features
  - Explore codebase to understand UI structure
  - Suggest appropriate replacements or mark as obsolete

#### 1.3 Dynamic Class Name Selectors
- **Break**: Use `[class*="Plus"]` for icon libraries that generate dynamic classes
- **Agent Behavior Needed**:
  - Recognize brittle selector patterns
  - Suggest semantic alternatives (aria-labels, data-testid)
  - Understand component libraries (Lucide, Material-UI, etc.)

#### 1.4 Incorrect Scoping
- **Break**: `page.locator('text=E-Shop')` matching footer instead of header
- **Agent Behavior Needed**:
  - Understand selector specificity
  - Reason about logical element placement
  - Add appropriate parent scoping

#### 1.5 Timing-Dependent Selectors
- **Break**: Elements that load asynchronously without proper waits
- **Agent Behavior Needed**:
  - Distinguish slow loading from missing elements
  - Add appropriate waitFor strategies
  - Balance timeout values (not too short, not excessive)

### 2. ASSERTION FAILURES

These test: **state understanding**, **data flow reasoning**, **expectation validation**

#### 2.1 Wrong Expected Values
- **Break**: `expect(count).toBe(5)` when actual business logic returns 3
- **Agent Behavior Needed**:
  - Trace data flow through application
  - Distinguish test bugs from application bugs
  - Verify business logic before changing assertions

#### 2.2 Flaky Timing Assertions
- **Break**: Check DOM state before async operation completes
- **Agent Behavior Needed**:
  - Identify race conditions
  - Add proper state synchronization
  - Use waitForCondition patterns

#### 2.3 Type Mismatches
- **Break**: `expect(price).toBe('$19.99')` when actual is number `19.99`
- **Agent Behavior Needed**:
  - Understand data types and formatting
  - Recognize common formatting patterns (currency, dates)
  - Apply appropriate type coercion

#### 2.4 Incomplete State Checks
- **Break**: Only check visible state, ignore persistence/localStorage
- **Agent Behavior Needed**:
  - Understand full application state model
  - Verify persistence mechanisms
  - Test state across navigation/reload

### 3. ASYNC/TIMING FAILURES

These test: **concurrency understanding**, **state synchronization**, **patience patterns**

#### 3.1 Missing Waits
- **Break**: Remove `waitForLoadState('networkidle')` after navigation
- **Agent Behavior Needed**:
  - Recognize async operations (navigation, API calls, animations)
  - Apply appropriate wait strategies
  - Avoid arbitrary timeouts (prefer event-based waits)

#### 3.2 Insufficient Timeouts
- **Break**: `{ timeout: 1000 }` for slow-loading element
- **Agent Behavior Needed**:
  - Calibrate timeout values appropriately
  - Distinguish slow vs. missing elements
  - Balance test speed with reliability

#### 3.3 Race Conditions
- **Break**: Click button before state update completes
- **Agent Behavior Needed**:
  - Identify state dependencies
  - Add proper sequencing
  - Use state-based waits instead of time-based

### 4. DATA/STATE MANAGEMENT FAILURES

These test: **test isolation**, **state cleanup**, **fixture management**

#### 4.1 Test Interdependence
- **Break**: Test B depends on state from Test A
- **Agent Behavior Needed**:
  - Recognize missing setup/teardown
  - Ensure proper test isolation
  - Add beforeEach/afterEach hooks

#### 4.2 Incomplete Cleanup
- **Break**: Don't clear localStorage between tests
- **Agent Behavior Needed**:
  - Identify state pollution sources
  - Add comprehensive cleanup
  - Understand application state storage mechanisms

#### 4.3 Invalid Test Data
- **Break**: Use expired credit card date in payment tests
- **Agent Behavior Needed**:
  - Generate appropriate test fixtures
  - Understand data validation rules
  - Keep fixtures maintainable (relative dates, not hardcoded)

#### 4.4 Missing Edge Cases
- **Break**: Only test happy path, ignore empty states, error states
- **Agent Behavior Needed**:
  - Identify untested scenarios
  - Suggest comprehensive test coverage
  - Balance thoroughness with maintainability

### 5. NAVIGATION/ROUTING FAILURES

These test: **application flow understanding**, **URL management**, **page state**

#### 5.1 Incorrect URLs
- **Break**: `await page.goto('/checkout')` when route is `/cart/checkout`
- **Agent Behavior Needed**:
  - Explore routing configuration
  - Verify actual route paths
  - Handle baseURL configuration

#### 5.2 Missing Navigation Waits
- **Break**: Assert on page content immediately after click without waiting
- **Agent Behavior Needed**:
  - Recognize navigation triggers
  - Add waitForURL or waitForLoadState
  - Verify actual navigation occurred

#### 5.3 Guard/Redirect Logic
- **Break**: Try to access checkout with empty cart (gets redirected)
- **Agent Behavior Needed**:
  - Understand route guards
  - Test guard behavior explicitly
  - Set up proper state before navigation

### 6. FORM INTERACTION FAILURES

These test: **user interaction simulation**, **validation understanding**, **form state**

#### 6.1 Missing Form Fills
- **Break**: Submit form without filling required fields
- **Agent Behavior Needed**:
  - Understand form requirements
  - Fill all necessary fields
  - Use appropriate test data

#### 6.2 Incorrect Input Formatting
- **Break**: Fill phone as `1234567890` when UI expects `(123) 456-7890`
- **Agent Behavior Needed**:
  - Recognize input masking/formatting
  - Use formatted values or simulate user typing
  - Understand auto-formatting behavior

#### 6.3 Validation Timing
- **Break**: Check for error message before validation runs
- **Agent Behavior Needed**:
  - Understand validation triggers (blur, submit, real-time)
  - Wait for validation feedback
  - Verify both positive and negative validation

### 7. COMPONENT STATE FAILURES

These test: **React/UI framework understanding**, **component lifecycle**, **rendering behavior**

#### 7.1 Conditional Rendering
- **Break**: Assert element exists when it only shows in certain states
- **Agent Behavior Needed**:
  - Understand conditional rendering logic
  - Set up required preconditions
  - Use appropriate existence checks (count > 0, try-catch)

#### 7.2 Loading States
- **Break**: Assert on content before loading state completes
- **Agent Behavior Needed**:
  - Wait for loading indicators to disappear
  - Verify content appears after loading
  - Handle skeleton states

#### 7.3 Disabled State Logic
- **Break**: Try to click disabled button
- **Agent Behavior Needed**:
  - Check element state before interaction
  - Understand why element is disabled
  - Set up conditions to enable element

### 8. VIEWPORT/RESPONSIVE FAILURES

These test: **responsive design understanding**, **viewport management**, **media queries**

#### 8.1 Mobile vs Desktop Elements
- **Break**: Look for desktop nav when viewport is mobile
- **Agent Behavior Needed**:
  - Understand responsive breakpoints
  - Use viewport-appropriate selectors
  - Configure viewport before tests

#### 8.2 Hidden Elements
- **Break**: Assert visibility on `lg:hidden` element with desktop viewport
- **Agent Behavior Needed**:
  - Recognize CSS hiding patterns
  - Match viewport to test expectations
  - Use correct visibility assertions

### 9. API/NETWORK FAILURES

These test: **network understanding**, **mock management**, **error handling**

#### 9.1 Network Dependencies
- **Break**: Test depends on external API that's down
- **Agent Behavior Needed**:
  - Identify network dependencies
  - Suggest appropriate mocking
  - Handle network timing

#### 9.2 Missing API Waits
- **Break**: Assert on data before API response arrives
- **Agent Behavior Needed**:
  - Recognize API-dependent assertions
  - Wait for network idle or specific requests
  - Verify data loading states

### 10. ENVIRONMENT/CONFIGURATION FAILURES

These test: **environment understanding**, **configuration management**, **setup requirements**

#### 10.1 Missing Environment Setup
- **Break**: Test requires database seed data that doesn't exist
- **Agent Behavior Needed**:
  - Identify environment prerequisites
  - Document or automate setup
  - Suggest appropriate test fixtures

#### 10.2 Browser-Specific Issues
- **Break**: Test passes in Chromium but fails in Firefox
- **Agent Behavior Needed**:
  - Recognize browser differences
  - Use cross-browser compatible patterns
  - Document browser-specific behavior

#### 10.3 Test Execution Mode
- **Break**: Tests fail when run in parallel but pass individually
- **Agent Behavior Needed**:
  - Identify concurrency issues
  - Suggest test isolation improvements
  - Recognize shared state problems

---

## FUNDAMENTAL AGENT BEHAVIORS REQUIRED

Based on the categories above, an effective e2e test-fixing agent needs these core capabilities:

### 1. **Exploration & Understanding**
- Explore codebase to understand UI structure
- Trace component hierarchies
- Understand application routing and state
- Read configuration files (playwright.config, package.json)

### 2. **Pattern Recognition**
- Recognize common failure patterns (strict mode, timing, state)
- Identify brittle test patterns
- Distinguish test bugs from application bugs

### 3. **Systematic Debugging**
- Run tests to observe failures
- Analyze error messages and stack traces
- Form hypotheses about root causes
- Test fixes incrementally

### 4. **Selector Strategy**
- Prefer semantic selectors (role, label, testid)
- Add appropriate scoping
- Avoid brittle patterns (dynamic classes, text that changes)
- Suggest component improvements when needed

### 5. **Timing Intelligence**
- Recognize async operations
- Use appropriate wait strategies
- Balance reliability with speed
- Avoid arbitrary timeouts

### 6. **Context Management**
- Understand test context (beforeEach, describe blocks)
- Ensure proper test isolation
- Manage test data and fixtures
- Clean up state appropriately

### 7. **Validation & Verification**
- Verify fixes by running tests
- Check for unintended side effects
- Ensure fixes are maintainable
- Document non-obvious solutions

### 8. **Iterative Refinement**
- Try fix → run test → analyze → refine
- Keep track of what was tried
- Don't repeat failed approaches
- Know when to ask for help or more information

---

## UNFIXABLE OR AGENT-INAPPROPRIATE CASES

Some scenarios are probably not appropriate for autonomous agent fixing:

### 1. **Fundamental Test Design Issues**
- Tests that test implementation details rather than behavior
- Tests that duplicate coverage unnecessarily
- Tests that should be unit tests, not e2e tests
→ **Human Decision Required**: Test architecture decisions

### 2. **Application Bugs (Not Test Bugs)**
- When the test correctly identifies a broken feature
- When business logic has changed but tests are correct
→ **Human Decision Required**: Confirm if bug is in app or test

### 3. **Ambiguous Requirements**
- Unclear what behavior should be tested
- Conflicting test assertions
- Missing acceptance criteria
→ **Human Input Required**: Clarify requirements

### 4. **Infrastructure Issues**
- Test environment not properly configured
- Missing required services (database, APIs)
- Browser/driver incompatibilities
→ **Environment Setup Required**: May need devops/admin access

### 5. **Intentionally Failing Tests**
- Tests marked as `.skip` or `.todo`
- Tests documenting known bugs
→ **Preserve Intent**: Don't "fix" intentionally failing tests

---

## TEST BREAKING EXECUTION PLAN

### Phase 1: Selector Failures (Basic)
1. Create duplicate "Submit" button → test ambiguous selector handling
2. Remove referenced element → test missing element detection
3. Change icon library classes → test dynamic class handling

### Phase 2: Selector Failures (Advanced)
4. Add footer with same text as header → test scoping needs
5. Make element load after 3 seconds → test timing awareness

### Phase 3: Assertion Failures
6. Change cart count business logic → test assertion validation
7. Add formatting to prices → test type/format handling
8. Make async state update → test timing assertions

### Phase 4: Data/State Failures
9. Remove localStorage.clear() → test cleanup detection
10. Make tests interdependent → test isolation checking
11. Use past dates in fixtures → test data validation

### Phase 5: Complex Scenarios
12. Add route guard → test navigation understanding
13. Add form validation → test form interaction
14. Add mobile-only element → test viewport awareness
15. Make API call required → test network dependencies

### Phase 6: Unfixable Cases
16. Create fundamentally broken test → verify agent knows to escalate
17. Break application (not test) → verify agent distinguishes
18. Create ambiguous requirement → verify agent asks for clarification

---

## SUCCESS CRITERIA FOR AGENT

An effective agent should:

✅ **Autonomously fix** 80%+ of common test failures (selectors, timing, data)
✅ **Correctly identify** unfixable cases and escalate appropriately
✅ **Maintain test quality** - fixes should be maintainable and semantic
✅ **Preserve intent** - understand what test is trying to verify
✅ **Iterate effectively** - try fix → verify → refine
✅ **Document decisions** - explain non-obvious solutions
✅ **Avoid anti-patterns** - don't use brittle selectors or excessive waits

❌ **Should NOT**:
- Fix by removing test assertions
- Use overly long arbitrary timeouts (>30s)
- Change application code when test should change
- Make tests more brittle
- Skip tests instead of fixing them
- Batch changes without verification
