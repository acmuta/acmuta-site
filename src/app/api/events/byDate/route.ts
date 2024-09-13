import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import type { Event } from '@/../lib/types.d.ts';

// Use environment variables for calendar ID and API key
const calendarId = process.env.GOOGLE_CALENDAR_ID;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/oauth2callback'; // Replace with your production URL

// Set up OAuth2 client
const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

// Use a refresh token if you have one, or set up OAuth2.0 flow
auth.setCredentials({
  refresh_token: 'YOUR_REFRESH_TOKEN_HERE', // Obtain from OAuth2.0 consent flow
});

// Create a Google Calendar client
const calendar = google.calendar({ version: 'v3', auth });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const year = parseInt(url.searchParams.get('year') || '', 10);
  const month = parseInt(url.searchParams.get('month') || '', 10);

  // Fetch filtered events by date
  const filteredEvents = await byDate(month, year);

  return new NextResponse<Event[]>(JSON.stringify(filteredEvents));
}

export async function byDate(month: number, year: number): Promise<Event[]> {
  try {
    // Fetch events from Google Calendar API
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date(year, month, 1).toISOString(),
      timeMax: new Date(year, month + 1, 0).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const items = response.data.items || [];

    // Parse the events into the correct format
    const events = items.map((item: any) => ({
      id: item.id as string,
      title: item.summary as string,
      location: item.location || '',
      start: item.start?.dateTime ? new Date(item.start.dateTime) : undefined,
    })) as Event[];

    // Define the earliest and latest dates for filtering
    const earliest = new Date(year, month, 1);
    const latest = new Date(year, month + 1, 0);

    // Filter events by date
    const filteredEvents = events.filter((event) => {
      if (!event.start) return false;
      const eventDate = new Date(event.start);
      return eventDate >= earliest && eventDate <= latest;
    });

    return filteredEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
