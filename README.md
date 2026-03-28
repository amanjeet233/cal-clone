<<<<<<< HEAD
# CalSchedule — Cal.com Clone

A full-stack scheduling/booking web application replicating Cal.com's design and user experience. Built as part of the Scaler SDE Intern Fullstack Assignment.

---

## 🚀 Tech Stack

| Layer     | Technology                   |
|-----------|------------------------------|
| Frontend  | Next.js 14 (App Router)      |
| Backend   | Next.js API Routes (Node.js) |
| Database  | PostgreSQL (Supabase) via Prisma ORM |
| Styling   | Tailwind CSS                 |
| Calendar  | react-day-picker             |
| Icons     | lucide-react                 |
| Dates     | date-fns                     |

---

## ✅ Features Implemented

### Core Features
- **Event Types Management** — Create, edit, delete event types with title, description, duration, slug, and color
- **Availability Settings** — Set days, time range, and timezone; saved to database
- **Public Booking Page** — Calendar view → time slot selection → booking form → confirmation
- **Double Booking Prevention** — Overlap detection at the API level before creating any booking
- **Bookings Dashboard** — View upcoming/past bookings with cancel functionality
- **Sample Data** — Database is pre-seeded with 3 event types and 4 sample bookings

### Bonus Features
- **Rescheduling Flow** — Users can reschedule a booking to a new time instead of cancelling it.
- Responsive-friendly layout
- Color-coded event types
- Slot generation every 30 minutes within availability window
- Past slots and past dates automatically hidden
- URL slug uniqueness enforced

---

## 🗂️ Database Schema

```
EventType
  id          String   (CUID, PK)
  title       String
  description String?
  duration    Int      (minutes)
  slug        String   (unique)
  color       String
  isActive    Boolean
  createdAt   DateTime
  updatedAt   DateTime

Availability
  id          String   (CUID, PK)
  timezone    String
  monday      Boolean
  tuesday     Boolean
  wednesday   Boolean
  thursday    Boolean
  friday      Boolean
  saturday    Boolean
  sunday      Boolean
  startTime   String   ("HH:mm")
  endTime     String   ("HH:mm")

Booking
  id          String   (CUID, PK)
  eventTypeId String   (FK → EventType)
  name        String
  email       String
  startTime   DateTime
  endTime     DateTime
  status      String   ("confirmed" | "cancelled")
  cancelToken String   (unique, for future cancellation links)
  notes       String?
  createdAt   DateTime
  updatedAt   DateTime
```

**Relationships:** `EventType` has many `Bookings`. On delete of an EventType, its bookings cascade delete.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL Database (Create a free one at [Supabase](https://supabase.com) or Neon)
- npm or yarn

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd cal-clone
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` (paste your Supabase transaction connection URL):

```env
DATABASE_URL="postgresql://postgres.[YOUR_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup (Automated)

You can run the full setup (install, generate prisma client, push schema, and seed data) with one command:

```bash
npm run setup
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to a public GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables:
   - `DATABASE_URL` (from Supabase / Neon / Railway)
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain, e.g. `https://cal-clone.vercel.app`)
4. Deploy

### Free PostgreSQL options
- [Supabase](https://supabase.com) — Free tier, easy setup
- [Neon](https://neon.tech) — Serverless PostgreSQL, free tier
- [Railway](https://railway.app) — Simple deployment, free tier

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.jsx                    # Dashboard — Event Types list
│   ├── layout.jsx                  # Root layout with Sidebar
│   ├── globals.css                 # Global styles + react-day-picker overrides
│   ├── event-types/
│   │   ├── new/page.jsx            # Create new event type
│   │   └── [id]/edit/page.jsx      # Edit event type
│   ├── availability/
│   │   └── page.jsx                # Availability settings
│   ├── bookings/
│   │   └── page.jsx                # Bookings dashboard
│   ├── [slug]/
│   │   ├── page.jsx                # Public booking page
│   │   └── confirmed/page.jsx      # Booking confirmation page
│   └── api/
│       ├── event-types/
│       │   ├── route.js            # GET all, POST create
│       │   └── [id]/route.js       # GET one, PUT update, DELETE
│       ├── availability/
│       │   └── route.js            # GET, PUT
│       ├── slots/
│       │   └── route.js            # GET available slots for a date
│       └── bookings/
│           ├── route.js            # GET all, POST create
│           └── [id]/route.js       # GET one, PATCH cancel, DELETE
├── components/
│   └── Sidebar.jsx                 # Dark sidebar navigation
└── lib/
    ├── prisma.js                   # Prisma singleton
    └── slots.js                    # Slot generation logic
prisma/
├── schema.prisma                   # Database schema
└── seed.js                         # Sample data seeder
```

---

## 🔑 Assumptions Made

1. **Single admin user** — No authentication. A default user is always "logged in" for admin pages (Event Types, Availability, Bookings). The public booking page is accessible without login.
2. **Single availability schedule** — One global schedule shared across all event types (like Cal.com's default behaviour). The database stores one `Availability` record.
3. **30-minute slot intervals** — Slots are generated every 30 minutes within the available window, regardless of event duration. This is standard scheduling practice.
4. **Timezone display only** — Timezone is stored and displayed but slot generation uses server local time. For production, full timezone conversion with `date-fns-tz` would be implemented.
5. **No email notifications** — Email sending (confirmation/cancellation) is listed as a bonus feature and has not been implemented. The confirmation page simulates what the email would show.
6. **Video call location** — All bookings default to "Video call" as the meeting type (standard for modern scheduling apps).

---

## 📸 Key Pages

| URL | Description |
|-----|-------------|
| `/` | Admin dashboard — Event Types list |
| `/event-types/new` | Create a new event type |
| `/event-types/:id/edit` | Edit an existing event type |
| `/availability` | Set available days and hours |
| `/bookings` | View and cancel bookings |
| `/:slug` | Public booking page (share this!) |
| `/:slug/confirmed` | Post-booking confirmation page |

---

## 👨‍💻 Author

Built for Scaler SDE Intern Fullstack Assignment.
# cal-clone
# cal-clone
=======
# cal-clone
>>>>>>> 0c0da2e9a1b7d051d5fca1d0faf5d13b181aad5e
