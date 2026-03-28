// prisma/seed.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default availability
  const existingAvailability = await prisma.availability.findFirst();
  if (!existingAvailability) {
    await prisma.availability.create({
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
    console.log("✅ Created default availability");
  }

  // Create event types
  const eventTypes = [
    {
      title: "30 Minute Meeting",
      description:
        "A quick 30-minute call to discuss your project or ideas. Perfect for initial consultations.",
      duration: 30,
      slug: "30min",
      color: "#0ea5e9",
    },
    {
      title: "60 Minute Meeting",
      description:
        "A full hour deep dive into your project requirements, design discussions, or technical reviews.",
      duration: 60,
      slug: "60min",
      color: "#8b5cf6",
    },
    {
      title: "15 Minute Intro Call",
      description:
        "A short intro call to see if we're a good fit. No preparation needed!",
      duration: 15,
      slug: "intro",
      color: "#10b981",
    },
  ];

  for (const et of eventTypes) {
    const existing = await prisma.eventType.findUnique({
      where: { slug: et.slug },
    });
    if (!existing) {
      await prisma.eventType.create({ data: et });
      console.log(`✅ Created event type: ${et.title}`);
    }
  }

  // Create some sample bookings
  const thirtyMinEvent = await prisma.eventType.findUnique({
    where: { slug: "30min" },
  });
  const sixtyMinEvent = await prisma.eventType.findUnique({
    where: { slug: "60min" },
  });

  if (thirtyMinEvent && sixtyMinEvent) {
    const now = new Date();

    const sampleBookings = [
      {
        eventTypeId: thirtyMinEvent.id,
        name: "Rahul Sharma",
        email: "rahul@example.com",
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 2 days from now, 10 AM
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 10.5 * 60 * 60 * 1000),
        status: "confirmed",
        notes: "Want to discuss a new React project",
      },
      {
        eventTypeId: sixtyMinEvent.id,
        name: "Priya Patel",
        email: "priya@example.com",
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 3 days from now, 2 PM
        endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
        status: "confirmed",
        notes: "Full technical interview preparation session",
      },
      {
        eventTypeId: thirtyMinEvent.id,
        name: "Amit Kumar",
        email: "amit@example.com",
        startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 3 days ago
        endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 11.5 * 60 * 60 * 1000),
        status: "confirmed",
        notes: "Discussed API architecture patterns",
      },
      {
        eventTypeId: sixtyMinEvent.id,
        name: "Sara Johnson",
        email: "sara@example.com",
        startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // 7 days ago
        endTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
        status: "cancelled",
        notes: "Cancelled due to scheduling conflict",
      },
    ];

    for (const booking of sampleBookings) {
      await prisma.booking.create({ data: booking });
    }
    console.log("✅ Created sample bookings");
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
