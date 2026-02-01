/**
 * JSON Schema definitions for hotel booking tools.
 * These definitions match the functions in tools.ts exactly.
 * Used by the LLM to understand available tools and their signatures.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}

/**
 * Tool definitions for the agent.
 * Each definition maps to a function in tools.ts.
 */
export const toolDefinitions: ToolDefinition[] = [
  {
    name: "searchHotels",
    description:
      "Search for available hotels in a city within a price range. Optionally filter by check-in date.",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name to search for hotels",
        },
        maxPrice: {
          type: "number",
          description: "Maximum price per night in USD",
        },
        checkInDate: {
          type: "string",
          description: 'Optional check-in date in YYYY-MM-DD format',
        },
      },
      required: ["city", "maxPrice"],
    },
  },
  {
    name: "bookHotel",
    description:
      "Book a hotel for a user. Returns a booking confirmation with total price.",
    inputSchema: {
      type: "object",
      properties: {
        hotelId: {
          type: "string",
          description: "ID of the hotel to book",
        },
        userId: {
          type: "string",
          description: "ID of the user making the booking",
        },
        checkInDate: {
          type: "string",
          description: "Check-in date in YYYY-MM-DD format",
        },
        checkOutDate: {
          type: "string",
          description: "Check-out date in YYYY-MM-DD format",
        },
      },
      required: ["hotelId", "userId", "checkInDate", "checkOutDate"],
    },
  },
];
