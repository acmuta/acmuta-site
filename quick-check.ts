import { google } from 'googleapis';

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './service-account.json',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const { data } = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 5,
    timeZone: process.env.SITE_TIMEZONE || 'America/Chicago',
  });

  console.log(data.items?.map(e => ({
    title: e.summary,
    start: e.start,
    end: e.end,
    location: e.location
  })));
}

main().catch(console.error);
