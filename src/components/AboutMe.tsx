
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const skills = [
  { name: "GIS", level: 80 },
  { name: "Vue3", level: 70 },
  { name: "React", level: 10 },
  { name: "Python", level: 70 },
  { name: "Java", level: 30 },
  { name: "Database", level: 50 },
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
        <h3 className="text-xl font-medium text-accent mb-2">关于我</h3>
        <h2 className="section-title">前端开发工程师</h2>
        <div className="prose prose-invert max-w-xl">
          <p className="text-xl text-white/80 mb-6">
            我是一名专注于前端开发的工程师。我追求的不仅是功能的实现，更是代码的优雅与和谐。在我的世界里，每一行代码都应当简洁、清晰、可读性好。我深深认同Python的设计哲学，将其精神贯穿于我的每一个项目中。
          </p>
          <p className="text-lg text-white/70 mb-6">
            在我之前的工作中，我主要致力于可视化系统的页面开发。这些经历不仅锻炼了我的前端技能，还让我对后端开发有了一定的理解。我视每一个复杂的问题为挑战，面对暂时无法攻克的难题，我永不言弃，不断的向内向外寻求解决难题的思路方法，直到找到最佳答案。
          </p>
          <p className="text-lg text-white/70 mb-6">
            在业余生活中，我热衷于研究前沿技术，关注令人兴奋的开源项目，以此保持对行业的敏锐洞察力和创新能力。我积极拥抱AIGC，使用AI赋能开发流程，以此提升代码质量和工作效率。
          </p>
          <p className="text-lg text-white/70">
            我也深知技术不是生活的全部。我喜欢户外跑，会随意地跑入陌生的街道或小区，期待遇见生活中的小美好；也喜欢在山间野径中感受自然的力量。同时，我保持着阅读的习惯，通过书籍开启思想的旅程，滋养心灵，拓展视野。
          </p>
        </div>
      </div>

      <div
        className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}
      >
        <h3 className="text-xl font-medium mb-8">我的技能</h3>
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
