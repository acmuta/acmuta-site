import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Retrieve environment variables from your .env file
const calendarId = process.env.GOOGLE_CALENDAR_ID;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/oauth2callback'; // Change to your production URL as needed

// Set up OAuth2 client
const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

// Use a refresh token if you have one, or set up OAuth2.0 flow
auth.setCredentials({
  refresh_token: 'YOUR_REFRESH_TOKEN_HERE', // Obtain from OAuth2.0 consent flow
});

// Create a Google Calendar client
const calendar = google.calendar({ version: 'v3', auth });

// Handler function to get events from Google Calendar
export async function GET() {
  try {
    // Fetch events from Google Calendar API
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(), // Events from the current time onwards
      maxResults: 10, // Maximum number of events to retrieve
      singleEvents: true, // Expand recurring events into individual instances
      orderBy: 'startTime', // Order events by start time
    });

    // Extract event items
    const events = response.data.items || [];

    // Return events as a JSON response
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Unable to fetch events' }, { status: 500 });
  }
}
