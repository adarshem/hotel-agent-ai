# Hotel Booking AI Agent – Learning Project

## Goal
Build a learning-focused AI agent using Next.js and Node.js.
The agent helps users search and book hotels using LLM reasoning and tool calls.

## Non-Goals
- No real hotel APIs
- No authentication
- No database
- No UI polish

## Architecture
- Next.js App Router
- API route triggers the agent
- Agent uses LLM + tool calling loop
- Tools are simple in-memory functions

## Core Components

### 1. Agent
- Lives in src/lib/agent.ts
- Uses a loop
- Lets the LLM decide which tools to call
- Stops when booking is complete

### 2. Tools
- searchHotels(city, maxPrice, dates)
- bookHotel(hotelId, userId)

### 3. API Route
- POST /api/agent
- Accepts user message
- Returns agent response

## Constraints
- No hardcoded if/else intent routing
- Tool choice must be decided by the LLM
- Clear logging for learning

## Example User Prompt
"Book a cheap hotel in Vancouver next weekend"