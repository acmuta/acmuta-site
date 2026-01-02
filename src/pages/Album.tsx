import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { gallery } from '@/data/gallery';

const Album = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const album = gallery.find(a => a.id === albumId);

  if (!album) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Album Not Found</h1>
          <Link to="/gallery" className="btn-primary">Back to Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-gradient-to-b from-bg-dark via-bg-dark/95 to-bg-dark">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Link to="/gallery" className="btn-secondary inline-flex items-center mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                {album.title}
              </h1>
              {album.date && (
                <div className="flex items-center justify-center text-white/60 mb-4">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date(album.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              {album.description && (
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  {album.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.photos.map((photo, index) => (
              <div key={index} className="glass-card overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div 
                  className="aspect-square bg-gradient-to-br from-primary to-accent"
                  style={{
                    backgroundImage: `url(${photo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="glass-card p-3 hover:bg-white/20">
                      <Download className="h-5 w-5 text-accent" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Album;