// src/app/api/availability/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/availability
export async function GET() {
  try {
    let availability = await prisma.availability.findFirst();

    // Auto-create default if none exists
    if (!availability) {
      availability = await prisma.availability.create({
        data: {
          timezone: "Asia/Kolkata",
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
          startTime: "09:00",
          endTime: "17:00",
        },
      });
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error("GET /api/availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/availability
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      timezone,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      startTime,
      endTime,
    } = body;

    let availability = await prisma.availability.findFirst();

    if (availability) {
      availability = await prisma.availability.update({
        where: { id: availability.id },
        data: {
          timezone,
          monday: Boolean(monday),
          tuesday: Boolean(tuesday),
          wednesday: Boolean(wednesday),
          thursday: Boolean(thursday),
          friday: Boolean(friday),
          saturday: Boolean(saturday),
          sunday: Boolean(sunday),
          startTime,
          endTime,
        },
      });
    } else {
      availability = await prisma.availability.create({
        data: {
          timezone,
          monday: Boolean(monday),
          tuesday: Boolean(tuesday),
          wednesday: Boolean(wednesday),
          thursday: Boolean(thursday),
          friday: Boolean(friday),
          saturday: Boolean(saturday),
          sunday: Boolean(sunday),
          startTime,
          endTime,
        },
      });
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error("PUT /api/availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
