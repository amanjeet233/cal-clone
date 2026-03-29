// src/app/api/event-types/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/event-types/:id
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const eventType = await prisma.eventType.findUnique({ where: { id } });
    if (!eventType) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(eventType);
  } catch (error) {
    console.error("GET /api/event-types/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/event-types/:id
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, duration, slug, color } = body;

    if (!title || !duration || !slug) {
      return NextResponse.json(
        { error: "Title, duration, and slug are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness (excluding current)
    const existing = await prisma.eventType.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This URL slug is already taken. Please choose another." },
        { status: 409 }
      );
    }

    const updated = await prisma.eventType.update({
      where: { id },
      data: {
        title,
        description: description || null,
        duration: parseInt(duration),
        slug,
        color: color || "#111827",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/event-types/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/event-types/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.eventType.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/event-types/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
