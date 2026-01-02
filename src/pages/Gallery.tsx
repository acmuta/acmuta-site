
import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Calendar as CalendarIcon, Eye, SortAsc, SortDesc } from 'lucide-react';
import { gallery, Album } from '@/data/gallery';

function parseTitleFromHtml(html: string): string | null {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (og?.[1]) return og[1].trim();
  const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (t?.[1]) return t[1].trim();
  return null;
}

function proxyUrl(url: string) {
  const stripped = url.replace(/^https?:\/\//i, '');
  return `https://r.jina.ai/http://${stripped}`;
}

function toSortableTime(a: Album): number {
  if (a.date) {
    const t = Date.parse(a.date);
    if (!Number.isNaN(t)) return t;
  }
  const id = String(a.id);
  const m = id.match(/(\d{4})[-_/]?(\d{1,2})[-_/]?(\d{1,2})/);
  if (m) {
    const [_, y, mo, d] = m;
    const dt = new Date(
      Number(y),
      Number(mo) - 1,
      Number(d)
    ).getTime();
    if (!Number.isNaN(dt)) return dt;
  }
  return 0;
}

type SortKey = 'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc';

export default function Gallery() {
  const [autoTitles, setAutoTitles] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [sortKey, setSortKey] = useState<SortKey>('dateDesc');

  useEffect(() => {
    let cancelled = false;
    async function hydrateTitles() {
      await Promise.allSettled(
        gallery.map(async (album) => {
          if (!album.title && album.link) {
            setLoadingIds((s) => ({ ...s, [album.id]: true }));
            try {
              const res = await fetch(proxyUrl(album.link));
              if (!res.ok) return;
              const html = await res.text();
              const parsed = parseTitleFromHtml(html);
              if (!cancelled && parsed) {
                setAutoTitles((prev) => ({ ...prev, [album.id]: parsed }));
              }
            } catch {
              // best-effort only
            } finally {
              if (!cancelled) setLoadingIds((s) => ({ ...s, [album.id]: false }));
            }
          }
        })
      );
    }
    hydrateTitles();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayTitle = (album: Album) => album.title || autoTitles[album.id] || 'Open album';

  const sorted = useMemo(() => {
    const arr = [...gallery];
    switch (sortKey) {
      case 'dateDesc':
        arr.sort((a, b) => toSortableTime(b) - toSortableTime(a));
        break;
      case 'dateAsc':
        arr.sort((a, b) => toSortableTime(a) - toSortableTime(b));
        break;
      case 'titleAsc':
        arr.sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)));
        break;
      case 'titleDesc':
        arr.sort((a, b) => displayTitle(b).localeCompare(displayTitle(a)));
        break;
    }
    return arr;
  }, [sortKey, autoTitles]);

  const Card = ({ album }: { album: Album }) => {
    const title = displayTitle(album);
    const loading = !!loadingIds[album.id];

    return (
      <a
        href={album.link}
        target="_blank"
        rel="noreferrer"
        className="group block focus:outline-none"
      >
        <div
          className="
            glass-card p-6 h-full
            border border-white/10
            hover:bg-white/10
            transition-colors duration-300
            relative
            focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
          "
          style={{
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.06), 0 12px 24px rgba(0,0,0,0.35)'
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1 text-accent/90 text-xs px-2 py-1 rounded-md bg-accent/10 border border-accent/20">
              <span>Open</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>

          {album.date && (
            <div className="flex items-center text-white/60 text-sm mt-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {new Date(album.date).toLocaleDateString()}
            </div>
          )}

          {album.description && (
            <p className="text-white/70 text-sm mt-3 leading-relaxed line-clamp-3">
              {album.description}
            </p>
          )}

          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye className="h-4 w-4 text-accent/80" />
          </div>

          {loading && (
            <div className="absolute inset-0 rounded-lg pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[pulse_1.2s_ease-in-out_infinite]" />
            </div>
          )}
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-8">
              Photo Gallery
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Explore our collection of memories from events, workshops, hackathons, and social gatherings.
            </p>
          </div>

          {/* Sort control */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="text-white/60 text-sm">
              Sort albums
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortKey('dateDesc')}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  sortKey === 'dateDesc'
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
                title="Newest to oldest"
              >
                <span className="inline-flex items-center gap-1">
                  Newest <SortDesc className="h-4 w-4" />
                </span>
              </button>
              <button
                onClick={() => setSortKey('dateAsc')}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  sortKey === 'dateAsc'
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
                title="Oldest to newest"
              >
                <span className="inline-flex items-center gap-1">
                  Oldest <SortAsc className="h-4 w-4" />
                </span>
              </button>
              <button
                onClick={() => setSortKey('titleAsc')}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  sortKey === 'titleAsc'
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
                title="A → Z"
              >
                A → Z
              </button>
              <button
                onClick={() => setSortKey('titleDesc')}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  sortKey === 'titleDesc'
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
                title="Z → A"
              >
                Z → A
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((album) => (
              <Card key={album.id} album={album} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
