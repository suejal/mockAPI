import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/** Default fallback schema when LLM returns invalid JSON */
const FALLBACK_SCHEMA = {
  items: {
    id: "number",
    name: "string",
    description: "text",
  },
};

/**
 * Convert a plain English prompt into a JSON schema using Groq LLM.
 * @param {string} prompt - e.g. "users with name, email, age"
 * @returns {Promise<Record<string, Record<string, string>>>} parsed JSON schema
 */
export async function generateSchema(prompt) {
  const systemPrompt = `You are a JSON schema generator. Given a plain English description, return ONLY a valid JSON object representing the schema. No markdown, no explanation, no code fences.

Each top-level key is a resource name (plural).
Each value is an object where keys are field names and values are one of: "string", "number", "email", "text".

Example input: "users with name, email, age"
Example output:
{
  "users": {
    "name": "string",
    "email": "email",
    "age": "number"
  }
}

Return ONLY the JSON object. Nothing else.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";

    // Try to extract JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in LLM response:", raw);
      return FALLBACK_SCHEMA;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate structure: each value should be an object with string values
    for (const [resource, fields] of Object.entries(parsed)) {
      if (typeof fields !== "object" || fields === null || Array.isArray(fields)) {
        console.error(`Invalid schema for resource "${resource}"`);
        return FALLBACK_SCHEMA;
      }
      for (const [field, type] of Object.entries(fields)) {
        if (!["string", "number", "email", "text"].includes(type)) {
          // Coerce unknown types to "string"
          parsed[resource][field] = "string";
        }
      }
    }

    return parsed;
  } catch (error) {
    console.error("Error generating schema:", error.message);
    return FALLBACK_SCHEMA;
  }
}

