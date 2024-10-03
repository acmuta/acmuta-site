import type { Event } from "@/lib/types.d.ts";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const calendarId = process.env.GOOGLE_CALENDAR_ID;
const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const year = parseInt(url.searchParams.get("year") || "0", 10);
  const month = parseInt(url.searchParams.get("month") || "0", 10);

  // Fetch all events
  const response = await fetch(`${endpoint}?key=${process.env.CALENDAR_API_KEY}`, {
    cache: "no-store",
  });
  
  const data = await response.json();
  const items = data.items as unknown[] | undefined;

  // If no items found, return 404
  if (!items || !Array.isArray(items) || items.length === 0) {
    return new Response("No events found", { status: 404 });
  }

  // Filter and transform events in a single pass
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
    .filter((event: Event) => {
      // Ensure start is defined and is a valid date
      return event.start !== undefined && event.start > now;
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // If year and month are provided, filter further by date
  if (year && month) {
    const earliest = new Date(year, month, 1);
    const latest = new Date(year, month + 1, 0);
    
    const filteredEvents = upcoming.filter((event: Event) => {
      // Check if start is defined and falls within the date range
      return event.start !== undefined && event.start >= earliest && event.start <= latest;
    });

    return NextResponse.json(filteredEvents);
  }

  return NextResponse.json(upcoming);
}
