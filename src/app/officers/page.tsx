import People from "../../components/People"
export default function MeetTheTeam() {
  return (
    <div className="py-10 px-5">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">meet the team</h1>
        <p className="text-lg text-gray-200">get to know the amazing people behind our work!</p>
      </header>

      <section className="space-y-8">
        <People 
          name="Talha Tahmid" 
          role="Officer Create" 
          imageUrl="/images/talhaheadshot.jpg"
          socialLinks={{
            linkedin: 'https://linkedin.com/in/talhatahmid',
            instagram: 'https://www.instagram.com/talha.thmd',
            website: 'https://www.talhathmd.com'
          }}
        />
      </section>
    </div>
  );
}
