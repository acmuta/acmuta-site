export interface NewsItem {
  id: string;
  title: string;
  cover: string;
  url: string;
  date: string;
  excerpt?: string;
}

export const news: NewsItem[] = [
  {
    id: '1',
    title: 'HackUTA 2025',
    cover: 'assets/events/hackuta2025.jpg',
    url: '/events',
    date: '2025-10-4',
    excerpt: 'Join us for our annual hackathon event, where students collaborate and innovate over 24 hours.'
  },
  {
    id: '2',
    title: 'Performative Male Contest',
    cover: 'assets/events/performative.JPG',
    url: '/events',
    date: '2025-09-25',
    excerpt: 'Love listening to Clairo? Hate period cramps? Come to our Performative Male Contest to win prizes!'
  },
  {
    id: '3',
    title: 'ACM Fall Kickoff 2025',
    cover: 'assets/events/fallkickoff2025.JPG',
    url: '/about',
    date: '2025-09-09',
    excerpt: 'HackUTA 2024 was a huge success with over 600 participants, 24 hours of coding, and amazing prizes from our sponsors.'
  },
];