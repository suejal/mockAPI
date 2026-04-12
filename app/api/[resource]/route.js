import { NextResponse } from "next/server";
import { getData, getResources } from "@/lib/store";

/**
 * GET /api/:resource
 * Returns the mock data array for the given resource.
 */
export async function GET(request, { params }) {
  const { resource } = await params;

  const data = getData(resource);

  if (!data) {
    const available = getResources();
    return NextResponse.json(
      {
        error: `Resource "${resource}" not found.`,
        available_resources: available.length > 0 ? available : "No resources generated yet. POST to /api/generate first.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

