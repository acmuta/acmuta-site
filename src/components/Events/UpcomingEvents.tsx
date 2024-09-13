import type { Event } from '@/../lib/types';
import EventTime from './EventTime';

// Use a fixed base URL for development
const BASE_API_URL = 'http://localhost:3000';

const colors = [
  { from: 'from-[#008CF1]', to: 'to-[#00ECEC]' },
  { from: 'from-[#EA7F01]', to: 'to-[#FFC700]' },
  { from: 'from-[#78DFCD]', to: 'to-[#E1EE93]' },
];

export default async function UpcomingEvents() {
  try {
    const res = await fetch(BASE_API_URL + '/api/events', { next: { revalidate: 60 } });
    
    if (!res.ok) {
      console.error('Failed to fetch events:', res.statusText);
      return <div>Error loading events</div>;
    }

    const data = await res.json();

    const events: Event[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      start: item.start ? new Date(item.start) : undefined,
      location: item.location,
    }));

    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 md:w-96">
        {events.slice(0, 3).map((event, i) => (
          <div
            key={event.id}
            className={`my-4 flex h-auto w-full flex-col justify-center bg-gradient-to-r ${
              colors[i % 3].from
            } ${colors[i % 3].to} rounded-lg p-1 shadow-lg`}
          >
            <div className="rounded-lg p-4 backdrop-blur-sm backdrop-filter">
              <h2 className="text-lg font-bold lowercase text-gray-900 md:text-xl">{event.title}</h2>
              {event.start && (
                <EventTime dateString={event.start.toISOString()} location={event.location} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return <div>Error loading events</div>;
  }
}
