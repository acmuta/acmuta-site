import axios from "axios";
import { Event } from "@/lib/types";

// Define the type for the Google Calendar API event
interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string; // Use string because Google Calendar returns dateTime as a string
    date?: string; // All-day event date
  };
  location?: string;
}
export async function GET(req: Request) {
  const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
  const CALENDAR_API_KEY = process.env.CALENDAR_API_KEY;

  // Construct the URL to fetch events
  const url = `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${CALENDAR_API_KEY}&timestamp=${Date.now()}`;

  try {
    // Make a request to the Google Calendar API
    const response = await axios.get<{ items: GoogleCalendarEvent[] }>(url);
    const events = response.data.items; // Get the events from the response

    // Map to extract the specific information
    const modifiedEvents: Event[] = events.map((event) => {
      const startDateTime = event.start.dateTime
        ? new Date(event.start.dateTime)
        : event.start.date
        ? new Date(event.start.date)
        : undefined;

      return {
        id: event.id,
        title: event.summary,
        start: startDateTime,
        location: event.location,
      };
    });

    // Add Cache-Control: no-store to ensure no caching
    return new Response(JSON.stringify(modifiedEvents), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Disable caching for fresh data
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch events" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Disable caching for error responses as well
      },
    });
  }
}
