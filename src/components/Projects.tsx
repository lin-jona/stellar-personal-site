
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ExternalLink, Github } from "lucide-react";
import { projectsData } from "@/data/projectData";

const projects = projectsData;

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);

  return (
    <section id="projects" ref={sectionRef} className="section bg-space-light">
      <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
        <h2 className="section-title">我的项目</h2>
        <p className="section-subtitle">
          在我的职业生涯中，我有幸参与了多个项目。每一个项目都如同一次冒险，带来了独特的挑战和学习机会。虽然途中遇到了不少障碍，但通过团队的协作和个人的努力，我最终找到了解决方案。
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
