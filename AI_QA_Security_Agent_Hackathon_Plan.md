# AI-Powered QA and Application Security Testing Agent

## Hackathon Project Proposal, Workflow, and Implementation Blueprint

**Document purpose:** Explain the problem, proposed solution, system
workflow, components, and implementation plan to a teammate who is new
to QA automation and application security.

------------------------------------------------------------------------

## 1. Executive Summary

We propose building an **AI-powered QA and application security testing
agent**. A QA tester gives the system a task in plain English---for
example, **"Test authentication"**---and supplies the application's
documentation and/or Git repository. The agent studies the application
context, retrieves relevant standardized testing guidance, creates a
test plan tailored to the application, executes appropriate checks,
verifies potential failures, and produces a report supported by
evidence.

The system combines four capabilities:

1.  **Application understanding:** Read requirements, documentation, and
    relevant source-code files.
2.  **Standards-guided planning:** Use a maintained knowledge base of
    established QA and security testing scenarios.
3.  **Automated execution:** Use the right tool for each
    job---Playwright for browser workflows, Semgrep for static
    source-code analysis, and OWASP ZAP for authorized dynamic web
    testing.
4.  **Evidence-based reporting:** Explain what was tested, what failed,
    why it matters, and how a developer can reproduce the result.

A sandbox, such as a Docker-based environment, helps isolate test
execution. The system should run only against applications and
repositories that the user is authorized to test.

## 2. The Problem

Testing a modern web application requires more than clicking through its
pages. QA and security testers must understand the application's
requirements, identify relevant test scenarios, configure tools, run
tests, investigate failures, and document the results.

Common problems include:

-   **Manual effort:** Testers spend time identifying and repeating test
    steps.
-   **Incomplete coverage:** Important negative cases, edge cases, or
    security controls can be missed.
-   **Generic testing:** A standard checklist may not match the
    application's actual implementation or requirements.
-   **Tool fragmentation:** Browser testing, source-code scanning, and
    dynamic security testing often produce separate outputs.
-   **Unclear findings:** A tool may report a failure or warning without
    enough evidence to reproduce or prioritize it.
-   **Poor reuse:** Useful test scenarios and successful regression
    tests may not be saved in a reusable form.

### Problem statement

How can we build a system that understands a QA tester's request and the
supplied application context, chooses relevant standardized test
scenarios, runs suitable automated checks, and produces reliable,
reproducible findings with evidence?

## 3. Proposed Solution

Build a **repository-aware AI QA and security testing agent**.

Instead of blindly exploring a website or running every available
scanner, the agent uses three sources of information:

-   **Tester instruction:** What feature or behavior should be tested?
-   **Application context:** What do the requirements, documentation,
    and source code say about that feature?
-   **Testing knowledge base:** What established test scenarios and
    security checks are relevant?

The AI uses these inputs to create a tailored testing roadmap.
Specialized tools then execute the checks. Finally, the system verifies
findings where possible and creates a clear report.

### Example request

A QA tester enters:

> "Test authentication for functional and security issues."

The tester supplies the application's repository or documentation. The
agent identifies relevant authentication routes and components, reviews
the stated requirements, retrieves authentication scenarios from its
knowledge base, and creates a prioritized plan. It then runs applicable
browser tests, source-code checks, and authorized dynamic tests before
producing a report.

## 4. End-to-End Workflow

``` mermaid
flowchart TD
    A["1. Tester Input<br/>Task + Repository/Documentation"] --> B["2. Application Analyzer<br/>Understand requirements and code"]
    B --> C["3. Testing Knowledge Base<br/>Retrieve relevant standards and scenarios"]
    C --> D["4. AI Test Planner<br/>Build tailored, prioritized test roadmap"]
    D --> E["5. Safe Execution Orchestrator<br/>Choose and run suitable tools"]
    E --> F["Playwright<br/>Browser and functional tests"]
    E --> G["Semgrep<br/>Static source-code analysis"]
    E --> H["OWASP ZAP<br/>Authorized dynamic web testing"]
    F --> I["6. Findings Verification<br/>Review failures and supporting evidence"]
    G --> I
    H --> I
    I --> J["7. Report and Regression Tests<br/>Findings, evidence, fixes, reusable tests"]
```

### Step 1 --- Tester input

The tester provides:

-   A plain-English instruction, such as "Test authentication."
-   A Git repository or application documentation.
-   Optionally, a running test-instance URL and test credentials.
-   Any constraints, such as features in scope, test accounts, or time
    limits.

**Output:** A defined testing task and the available application
context.

**Important:** The system should confirm that the tester is authorized
to test the supplied repository and target environment. Dynamic tests
should run against an approved test instance whenever possible.

### Step 2 --- Application analyzer

The backend analyzes the supplied material to understand the relevant
part of the application.

For a repository, it may inspect:

-   Project structure and framework.
-   Routes, controllers, API endpoints, and relevant UI components.
-   Authentication and authorization logic.
-   Input validation and error handling.
-   Existing tests and configuration.
-   Relevant dependency and security configuration files.

For documentation, it extracts:

-   Functional requirements.
-   Expected behavior.
-   User roles and permissions.
-   Security requirements.
-   Known limitations and assumptions.

The analyzer should focus on files related to the tester's request
rather than sending an entire large repository to the AI model at once.
Relevant snippets can be retrieved as needed.

**Output:** A structured summary of the feature, relevant files and
routes, requirements, assumptions, and missing information.

### Step 3 --- Standards-based testing knowledge base

The backend maintains a curated collection of testing playbooks. These
playbooks contain reusable test ideas, prerequisites, steps, expected
results, risk categories, and references to the relevant standards or
guidance.

Useful starting references include:

-   **OWASP ASVS:** A structured set of security verification
    requirements for web applications.
-   **OWASP WSTG:** Guidance on how to test web application security.
-   **OWASP Top 10:** An awareness resource covering major web
    application security risk categories.
-   **ISTQB testing concepts:** General software testing and test-design
    concepts.
-   **NIST SSDF:** Guidance for integrating security practices into
    software development.

These references serve different purposes; they are not interchangeable.
The project should record the exact source, version, and relevant
section for each playbook where possible, and should not claim complete
standards compliance simply because selected checks were run.

For the MVP, keep the knowledge base as version-controlled structured
files, such as YAML or JSON, with a short explanation and source
reference for each scenario. Retrieve only scenarios relevant to the
current task.

**Example authentication playbook categories:**

-   Valid and invalid login behavior.
-   Empty or malformed input.
-   Password-reset workflow.
-   Logout and session invalidation.
-   Session handling and protected pages.
-   Role and permission enforcement.
-   Rate limiting and repeated failed attempts.
-   Relevant source-code security checks.

**Output:** A shortlist of relevant, traceable testing scenarios.

### Step 4 --- AI test planner

The AI combines the tester's instruction, application analysis, and
retrieved playbooks. It creates a test roadmap tailored to the actual
application.

Each planned test should ideally contain:

-   Test ID and title.
-   Feature or requirement being tested.
-   Risk category and priority.
-   Preconditions and test data.
-   Steps or actions.
-   Expected result.
-   Suggested execution method or tool.
-   Evidence to collect.
-   Source requirement or playbook reference.
-   Safety constraints and any assumptions.

The planner should distinguish between:

-   **Applicable:** The application context supports running the test.
-   **Needs clarification:** Expected behavior or prerequisites are
    unclear.
-   **Not applicable:** The feature does not appear to exist or is
    outside scope.
-   **Not yet verified:** A scenario is proposed but has not been
    executed.

The AI must not invent application requirements. If a requirement is
unclear, it should flag the uncertainty instead of silently treating its
assumption as fact.

**Output:** A prioritized, structured test plan that the execution
service can validate.

### Step 5 --- Safe execution orchestrator

The orchestrator selects the appropriate tool for each planned check,
starts the required environment, enforces limits, and collects outputs.

#### A. Playwright --- browser and functional testing

Playwright automates browser actions. It can open pages, click buttons,
fill forms, navigate user journeys, check visible content and
application state, and capture screenshots and traces.

Example authentication checks:

1.  Open the login page.
2.  Submit valid test credentials.
3.  Verify the documented successful-login behavior.
4.  Submit an invalid password.
5.  Verify the expected error behavior.
6.  Log out and test whether protected pages remain accessible.

Playwright is not merely a click tool: it can also make assertions and
collect browser evidence. It does not independently decide the overall
testing strategy; the planner provides the test cases.

#### B. Semgrep --- static application security testing (SAST)

Semgrep analyzes source code for patterns associated with bugs and
security weaknesses. It can be used to examine relevant files for issues
such as unsafe coding patterns or missing protections covered by
available rules.

Semgrep findings are signals that need interpretation. A matching rule
does not automatically prove that an exploitable vulnerability exists,
and a clean scan does not prove that the application is secure.

#### C. OWASP ZAP --- dynamic application security testing (DAST)

OWASP ZAP tests a running web application by observing and sending HTTP
requests. Depending on configuration, it can identify potential web
security issues that are visible during dynamic testing.

Use it only against an authorized target, preferably a dedicated test
instance. Configure the scope and scan strength to avoid affecting
unrelated systems or disrupting the application. Some checks may require
authentication or carefully prepared test data.

#### D. Docker sandbox --- isolated execution

Docker can provide a controlled environment for running test workers and
tools. Depending on the design, the sandbox may contain the test runner,
browser dependencies, scanning tools, and temporary artifacts.

The sandbox should have sensible resource limits, restricted
permissions, and controlled network access. Do not mount secrets or the
host filesystem unnecessarily. A container is an isolation aid, not a
guarantee of perfect security.

**Output:** Raw test results, exit statuses, logs, screenshots, traces,
scanner findings, and metadata for each execution.

### Step 6 --- Failure and finding verification

A failed test or scanner alert is not automatically a confirmed bug. The
system should assess whether the evidence supports the finding.

Verification can include:

-   Checking whether the test actually ran to completion.
-   Reviewing the assertion, browser console, network response, and
    relevant logs.
-   Distinguishing a product defect from a setup issue, timeout,
    unavailable service, or flaky test.
-   Re-running a safe, deterministic test when useful.
-   Comparing the observed result against an explicit requirement or
    expected result.
-   Checking whether a static or dynamic security alert is supported by
    the surrounding code and evidence.
-   Recording limitations when a finding cannot be confirmed.

Avoid endless retries: use a small, configurable retry limit. Preserve
the original failure even if a retry passes, and mark inconsistent
results as flaky or inconclusive rather than hiding them.

Use clear finding states, for example:

-   **Confirmed:** Evidence supports the defect or issue.
-   **Potential:** A tool or analysis indicates a plausible issue, but
    confirmation is incomplete.
-   **Inconclusive:** Available evidence is insufficient.
-   **Not reproduced:** A prior result could not be reproduced under the
    recorded conditions.
-   **Test infrastructure failure:** The test could not meaningfully
    assess the application.

**Output:** Findings with a confidence/verification status, supporting
evidence, and known limitations.

### Step 7 --- Reporting and reusable regression tests

The reporting layer turns raw tool output into results a developer can
act on.

Each finding should include, where available:

-   Title and unique ID.
-   Severity and rationale.
-   Status: confirmed, potential, inconclusive, or another defined
    state.
-   Affected route, component, file, or endpoint.
-   Requirement or testing-playbook reference.
-   Preconditions and reproduction steps.
-   Expected versus actual behavior.
-   Supporting screenshot, trace, log, request/response, or code
    location.
-   Explanation of impact.
-   Suggested remediation, clearly identified as a recommendation.
-   Tool name, rule or test ID, timestamp, and execution environment.

The report should also summarize:

-   Total tests planned and executed.
-   Passed, failed, skipped, and inconclusive tests.
-   Coverage limitations.
-   Scanner results and warnings.
-   Issues that require human review.
-   Environment or setup failures.

Where a browser test is reliable and useful, save it as a reusable
Playwright regression test. A regression test can be run again after a
fix to check that the issue has not returned.

**Output:** A readable report, linked evidence, and reusable test
artifacts.

## 5. How the Main Components Fit Together

  -----------------------------------------------------------------------
  Component               Responsibility          What it does not
                                                  replace
  ----------------------- ----------------------- -----------------------
  React dashboard         Collect task details    The backend or testing
                          and display progress    tools
                          and reports             

  Backend API (FastAPI or Receive inputs and      The AI's planning or
  Node.js)                coordinate the workflow tool execution itself

  AI model                Interpret the task,     Deterministic execution
                          reason over retrieved   and verification
                          context, propose tests, 
                          and explain results     

  Repository/document     Extract relevant        A full security audit
  analyzer                requirements, routes,   
                          and source-code context 

  Testing knowledge base  Store versioned,        Application-specific
                          traceable testing       analysis
                          playbooks               

  Test planner            Turn the request and    Actual test execution
                          context into structured 
                          tests                   

  Playwright              Automate browser        Static code analysis
                          workflows and           
                          assertions              

  Semgrep                 Scan source code using  Full runtime behavior
                          applicable rules        testing

  OWASP ZAP               Test an authorized      Source-code analysis
                          running web application 
                          dynamically             

  Docker                  Help isolate execution  Complete security
                          and dependencies        isolation

  Evidence and report     Store results and       Human review for
  service                 generate findings       ambiguous or
                                                  high-impact issues

  Database and artifact   Store run metadata,     The tools that generate
  storage                 plans, statuses, logs,  the evidence
                          and evidence references 
  -----------------------------------------------------------------------

## 6. Example: Testing Authentication End to End

Imagine the QA tester requests:

> "Test authentication for functional and security issues."

The supplied repository contains a login page, a session-based
authentication mechanism, a password-reset route, and role-protected
pages. The actual repository may differ; the agent must discover what
exists rather than assume these features are present.

### What the agent does

1.  **Understand the request:** Define authentication as the testing
    scope.
2.  **Inspect the application:** Find the relevant routes, UI
    components, authentication handlers, session logic, requirements,
    and existing tests.
3.  **Retrieve playbooks:** Select relevant functional and security
    scenarios from the maintained knowledge base.
4.  **Plan tests:** Build prioritized cases with preconditions, test
    data, expected outcomes, and tool assignments.
5.  **Execute browser tests:** Use Playwright for login, invalid
    credentials, logout, and protected-page behavior where supported.
6.  **Analyze source code:** Run applicable Semgrep rules against
    relevant source files.
7.  **Perform dynamic testing:** Run an appropriately scoped OWASP ZAP
    scan against the approved test instance if available and authorized.
8.  **Collect evidence:** Save assertions, screenshots, traces, logs,
    scanner alerts, and relevant code locations.
9.  **Verify findings:** Separate reproducible application defects from
    test failures, tool warnings, and environment problems.
10. **Generate the report:** Present findings with severity, evidence,
    reproduction steps, limitations, and remediation suggestions.
11. **Save regression tests:** Preserve suitable functional tests for
    later runs.

### Illustrative finding

**Title:** Protected page may be accessible without authentication

-   **Scenario:** A user who is not logged in requests a protected route
    directly.
-   **Expected result:** The application's documented access-control
    behavior should be enforced.
-   **Observed result:** The test records whether protected content is
    returned or access is denied.
-   **Evidence:** Route, test steps, response details where appropriate,
    and a screenshot or trace.
-   **Status:** Confirmed only if the observed behavior violates the
    application's actual requirement; otherwise report it as potential,
    inconclusive, or not a defect.
-   **Next step:** Review the relevant access-control implementation and
    create a regression test if a defect is confirmed.

This example is illustrative. The agent must derive actual routes and
expected behavior from the supplied application context.

## 7. Suggested Knowledge-Base Structure

Start with a small, maintainable collection rather than one enormous
document.

``` text
testing-knowledge/
├── README.md
├── functional/
│   ├── authentication.yaml
│   ├── forms-and-validation.yaml
│   └── session-management.yaml
├── security/
│   ├── authentication-security.yaml
│   ├── authorization.yaml
│   └── input-validation.yaml
└── sources/
    └── standards-and-version-notes.md
```

Each scenario should use a consistent schema. For example:

``` yaml
id: AUTH-LOGIN-INVALID-001
title: Reject invalid login credentials
category: authentication
type: functional
priority: high
preconditions:
  - A test account exists.
  - The application is running in an approved test environment.
steps:
  - Open the login page.
  - Submit the test username with an invalid password.
expected_result:
  - The login attempt is rejected.
  - The response does not disclose sensitive authentication details.
suggested_tools:
  - playwright
evidence:
  - test assertion
  - screenshot or trace
references:
  - source: "Project authentication requirements"
    section: "Login behavior"
notes:
  - Confirm the expected error behavior from the actual application requirements.
```

This YAML is a conceptual example; validate the schema and expected
behavior before using it in production. Keep test cases deterministic,
version-controlled, and linked to their sources. Avoid storing real
passwords or secrets in the knowledge base.

## 8. Recommended Backend Workflow

A straightforward backend sequence is:

1.  Create a test-run record and validate the user inputs.
2.  Check repository/URL authorization and execution policy.
3.  Retrieve the supplied documentation and relevant repository files.
4.  Extract requirements and identify the feature under test.
5.  Retrieve matching scenarios from the testing knowledge base.
6.  Ask for clarification if essential requirements, credentials, or
    environment details are missing.
7.  Ask the AI to produce a structured plan conforming to a validated
    schema.
8.  Validate the plan, tool permissions, target scope, and resource
    limits.
9.  Create an isolated execution job.
10. Run selected tools and collect artifacts.
11. Normalize tool outputs into a common finding format.
12. Verify findings and classify uncertainty.
13. Store the final report and artifacts.
14. Display the run status and findings in the dashboard.
15. Offer reusable regression tests where appropriate.

Do not allow the AI model to execute arbitrary shell commands without
validation. Prefer a fixed set of approved actions and tool adapters
with explicit arguments, timeouts, and permissions.

## 9. Suggested Technical Stack

The following is a practical starting point, not a mandatory
requirement.

  -----------------------------------------------------------------------
  Layer                   Suggested technology    Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React                   Task submission, run
                                                  progress, findings, and
                                                  evidence

  Backend                 FastAPI (Python) or     API endpoints and
                          Node.js                 workflow orchestration

  AI                      An available LLM        Planning, context
                          through an approved API interpretation, and
                                                  explanation

  Repository access       Git clone/download with Retrieve authorized
                          access controls         source code

  Document parsing        Suitable PDF/DOCX/text  Extract requirements
                          parsers                 and documentation

  Knowledge base          Version-controlled      Store structured test
                          YAML/JSON files         playbooks

  Browser automation      Playwright              Functional and
                                                  browser-based tests

  SAST                    Semgrep                 Source-code pattern
                                                  analysis

  DAST                    OWASP ZAP               Dynamic web application
                                                  testing

  Execution environment   Docker                  Isolated and repeatable
                                                  tool execution

  Persistence             PostgreSQL or another   Store runs, plans,
                          suitable database       statuses, and findings

  Artifact storage        Local storage for the   Screenshots, traces,
                          MVP; object storage if  logs, and reports
                          needed later            
  -----------------------------------------------------------------------

Keep the initial architecture simple. A single backend service can
orchestrate the workflow at the hackathon stage; separate microservices
are not necessary until there is a demonstrated need.

## 10. MVP Scope and Build Order

The biggest risk is trying to build a full autonomous security platform
before one complete test run works. Build a narrow end-to-end path
first.

### Phase 1 --- End-to-end proof of concept

Build the smallest usable workflow:

-   Accept a tester instruction.
-   Accept a repository or documentation input.
-   Analyze the relevant authentication requirements and files.
-   Retrieve a small set of authentication scenarios.
-   Generate a structured test plan.
-   Execute a few deterministic Playwright tests.
-   Capture results and screenshots.
-   Display a simple report.

**Success criterion:** A tester can request an authentication test and
receive an understandable report with real execution evidence.

### Phase 2 --- Better evidence and reliability

Add:

-   Explicit expected results and assertions.
-   Browser traces and useful logs.
-   Structured statuses for passed, failed, skipped, and inconclusive
    tests.
-   Limited retries and flaky-test handling.
-   Source references for planned scenarios.
-   Finding verification and clear confidence/status labels.
-   Saving reusable regression tests.

### Phase 3 --- Security testing

Add:

-   Semgrep with a selected, documented ruleset.
-   OWASP ZAP against an approved test instance.
-   Target-scope validation and scan limits.
-   Normalization of results from multiple tools.
-   Clear handling of false positives and unverified alerts.

### Phase 4 --- Broader coverage

After the authentication workflow is reliable, expand to:

-   Authorization and role-based access checks.
-   Input validation and form behavior.
-   Session management.
-   More frameworks and repository structures.
-   More playbooks and supported file types.
-   Better dashboard filtering, exports, and run comparison.

### Defer until later

Avoid starting with a large multi-agent architecture, dozens of testing
standards, every possible scanner, or a complex dashboard. First prove
that one feature can be analyzed, tested, and reported end to end.

## 11. Safety, Privacy, and Reliability Requirements

Because the system handles source code and runs security tools, safety
must be part of the design.

-   **Authorization:** Test only repositories and systems the user is
    authorized to assess.
-   **Target allowlisting:** Restrict dynamic scans to approved hosts
    and paths.
-   **Sandboxing:** Run untrusted code and test workers with least
    privilege and appropriate resource limits.
-   **Network control:** Prevent arbitrary outbound access where it is
    not needed; guard against requests to internal services and cloud
    metadata endpoints.
-   **Secret handling:** Avoid exposing credentials, tokens, private
    keys, or environment variables to model prompts and reports.
-   **Data retention:** Define how long repositories, logs, screenshots,
    and reports are retained.
-   **Tool limits:** Apply timeouts, concurrency limits, scan-strength
    controls, and cancellation.
-   **Human review:** Require review for ambiguous, high-impact, or
    potentially disruptive actions.
-   **Evidence integrity:** Keep findings linked to the actual tool
    output and test run that produced them.
-   **Honest reporting:** Never claim that the application is secure
    just because the selected tests passed.
-   **Prompt-injection resistance:** Treat repository files,
    documentation, webpages, and issue text as untrusted data, not as
    instructions that can override the system's safety policy.

## 12. How We Will Measure Success

For the hackathon demonstration, evaluate the project using practical
measures:

-   **Workflow completion:** Can the system complete a request from
    input to report?
-   **Test relevance:** Do generated tests match the actual application
    and stated requirements?
-   **Execution reliability:** Do tests run consistently in the prepared
    environment?
-   **Evidence quality:** Can a developer understand and reproduce a
    finding from the report?
-   **Traceability:** Can a test be traced to a requirement or
    knowledge-base scenario?
-   **Finding quality:** Are confirmed defects separated from potential
    issues and infrastructure failures?
-   **Safe operation:** Does the system remain within the approved
    testing scope?
-   **Reusability:** Can suitable tests be rerun after a code change?

Avoid promising a particular detection rate before evaluating the system
on representative test applications.

## 13. Team Responsibilities

A small team can divide the work into clear modules:

  -----------------------------------------------------------------------
  Workstream                          Main responsibilities
  ----------------------------------- -----------------------------------
  Backend and orchestration           Input validation, run lifecycle,
                                      tool adapters, timeouts, and result
                                      collection

  AI planning and knowledge base      Repository context extraction,
                                      scenario retrieval, structured
                                      test-plan generation

  Test execution and sandbox          Playwright setup, Docker
                                      environment, test artifacts, and
                                      repeatable runs

  Security scanning                   Semgrep and ZAP configuration,
                                      scope restrictions, and result
                                      normalization

  Frontend and reporting              Task submission, run progress,
                                      finding details, screenshots, and
                                      report presentation
  -----------------------------------------------------------------------

Team members can collaborate across these areas. Agree on shared data
formats early so that the planner, executor, and report service can
integrate without guesswork.

## 14. Common Terms for New Team Members

-   **QA (Quality Assurance):** Activities used to check that software
    behaves as expected.
-   **Test case:** A defined set of conditions, steps, and expected
    results.
-   **Test plan:** A structured plan describing which tests will run and
    why.
-   **Playwright:** A browser automation framework that can perform
    actions and verify results.
-   **SAST:** Static Application Security Testing; analyzing source code
    without needing to exercise the running application.
-   **DAST:** Dynamic Application Security Testing; testing an
    application while it is running.
-   **Semgrep:** A tool that scans code using rules to identify patterns
    that may indicate bugs or security issues.
-   **OWASP ZAP:** A web security testing tool for examining running web
    applications.
-   **Docker sandbox:** A container-based environment used to isolate
    and standardize execution.
-   **Regression test:** A test rerun after a change to check that a
    previously working behavior remains correct or a fixed bug does not
    return.
-   **False positive:** A reported issue that is not actually a defect
    under the relevant conditions.
-   **Evidence:** Artifacts such as test output, screenshots, traces,
    logs, HTTP responses, or code locations that support a result.
-   **Knowledge base/playbook:** A maintained set of reusable testing
    scenarios and references.

## 15. Final Project Summary

We are building an AI-powered QA and security testing agent that takes a
tester's instruction and the application's documentation or repository,
understands the relevant feature, retrieves standardized testing
scenarios, generates a tailored test plan, executes checks through
specialized tools, verifies findings, and produces an evidence-backed
report.

The intended division of responsibilities is:

-   **AI:** Understands context, plans tests, and helps explain results.
-   **Knowledge base:** Supplies reusable, traceable testing guidance.
-   **Playwright:** Performs browser interactions and assertions.
-   **Semgrep:** Analyzes source code for potential issues.
-   **OWASP ZAP:** Tests an authorized running web application
    dynamically.
-   **Docker:** Helps isolate and standardize execution.
-   **Verification and reporting:** Turn raw results into clear
    findings, evidence, and reusable tests.

**Our first milestone is not to scan everything. It is to make one
authentication-testing workflow work reliably from the tester's request
to a report backed by real evidence.** Once that foundation works, we
can add authorization, input validation, broader security checks, and
more advanced planning.
