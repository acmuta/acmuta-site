import { Mail, MapPin, Users, ExternalLink } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-8">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Have questions? Want to get involved? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              {[
                {
                  icon: Mail,
                  title: 'Email Us',
                  content: 'acm.uta@gmail.com',
                  description: 'Send us an email for general inquiries'
                },
                {
                  icon: MapPin,
                  title: 'Visit Us',
                  content: 'ERB 421',
                  description: 'University of Texas at Arlington'
                },
                {
                  icon: Users,
                  title: 'Join Our Community',
                  content: 'Discord Server',
                  description: 'Connect with members online'
                }
              ].map((contact, index) => (
                <div key={index} className="glass-card p-8">
                  <div className="flex items-start space-x-6">
                    <div className="glass-card p-4">
                      <contact.icon className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{contact.title}</h3>
                      <div className="text-accent font-medium text-lg mb-2">{contact.content}</div>
                      <p className="text-white/70">{contact.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Quick Links</h2>
              <div className="space-y-4">
                {[
                  { label: 'Membership Application', url: 'https://mavengage.uta.edu/submitter/form/start/623436' },
                  { label: 'Mailing List', url: 'https://forms.gle/vvu4T9SKP5LnZtgs6' },
                  { label: 'About ACM UTA', url: '/about' },
                  { label: 'Our Committees', url: '/committees' }
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-between p-4 glass-card hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-white group-hover:text-accent transition-colors">
                      {link.label}
                    </span>
                    <ExternalLink className="h-4 w-4 text-accent" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;