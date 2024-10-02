import { NextResponse } from "next/server";
import { GET as getEvents } from "../route";
import type { Event } from "@/lib/types.d.ts";

const calendarId = process.env.GOOGLE_CALENDAR_ID;
const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const year = parseInt(url.searchParams.get("year") || "0", 10);
  const month = parseInt(url.searchParams.get("month") || "0", 10);

  // Fetch filtered events directly
  const filteredEvents = await byDate(month, year);
  return NextResponse.json(filteredEvents);
}

export async function byDate(month: number, year: number): Promise<Event[]> {
  const response = await getEvents(); // Fetch the events data directly
  const data = await response.json(); // Parse the response to JSON
  const earliest = new Date(year, month, 1);
  const latest = new Date(year, month + 1, 0);

  // Filter and transform events in a single pass
  const filteredEvents = data
    .map((item: any) => {
      const startDate = item.start ? new Date(item.start) : undefined; // Ensure start is defined
      return {
        ...item,
        start: startDate,
      };
    })
    .filter((event: Event) => {
      if (!event.start) return false; // Exclude events with no start date
      const eventDate = new Date(event.start);
      return eventDate >= earliest && eventDate <= latest;
    });

  return filteredEvents;
}
