
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with payment integration, user authentication, and product management.",
    techStack: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://placehold.co/600x400/222/eee?text=E-Commerce+Platform",
    github: "#",
    demo: "#",
  },
  {
    title: "Task Management App",
    description: "A productivity application for managing tasks with real-time updates, notifications, and team collaboration.",
    techStack: ["Vue.js", "Firebase", "Tailwind CSS"],
    image: "https://placehold.co/600x400/222/eee?text=Task+Management",
    github: "#",
    demo: "#",
  },
  {
    title: "Weather Dashboard",
    description: "An interactive weather dashboard with location-based forecasts, historical data, and visual representations.",
    techStack: ["JavaScript", "OpenWeather API", "Chart.js"],
    image: "https://placehold.co/600x400/222/eee?text=Weather+Dashboard",
    github: "#",
    demo: "#",
  },
  {
    title: "Social Media Analytics",
    description: "A social media analytics platform that tracks engagement metrics and provides actionable insights.",
    techStack: ["React", "Express.js", "PostgreSQL", "D3.js"],
    image: "https://placehold.co/600x400/222/eee?text=Social+Media+Analytics",
    github: "#",
    demo: "#",
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);

  return (
    <section id="projects" ref={sectionRef} className="section bg-space-light">
      <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
        <h3 className="text-xl font-medium text-accent mb-2">My Work</h3>
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">
          Here are some of my recent projects that showcase my skills and expertise.
          Each project represents a unique challenge and solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className={`glass rounded-xl overflow-hidden transition-all duration-300 hover:shadow-accent/10 hover:shadow-lg hover:-translate-y-1 ${
              isVisible 
                ? `animate-fade-in-up animate-delay-${(index % 4) * 100}`
                : "opacity-0"
            }`}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-medium">{project.title}</h3>
              <p className="text-white/70">{project.description}</p>
              <div className="flex flex-wrap gap-2 py-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex space-x-4 pt-2">
                <a
                  href={project.github}
                  className="flex items-center text-white/70 hover:text-white transition-colors"
                  aria-label={`View ${project.title} source code`}
                >
                  <Github size={18} className="mr-1" />
                  <span>Code</span>
                </a>
                <a
                  href={project.demo}
                  className="flex items-center text-white/70 hover:text-white transition-colors"
                  aria-label={`View ${project.title} live demo`}
                >
                  <ExternalLink size={18} className="mr-1" />
                  <span>Demo</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
