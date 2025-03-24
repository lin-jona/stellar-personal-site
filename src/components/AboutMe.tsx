
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const skills = [
  { name: "Frontend Development", level: 90 },
  { name: "UI/UX Design", level: 85 },
  { name: "Backend Development", level: 80 },
  { name: "Database Management", level: 75 },
  { name: "Mobile Development", level: 70 },
  { name: "DevOps", level: 60 },
];

const AboutMe = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section flex flex-col lg:flex-row items-center gap-12 lg:gap-24"
    >
      <div
        className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}
      >
        <h3 className="text-xl font-medium text-accent mb-2">About Me</h3>
        <h2 className="section-title">Passionate Developer & Designer</h2>
        <div className="prose prose-invert max-w-xl">
          <p className="text-xl text-white/80 mb-6">
            I'm a full-stack developer with a passion for creating beautiful, functional interfaces and robust applications. With a background in design and engineering, I bring a unique perspective to every project.
          </p>
          <p className="text-lg text-white/70 mb-6">
            Throughout my career, I've worked on various projects that have allowed me to hone my skills in frontend and backend development. I enjoy tackling complex problems and finding elegant solutions.
          </p>
          <p className="text-lg text-white/70">
            When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying outdoor activities.
          </p>
        </div>
      </div>

      <div
        className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}
      >
        <h3 className="text-xl font-medium mb-8">My Skills</h3>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/90">{skill.name}</span>
                <span className="text-white/60">{skill.level}%</span>
              </div>
              <div className="h-2 w-full bg-space-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? `${skill.level}%` : "0%",
                    transitionDelay: `${index * 100}ms`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
