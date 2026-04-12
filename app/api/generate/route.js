import { NextResponse } from "next/server";
import { generateSchema } from "@/lib/groq";
import { generateFakeData } from "@/lib/faker";
import { setStore } from "@/lib/store";

/**
 * POST /api/generate
 * Input: { prompt: string }
 * Output: { schema, resources }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty prompt is required." },
        { status: 400 }
      );
    }

    // Generate schema from the prompt using Groq LLM
    const schema = await generateSchema(prompt.trim());

    // Generate fake data from the schema
    const data = generateFakeData(schema);

    // Store in memory
    setStore(schema, data);

    // Return schema and list of resources
    const resources = Object.keys(schema);

    return NextResponse.json({ schema, resources, data });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate mock API. Please try again." },
      { status: 500 }
    );
  }
}

