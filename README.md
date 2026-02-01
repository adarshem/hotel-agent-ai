# Hotel Agent AI – Learning Project

This project is a **learning-focused AI agent system** built with Next.js, Node.js, and OpenAI's LLM.  
It demonstrates **spec-driven development** with AI-assisted coding using GitHub Copilot Agent Mode.

---

## Features

- LLM-driven agent loop for hotel booking
- Tool-driven architecture:
  - `searchHotels` and `bookHotel` implemented in-memory
- API route to trigger the agent: `/api/agent`
- Incremental and spec-driven development workflow
- Full logging of tool calls for learning
- Clear separation between agent, tools, and API

---

## Project Structure
```
hotel-agent-ai/
├─ docs/
│   ├─ sdd.md           # System spec
├─ src/
│   ├─ lib/
│   │   ├─ tools.ts
│   │   ├─ toolDefinitions.ts
│   │   └─ agent.ts
│   ├─ app/
│   │   └─ api/
│   │       └─ agent/
│   │           └─ route.ts
├─ AGENTS.md             # Agent behavior rules for Copilot
├─ package.json
├─ tsconfig.json
├─ .gitignore
└─ README.md
```

---

## Prerequisites

- Node.js >= 18
- npm
- OpenAI API key

---

## Setup

1. Clone the repo:

```bash
git clone https://github.com/YOUR_USERNAME/hotel-agent-ai.git
cd hotel-agent-ai
pnpm install
```

2. Create .env.local:
```
OPENAI_API_KEY=sk-xxxx
```

## Running the Project
pnpm dev

The agent API is available at:
```
POST http://localhost:3000/api/agent
Content-Type: application/json
{
  "message": "Book a cheap hotel in Vancouver next weekend",
  "userId": "u1"
}
```
Check console logs for step-by-step tool execution.

## Learning Workflow
	•	Use AGENTS.md to guide Copilot Agent
	•	Implement features incrementally
	•	Tools → Agent → API → UI
	•	Keep specs (docs/sdd.md) in sync with implementation