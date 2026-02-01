/**
 * API route for the hotel booking agent.
 * POST /api/agent
 * Body: { message: string, userId: string }
 * Response: { response: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { agent } from '@/lib/agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'message' field" },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'userId' field" },
        { status: 400 }
      );
    }

    console.log(`[API] Request from user ${userId}: "${message}"`);

    // Call the agent with the user message
    const response = await agent(message);

    console.log(`[API] Response: "${response}"`);

    return NextResponse.json({
      response,
      userId
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[API] Error:`, errorMessage);

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
