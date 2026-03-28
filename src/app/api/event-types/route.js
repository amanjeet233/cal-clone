// src/app/api/event-types/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/event-types OR /api/event-types?slug=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Fetch single event type by slug (for public booking page)
      const eventType = await prisma.eventType.findUnique({
        where: { slug },
      });
      if (!eventType) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(eventType);
    }

    // Fetch all event types
    const eventTypes = await prisma.eventType.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(eventTypes);
  } catch (error) {
    console.error("GET /api/event-types error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/event-types
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, duration, slug, color } = body;

    if (!title || !duration || !slug) {
      return NextResponse.json(
        { error: "Title, duration, and slug are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.eventType.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "This URL slug is already taken. Please choose another." },
        { status: 409 }
      );
    }

    const eventType = await prisma.eventType.create({
      data: {
        title,
        description: description || null,
        duration: parseInt(duration),
        slug,
        color: color || "#0ea5e9",
      },
    });

    return NextResponse.json(eventType, { status: 201 });
  } catch (error) {
    console.error("POST /api/event-types error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
