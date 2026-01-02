'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ORG_TIMEZONE = 'America/Chicago';

type EventItem = {
  id: string;
  title: string;
  date: string;     
  time: string;          
  location: string;
  type: 'Workshop' | 'Meeting' | 'Panel' | 'Social' | 'Hackathon' | 'Guest Speaker';
  committee: string;
  description: string;
  registerUrl?: string;  
};

function parseTimeRange(dateISO: string, timeRange: string) {
  const [startStr, endStr] = timeRange.split('-').map(s => s.trim());
  const to24h = (s: string) => {
    const m = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return '00:00';
    let [_, h, min, ap] = m;
    let hh = parseInt(h, 10);
    if (/PM/i.test(ap) && hh !== 12) hh += 12;
    if (/AM/i.test(ap) && hh === 12) hh = 0;
    return `${String(hh).padStart(2, '0')}:${min}`;
  };
  const s24 = to24h(startStr);
  const e24 = to24h(endStr);
  const start = new Date(`${dateISO}T${s24}:00`);
  const end = new Date(`${dateISO}T${e24}:00`);
  return { start, end };
}

function formatForGoogle(dt: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
}

function toGoogleCalendarUrl(event: EventItem, timeZone = ORG_TIMEZONE) {
  const { start, end } = parseTimeRange(event.date, event.time);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatForGoogle(start)}/${formatForGoogle(end)}`,
    location: event.location,
    details: event.description,
    ctz: timeZone
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeICS(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}
function formatICSDateUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}${m}${day}T${h}${min}${s}Z`;
}
function downloadICS(event: EventItem) {
  const { start, end } = parseTimeRange(event.date, event.time);
  const uid = `${event.id}@acmuta`;
  const now = new Date();
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ACM UTA//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDateUTC(now)}`,
    `DTSTART:${formatICSDateUTC(start)}`,
    `DTEND:${formatICSDateUTC(end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    `LOCATION:${escapeICS(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const Events = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.events-hero',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.calendar-section',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.calendar-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      const cards = gsap.utils.toArray('.event-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.events-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const upcomingEvents: EventItem[] = [
    {
      id: 'acm-gbm-2',
      title: 'ACM Second General Body Meeting',
      date: '2025-10-16',
      time: '12:00 PM - 1:00 PM',
      location: 'University Hall 11, UTA Campus',
      type: 'Meeting',
      committee: 'Operations',
      description:
        'Connect for updates, recent wins, ways to get involved, and grab pizza during the lunch-hour GBM.',
      registerUrl: 'https://mavengage.uta.edu/event/11617113'
    },
    {
      id: 'breaking-in-tech',
      title: 'Breaking In: How Students Land their First Tech Roles',
      date: '2025-10-22',
      time: '12:00 PM - 1:00 PM',
      location: 'SWSH 221, UTA Campus',
      type: 'Guest Speaker',
      committee: 'Educate',
      description:
        'Guest speaker session on strategies to land a first tech role, with practical guidance on recruiting and interviews.',
      registerUrl: 'https://mavengage.uta.edu/event/11567327'
    },
    {
      id: 'adobe-connect-express',
      title: 'Adobe Connect: Adobe Express Workshop',
      date: '2025-10-24',
      time: '5:00 PM - 6:30 PM',
      location: 'SEIR 294, UTA Campus',
      type: 'Workshop',
      committee: 'Educate',
      description:
        'Interactive workshop with Adobe Student Ambassadors on Adobe Express; quick design skills, social content tips, and possible free merch.',
      registerUrl: 'https://mavengage.uta.edu/event/11737118'
    },
    {
      id: 'halloween-bash',
      title: 'Halloween Bash at the MAC',
      date: '2025-10-26',
      time: '5:00 PM - 8:00 PM',
      location: 'MAC Upper Lounge, UTA Campus',
      type: 'Social',
      committee: 'Community',
      description:
        'Campus Halloween party in collaboration with 15+ engineering orgs; costumes and community vibes encouraged.',
      registerUrl: '/register/halloween-bash'
    }
  ];

  const getEventTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      Workshop: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Meeting: 'bg-green-500/20 text-green-300 border-green-500/30',
      Panel: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      Social: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      Hackathon: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colorMap[type] || 'bg-accent/20 text-accent border-accent/30';
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="events-hero section-padding">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-8">
            Events & Calendar
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Stay up-to-date with workshops, hackathons, social events, and more. Our calendar is
            packed with opportunities to learn, network, and have fun!
          </p>
        </div>
      </section>

      {/* Google Calendar Embed (styled, footer hidden) */}
      <section className="calendar-section section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">Event Calendar</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              View all our upcoming events. Add them to your calendar and never miss out.
            </p>
          </div>

          <div className="relative mx-auto max-w-6xl">
            {/* gradient frame behind */}
            <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 blur-[6px] opacity-70" />
            <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10">
              {/* header */}
              <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="text-sm text-white/70">ACM UTA Google Calendar</div>
                <a
                  href="https://calendar.google.com/calendar/embed?src=3641f8a99a85a1d90c95d3f216188f496ccfca9b84148f5e8cddc635dda248eb%40group.calendar.google.com&ctz=America%2FChicago"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-sm glass-card hover:bg-white/10 transition"
                >
                  Open in Google
                </a>
              </div>

              {/* embed */}
              <div className="p-4">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_1px,rgba(255,255,255,0.02)_1px)] [background-size:18px_18px]" />
                  <iframe
                    title="ACM UTA Event Calendar"
                    className="absolute inset-0 w-full h-full rounded-xl invert hue-rotate-180 contrast-100"
                    style={{ border: 0 }}
                    src={
                      'https://calendar.google.com/calendar/embed' +
                      '?src=3641f8a99a85a1d90c95d3f216188f496ccfca9b84148f5e8cddc635dda248eb%40group.calendar.google.com' +
                      '&ctz=America%2FChicago' +
                      '&mode=MONTH' +
                      '&showTitle=0&showTabs=0&showPrint=0&showCalendars=0&showTz=0' +
                      '&wkst=1&bgcolor=%230b1220'
                    }
                  />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-bg-dark/95 rounded-b-xl shadow-[0_-6px_16px_rgba(0,0,0,0.35)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events List */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Upcoming Major Events
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Get details about our upcoming events and mark your calendar!
            </p>
          </div>

          <div className="events-list space-y-8 max-w-4xl mx-auto">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="event-card glass-card p-8 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                  {/* Date */}
                  <div className="lg:col-span-1">
                    <div className="glass-card p-4 text-center">
                      <div className="text-3xl font-bold text-accent mb-1">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-white/70 text-sm font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-white/60 text-sm">
                        {new Date(event.date).getFullYear()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-white/70 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm border ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {event.type}
                          </span>
                          <span className="text-accent font-medium">{event.committee}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-white/80 leading-relaxed mb-4">{event.description}</p>

                    <div className="space-y-2 text-white/70">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-accent" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-accent" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex flex-col space-y-3 text-center relative">
                    {/* Register */}
                    <a
                      href={event.registerUrl || '#'}
                      target={event.registerUrl ? '_blank' : undefined}
                      rel={event.registerUrl ? 'noreferrer' : undefined}
                      className={`btn-primary w-full text-sm ${
                        !event.registerUrl ? 'pointer-events-none opacity-60' : ''
                      }`}
                      aria-disabled={!event.registerUrl}
                    >
                      Register
                    </a>

                    {/* Add to Calendar menu */}
                    <div className="relative">
                      <button
                        className="btn-secondary w-full text-sm"
                        onClick={() => setOpenMenu(openMenu === event.id ? null : event.id)}
                      >
                        Add to Calendar
                      </button>
                      {openMenu === event.id && (
                        <div
                          className="absolute z-20 mt-2 w-full rounded-lg border border-white/10 bg-bg-dark/95 backdrop-blur p-2 space-y-1"
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <a
                            className="block px-3 py-2 hover:bg-white/10 rounded text-left text-sm"
                            href={toGoogleCalendarUrl(event)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Google Calendar
                          </a>
                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm"
                            onClick={() => {
                              downloadICS(event);
                              setOpenMenu(null);
                            }}
                          >
                            Download .ics (Apple/Outlook)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Info */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">Types of Events</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We host a variety of events throughout the year to cater to different interests and
              skill levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                type: 'Workshops',
                description:
                  'Hands-on learning sessions covering programming languages, frameworks, and tools.',
                icon: '🛠️'
              },
              {
                type: 'Hackathons',
                description:
                  'Competitive coding events where teams build projects in 24-48 hours.',
                icon: '💻'
              },
              {
                type: 'Guest Speakers',
                description:
                  'Industry professionals sharing insights about careers and technology trends.',
                icon: '🎤'
              },
              {
                type: 'Social Events',
                description:
                  'Game nights, movie screenings, and networking opportunities.',
                icon: '🎮'
              },
              {
                type: 'Career Fairs',
                description:
                  'Meet with recruiters and learn about internship and job opportunities.',
                icon: '💼'
              },
              {
                type: 'Study Groups',
                description:
                  'Collaborative learning sessions for classes and certification exams.',
                icon: '📚'
              }
            ].map((eventType, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center hover:bg-white/10 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{eventType.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{eventType.type}</h3>
                <p className="text-white/70">{eventType.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gradient mb-6">Never Miss an Event</h2>
            <p className="text-xl text-white/80 mb-8">
              Join our mailing list to receive event announcements, reminders, and exclusive
              updates about ACM UTA activities.
            </p>
            <a
              href="https://forms.gle/vvu4T9SKP5LnZtgs6"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
            >
              Join Our Mailing List
              <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
