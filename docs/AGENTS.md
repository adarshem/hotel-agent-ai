AGENTS.md

Purpose

This document defines how AI agents should operate in this repository.
It is written for agent-based tools such as GitHub Copilot Agent Mode, Cursor Agents, and future MCP-based agents.

The goal is to ensure agents:
	•	Work predictably
	•	Stay within scope
	•	Produce readable, maintainable code
	•	Optimize for learning over automation

⸻

High-Level Goal

Build a learning-focused AI agent system using Next.js and Node.js.

The primary agent implements a hotel booking assistant that:
	•	Uses LLM reasoning
	•	Dynamically decides which tools to call
	•	Executes tool calls via a controlled loop
	•	Stops once a task is complete

This repository is not production-ready by design.

⸻

Core Principles (Must Follow)
	1.	Spec-Driven Development
	•	Always follow /docs/sdd.md
	•	If a requirement is unclear, choose the simplest possible implementation
	2.	Explicit Over Clever
	•	Prefer readable, linear logic
	•	Avoid over-abstraction
	•	Avoid unnecessary design patterns
	3.	Small, Iterative Changes
	•	Implement one component at a time
	•	Do not modify unrelated files
	4.	Learning First
	•	Add comments where behavior may be confusing to humans
	•	Avoid hiding logic inside helpers unless necessary

⸻

Allowed Capabilities

Agents MAY:
	•	Create or modify files explicitly listed in the spec
	•	Implement mock data and in-memory logic
	•	Add logs for observability
	•	Refactor for clarity if behavior stays the same

Agents MAY NOT:
	•	Add databases
	•	Add authentication
	•	Introduce UI frameworks or styling
	•	Call real external APIs
	•	Add background jobs, queues, or workers

⸻

Agent Roles

Primary Agent: Hotel Booking Agent

Responsibilities:
	•	Interpret user input
	•	Decide which tools to call
	•	Execute tools via the agent loop
	•	Stop when booking is completed

This agent lives in:
	•	src/lib/agent.ts

⸻

Tooling Rules

Tools

Tools are plain Node.js functions.
They must:
	•	Be deterministic
	•	Have clear input/output shapes
	•	Contain no side effects outside memory

Defined in:
	•	src/lib/tools.ts

Tool Definitions

Tool schemas must:
	•	Match tools exactly
	•	Use JSON Schema-compatible definitions
	•	Be simple and explicit

Defined in:
	•	src/lib/toolDefinitions.ts

⸻

Agent Loop Rules

The agent loop must:
	1.	Send messages to the LLM
	2.	Allow the LLM to decide tool usage
	3.	Execute requested tools
	4.	Feed results back to the LLM
	5.	Stop when the LLM returns a final message

Safety constraints:
	•	Maximum tool calls per request: 5
	•	Infinite loops must be prevented

⸻

File Ownership and Boundaries

Agents must respect these boundaries:

File	Responsibility
docs/sdd.md	System specification
AGENTS.md	Agent behavior rules
src/lib/agent.ts	Agent reasoning + loop
src/lib/tools.ts	Tool implementations
src/lib/toolDefinitions.ts	Tool schemas
src/app/api/agent/route.ts	API entry point

Agents should not create new top-level directories unless explicitly instructed.

⸻

Logging and Observability

Agents SHOULD:
	•	Log tool calls
	•	Log tool results
	•	Log step count in the agent loop

Agents SHOULD NOT:
	•	Log chain-of-thought verbatim
	•	Expose internal reasoning to API responses

⸻

Error Handling

When errors occur:
	•	Fail fast
	•	Return a clear error message
	•	Do not retry automatically unless specified

Avoid silent failures.

⸻

Prompting Guidance for Humans

When interacting with agents, humans should:
	•	Reference this file explicitly
	•	Scope requests narrowly
	•	Ask for one change at a time

Recommended phrasing:

“Follow AGENTS.md and implement only the specified file”

⸻

Future Extensions (Not Implement Now)

These ideas are explicitly out of scope:
	•	Memory persistence
	•	Multi-agent collaboration
	•	Real booking APIs
	•	MCP servers (GitHub, Jira, DB)

They may be added later in separate iterations.

⸻

Final Note

If an agent is unsure what to do:
	•	Choose the simplest valid approach
	•	Prefer clarity over completeness
	•	Defer complexity

This repository exists to teach agentic systems, not to hide them behind abstraction.