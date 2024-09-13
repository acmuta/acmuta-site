'use client';

type Props = {
  dateString: string;
  location?: string;
};

export default function UpcomingEventCard({ dateString, location }: Props) {
  const date = new Date(dateString);
  return (
    <p className="mt-2 text-sm font-medium text-gray-700 md:text-base">
      {date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })}{' '}
      at{' '}
      {date?.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: date.getMinutes() > 0 ? 'numeric' : undefined,
        timeZoneName: 'short',
      })}{' '}
      in {location}
    </p>
  );
}
