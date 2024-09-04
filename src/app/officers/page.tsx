import People from "../../components/People"
export default function MeetTheTeam() {
  return (
    <div className="py-10 px-5">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">meet the team</h1>
        <p className="text-lg text-gray-600">get to know the amazing people behind our work!</p>
      </header>

      <section className="space-y-8">
        <People 
          name="Talha Tahmid" 
          role="Software Engineer" 
          bio="Talha is a computer science major and tech enthusiast." 
          imageUrl="/images/talhaheadshot.jpg"
          socialLinks={{
            linkedin: 'https://linkedin.com/in/talhatahmid',
            twitter: 'https://twitter.com/talhatahmid'
          }}
        />
      </section>
    </div>
  );
}
