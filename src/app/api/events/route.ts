import type { Event } from "@/lib/types.d.ts";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const calendarId = process.env.GOOGLE_CALENDAR_ID;
const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

export async function GET() {
  // Fetch and parse data
  const response = await fetch(
    `${endpoint}?key=${process.env.CALENDAR_API_KEY}`,
    { cache: "no-store" }
  );
  const data = await response.json();

  const items = data.items as unknown[] | undefined;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return new Response("No events found", { status: 404 });
  }

  // Use a single pass to parse and filter
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = items
    .filter((item: unknown) => {
      // Check for necessary properties
      return (
        item &&
        typeof item === "object" &&
        "id" in item &&
        "summary" in item &&
        "start" in item &&
        typeof item.start === "object" &&
        item.start !== null &&
        "dateTime" in item.start &&
        typeof item.start.dateTime === "string"
      );
    })
    .map((item: any) => ({
      id: item.id as string,
      title: item.summary as string,
      location: typeof item.location === "string" ? item.location : undefined,
      start: new Date(item.start.dateTime),
    }))
    .filter((event: Event) => event.start !== undefined && event.start > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return new NextResponse<Event[]>(JSON.stringify(upcoming));
}
