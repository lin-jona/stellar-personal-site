
import { useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Briefcase, GraduationCap, MapPin, Calendar
} from "lucide-react";

const timelineEvents = [
  {
    id: "education1",
    title: "Computer Science Degree",
    organization: "University of Technology",
    location: "San Francisco, CA",
    date: "2014 - 2018",
    description: "Completed a Bachelor's degree in Computer Science with a focus on software engineering and artificial intelligence.",
    type: "education",
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: "work1",
    title: "Junior Developer",
    organization: "Tech Innovations Inc.",
    location: "Seattle, WA",
    date: "2018 - 2020",
    description: "Worked on developing and maintaining web applications, collaborating with cross-functional teams to deliver high-quality software solutions.",
    type: "work",
    coordinates: { lat: 47.6062, lng: -122.3321 }
  },
  {
    id: "work2",
    title: "Senior Developer",
    organization: "Global Solutions",
    location: "Austin, TX",
    date: "2020 - 2022",
    description: "Led the development of enterprise applications, mentored junior developers, and implemented best practices for software development.",
    type: "work",
    coordinates: { lat: 30.2672, lng: -97.7431 }
  },
  {
    id: "work3",
    title: "Lead Developer",
    organization: "Future Technologies",
    location: "New York, NY",
    date: "2022 - Present",
    description: "Currently leading a team of developers on cutting-edge projects, focusing on innovative solutions and technical excellence.",
    type: "work",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }
];

const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [activeEvent, setActiveEvent] = useState(timelineEvents[timelineEvents.length - 1].id);

  return (
    <section id="timeline" ref={sectionRef} className="section">
      <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
        <h3 className="text-xl font-medium text-accent mb-2">My Journey</h3>
        <h2 className="section-title">Professional Timeline</h2>
        <p className="section-subtitle">
          A chronological overview of my educational background and professional experience.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Globe Visualization Placeholder */}
        <div className={`lg:w-1/2 h-[500px] glass rounded-xl p-6 relative flex items-center justify-center ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}>
          <div className="w-full h-full rounded-lg bg-space-blue/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-b from-blue-700 to-blue-900 relative animate-float">
              {/* Simplified Globe */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute w-full h-full opacity-30 bg-[url('https://i.imgur.com/6YYM8Al.png')] bg-cover"></div>
              </div>
              {/* Location Markers */}
              {timelineEvents.map((event) => {
                // These are approximate positions just for visual effect
                let top, left;
                
                switch(event.location.split(',')[0].trim()) {
                  case 'San Francisco':
                    top = '40%'; left = '20%'; break;
                  case 'Seattle':
                    top = '30%'; left = '15%'; break;
                  case 'Austin':
                    top = '55%'; left = '35%'; break;
                  case 'New York':
                    top = '40%'; left = '75%'; break;
                  default:
                    top = '50%'; left = '50%';
                }
                
                return (
                  <div 
                    key={event.id}
                    className={`absolute w-3 h-3 rounded-full ${
                      activeEvent === event.id ? 'bg-accent animate-pulse' : 'bg-white/50'
                    } cursor-pointer transition-all duration-300 z-10`}
                    style={{ top, left }}
                    onClick={() => setActiveEvent(event.id)}
                  >
                    <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full border-2 ${
                      activeEvent === event.id ? 'border-accent animate-pulse' : 'border-white/30'
                    }`}></div>
                    {activeEvent === event.id && (
                      <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-16 glass p-2 rounded-lg whitespace-nowrap">
                        <span className="text-xs">{event.location}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}>
          <div className="relative border-l-2 border-accent/30 pl-8 space-y-12">
            {timelineEvents.map((event, index) => (
              <div 
                key={event.id}
                className={`relative ${
                  activeEvent === event.id ? 'opacity-100' : 'opacity-70'
                } hover:opacity-100 transition-opacity cursor-pointer`}
                onClick={() => setActiveEvent(event.id)}
              >
                {/* Timeline node */}
                <div className={`absolute -left-10 mt-1.5 w-5 h-5 rounded-full border-4 ${
                  activeEvent === event.id ? 'border-accent bg-space-dark' : 'border-white/30 bg-space-dark'
                } transition-colors duration-300`}></div>
                
                <div className={`glass p-6 rounded-xl transition-all duration-300 ${
                  activeEvent === event.id ? 'bg-white/10 shadow-accent/5 shadow-md' : ''
                }`}>
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="inline-flex items-center text-xs text-white/70">
                      <Calendar size={14} className="mr-1" />{event.date}
                    </span>
                    <span className="inline-flex items-center text-xs text-white/70">
                      <MapPin size={14} className="mr-1" />{event.location}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-full ${
                      event.type === 'education' ? 'bg-green-500/10' : 'bg-blue-500/10'
                    }`}>
                      {event.type === 'education' ? (
                        <GraduationCap size={20} className={`${
                          event.type === 'education' ? 'text-green-500' : 'text-blue-500'
                        }`} />
                      ) : (
                        <Briefcase size={20} className={`${
                          event.type === 'education' ? 'text-green-500' : 'text-blue-500'
                        }`} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      <p className="text-white/70">{event.organization}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
