// src/app/api/bookings/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bookings/:id
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            duration: true,
            color: true,
            slug: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/bookings/:id  — used to cancel or reschedule a booking
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, startTime, endTime, notes } = body;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const dataToUpdate = {};

    if (status) {
      if (!["confirmed", "cancelled"].includes(status)) {
        return NextResponse.json(
          { error: "Status must be 'confirmed' or 'cancelled'" },
          { status: 400 }
        );
      }
      dataToUpdate.status = status;
    }

    // Handle Rescheduling
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      // Check for double booking (excluding the current booking itself)
      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: id }, // exclude self
          status: { not: "cancelled" },
          OR: [
            {
              startTime: { lt: end },
              endTime: { gt: start },
            },
          ],
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "This time slot is already booked. Please select a different time." },
          { status: 409 }
        );
      }

      dataToUpdate.startTime = start;
      dataToUpdate.endTime = end;
      if (notes !== undefined) dataToUpdate.notes = notes;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: dataToUpdate,
      include: {
        eventType: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/bookings/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
