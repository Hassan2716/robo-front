import { Link } from 'react-router-dom';

const team = [
  { name: 'Mike Johnson', role: 'Owner & Master Barber', specialty: 'Classic Cuts & Fades', experience: '15 years', initial: 'M' },
  { name: 'Sarah Williams', role: 'Senior Stylist', specialty: 'Women\'s Cuts & Color', experience: '10 years', initial: 'S' },
  { name: 'David Chen', role: 'Barber Specialist', specialty: 'Precision Cuts & Shaves', experience: '12 years', initial: 'D' },
];

const values = [
  { title: 'Craftsmanship', desc: 'Every cut is a work of art. We take pride in our precision and attention to detail.', icon: 'scissors' },
  { title: 'Tradition', desc: 'We honor the timeless traditions of barbering while embracing modern techniques.', icon: 'history' },
  { title: 'Community', desc: 'Our shop is a gathering place. We build relationships, not just haircuts.', icon: 'users' },
  { title: 'Quality', desc: 'We use only premium products and tools to ensure the best results for every client.', icon: 'sparkles' },
];

const icons = {
  scissors: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.15 9.15"/></svg>,
  history: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  users: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  sparkles: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L18 21l-6.857-2.286L12 17l-2.286 6.857L3 12l5.714-2.143L6 3l6.857 2.286L21 12l-5.714-2.143L12 3z"/></svg>,
};

export default function About() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 text-primary-500 text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 mb-6">
                Where Tradition Meets Modern Style
              </h2>
              <div className="space-y-4 text-dark-600 leading-relaxed">
                <p>
                  Founded in 2015, RoboCutz started with a simple mission: bring back the art of traditional barbering 
                  while embracing the styles of today. What began as a single-chair shop has grown into a premier 
                  destination for discerning clients who appreciate craftsmanship.
                </p>
                <p>
                  Our barbers aren't just stylists—they're artisans who have dedicated years to mastering their craft. 
                  From classic straight razor shaves to the latest fade techniques, we blend time-honored traditions 
                  with contemporary trends.
                </p>
                <p>
                  At RoboCutz, you're not just getting a haircut. You're experiencing a ritual—a moment to relax, 
                  refresh, and walk out feeling your absolute best.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center p-8">
                    <div className="text-6xl font-display font-bold mb-4">2015</div>
                    <div className="text-xl opacity-90">Established</div>
                    <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-xl sm:text-2xl font-bold">
                      <div>
                        <div>5000+</div>
                        <div className="text-sm opacity-75">Happy Clients</div>
                      </div>
                      <div>
                        <div>3</div>
                        <div className="text-sm opacity-75">Master Barbers</div>
                      </div>
                      <div>
                        <div>50+</div>
                        <div className="text-sm opacity-75">Styles Mastered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20" aria-labelledby="values-heading">
          <h2 id="values-heading" className="font-display text-3xl sm:text-4xl font-bold text-dark-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <article key={i} className="card p-6 text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {icons[value.icon]}
                </div>
                <h3 className="font-display text-xl font-semibold text-dark-900 mb-2">{value.title}</h3>
                <p className="text-dark-600">{value.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-20" aria-labelledby="team-heading">
          <h2 id="team-heading" className="font-display text-3xl sm:text-4xl font-bold text-dark-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <article key={i} className="card group">
                <div className="aspect-square relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-6xl font-display">
                    {member.initial}
                  </div>
                  <div className="absolute inset-0 bg-primary-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link to="/barbers" className="btn-primary">View Profile</Link>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-display text-xl font-bold text-dark-900">{member.name}</h3>
                  <p className="text-primary-500 text-sm font-medium mb-1">{member.role}</p>
                  <p className="text-dark-500 text-sm mb-3">{member.specialty}</p>
                  <p className="text-dark-400 text-sm">{member.experience} experience</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-dark-950 rounded-2xl p-8 md:p-16 text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Experience the Difference
          </h2>
          <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
            Ready for a cut that exceeds your expectations? Book your appointment today and discover why clients 
            keep coming back to RoboCutz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="btn-primary text-lg px-10 py-4">
              Book Appointment
            </Link>
            <Link to="/barbers" className="btn bg-transparent border-white text-white hover:bg-white/10 text-lg px-10 py-4">
              Meet Our Barbers
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}