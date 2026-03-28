// src/app/api/bookings/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const respondError = (message, code) =>
  NextResponse.json({ error: message, success: false }, { status: code });

export const GET = async () => {
  try {
    const list = await prisma.booking.findMany({
      include: {
        eventType: {
          select: { id: true, title: true, duration: true, color: true, slug: true },
        },
      },
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(list);
  } catch (err) {
    return respondError("Fatal system fault retrieving bookings.", 500);
  }
};

export const POST = async (req) => {
  try {
    const payload = await req.json();
    const { eventTypeId, name, email, notes, startTime, endTime } = payload;

    const missingKeys = ["eventTypeId", "name", "email", "startTime", "endTime"].filter(
      (key) => !payload[key]
    );

    if (missingKeys.length > 0) {
      return respondError(`Missing required payload fields: ${missingKeys.join(", ")}`, 400);
    }

    const emailPattern = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", "i");
    if (!emailPattern.test(email)) {
      return respondError("Provided email address failed format validation", 400);
    }

    const startBound = new Date(startTime);
    const endBound = new Date(endTime);

    const collision = await prisma.booking.findFirst({
      where: {
        status: { not: "cancelled" },
        OR: [
          { startTime: { lt: endBound }, endTime: { gt: startBound } },
        ],
      },
    });

    if (collision) {
      return respondError("Time concurrency conflict detected. Slot is unavailable.", 409);
    }

    const targetEvent = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
    });

    if (!targetEvent) {
      return respondError("Referenced event type does not exist.", 404);
    }

    const createdBooking = await prisma.booking.create({
      data: {
        eventTypeId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        notes: notes ? notes.trim() : null,
        startTime: startBound,
        endTime: endBound,
        status: "confirmed",
      },
      include: { eventType: true },
    });

    return NextResponse.json(createdBooking, { status: 201 });
  } catch (failure) {
    return respondError("Fatal system fault during booking creation.", 500);
  }
};
