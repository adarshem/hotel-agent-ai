/**
 * Hotel booking agent using OpenAI's tool calling API.
 * Implements a reasoning loop that decides which tools to call.
 */

import OpenAI from 'openai';
import { toolDefinitions } from './toolDefinitions';
import { searchHotels, bookHotel } from './tools';
import { AGENT_SYSTEM_PROMPT } from './agentSystemPrompt';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = 'gpt-4-turbo';
const MAX_TOOL_CALLS = 5;

/**
 * Execute a single tool call by name and arguments.
 * Throws if tool not found or execution fails.
 */
function executeTool(toolName: string, args: Record<string, unknown>): unknown {
  console.log(`[TOOL] Executing: ${toolName}`, JSON.stringify(args));

  if (toolName === 'searchHotels') {
    const result = searchHotels(
      args.city as string,
      args.maxPrice as number,
      args.checkInDate as string | undefined
    );
    console.log(`[TOOL] Result:`, JSON.stringify(result));
    return result;
  }

  if (toolName === 'bookHotel') {
    const result = bookHotel(
      args.hotelId as string,
      args.userId as string,
      args.checkInDate as string,
      args.checkOutDate as string
    );
    console.log(`[TOOL] Result:`, JSON.stringify(result));
    return result;
  }

  throw new Error(`Unknown tool: ${toolName}`);
}

/**
 * Main agent function.
 * Takes a user message and returns a final response.
 * Implements a loop with max 5 tool calls per request.
 */
export async function agent(userMessage: string): Promise<string> {
  console.log(`[AGENT] Starting with message: "${userMessage}"`);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: AGENT_SYSTEM_PROMPT
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  let toolCallCount = 0;
  let stepCount = 0;

  // Agent loop
  while (true) {
    stepCount++;
    console.log(`[AGENT] Step ${stepCount}`);

    // Call the LLM with tools
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 4096,
      tools: toolDefinitions.map((def) => ({
        type: 'function' as const,
        function: {
          name: def.name,
          description: def.description,
          parameters: def.inputSchema as Record<string, unknown>
        }
      })),
      messages
    });

    const message = response.choices[0]?.message;
    const stopReason = response.choices[0]?.finish_reason;

    console.log(`[AGENT] LLM response finish_reason: ${stopReason}`);

    // Check if LLM wants to stop (no more tool calls)
    if (stopReason === 'stop' || !message) {
      // Extract final text message
      const finalMessage = message?.content || '';
      console.log(`[AGENT] Completed after ${stepCount} steps`);
      return finalMessage || 'Booking assistant ready to help.';
    }

    // Process tool calls
    if (!message.tool_calls || message.tool_calls.length === 0) {
      // LLM returned content but no tool calls and not stopping
      const textContent = message.content || '';
      return textContent || "I'm ready to assist with hotel bookings.";
    }

    // Add assistant message to history
    messages.push({
      role: 'assistant',
      content: message.content,
      tool_calls: message.tool_calls
    });

    for (const toolCall of message.tool_calls) {
      if (toolCall.type !== 'function') continue;

      toolCallCount++;
      if (toolCallCount > MAX_TOOL_CALLS) {
        return "I've reached the maximum number of tool calls.";
      }

      try {
        const result = executeTool(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        );

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: errorMessage })
        });
      }
    }
  }
}
