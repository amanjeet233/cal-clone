// src/app/api/slots/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeAvailableTimeWindows } from "@/lib/slots";

// GET /api/slots?date=YYYY-MM-DD&eventTypeId=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const eventTypeId = searchParams.get("eventTypeId");

    if (!dateStr || !eventTypeId) {
      return NextResponse.json(
        { error: "date and eventTypeId are required" },
        { status: 400 }
      );
    }

    // Parse the date (YYYY-MM-DD) as local date
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    // Fetch event type for duration
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
    });
    if (!eventType) {
      return NextResponse.json({ error: "Event type not found" }, { status: 404 });
    }

    // Fetch availability settings
    const availability = await prisma.availability.findFirst();
    if (!availability) {
      return NextResponse.json({ slots: [] });
    }

    // Fetch existing bookings for this date
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
      where: {
        startTime: { gte: startOfDay, lte: endOfDay },
        status: { not: "cancelled" },
      },
    });

    // Generate slots
    const slots = computeAvailableTimeWindows(
      date,
      availability,
      eventType.duration,
      existingBookings
    );

    return NextResponse.json({ slots, date: dateStr });
  } catch (error) {
    console.error("GET /api/slots error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
