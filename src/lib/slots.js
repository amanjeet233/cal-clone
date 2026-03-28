// src/lib/slots.js
// Completely custom slot window generation logic

export const computeAvailableTimeWindows = (targetDate, settings, eventMins, bookedEvents) => {
  const weekDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  const currentDay = weekDays[targetDate.getDay()];
  if (!settings[currentDay]) return [];

  const presentDay = new Date();
  presentDay.setHours(0, 0, 0, 0);
  const verifyDate = new Date(targetDate);
  verifyDate.setHours(0, 0, 0, 0);
  if (verifyDate < presentDay) return [];

  const [startHour, startMin] = settings.startTime.split(":").map(Number);
  const [endHour, endMin] = settings.endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  const validWindows = [];
  const RIGHT_NOW = new Date();

  const possibleStarts = Array.from(
    { length: Math.floor((endTotalMinutes - startTotalMinutes) / 30) + 1 },
    (_, i) => startTotalMinutes + i * 30
  ).filter((t) => t + eventMins <= endTotalMinutes);

  for (const cursorMins of possibleStarts) {
    const hr = Math.floor(cursorMins / 60);
    const mn = cursorMins % 60;
    const timeFormatted = `${String(hr).padStart(2, "0")}:${String(mn).padStart(2, "0")}`;

    const slotBeginTime = new Date(targetDate);
    slotBeginTime.setHours(hr, mn, 0, 0);
    const slotEndTime = new Date(slotBeginTime.getTime() + eventMins * 60000);

    if (slotBeginTime <= RIGHT_NOW) continue;

    const hasConflict = bookedEvents.some((evt) => {
      if (evt.status === "cancelled") return false;
      return slotBeginTime < new Date(evt.endTime) && slotEndTime > new Date(evt.startTime);
    });

    if (!hasConflict) {
      validWindows.push(timeFormatted);
    }
  }

  return validWindows;
};

export const format12HourTimeString = (time24String) => {
  const [h, m] = time24String.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${displayHour}:${String(m).padStart(2, "0")} ${suffix}`;
};

export const CALENDAR_TIMEZONES = [
  "Asia/Kolkata",
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
];
