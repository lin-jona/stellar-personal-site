
import { useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mail, Github, Linkedin, Send } from "lucide-react";

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formState);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className="section">
      <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
        <h2 className="section-title">联系我</h2>
        <p className="section-subtitle">
          如果您有任何问题或希望合作，请随时联系我。
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <div
          className={`lg:w-1/2 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-medium mb-6">留言</h3>
          
          {submitted ? (
            <div className="glass p-8 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <Send size={28} className="text-accent" />
              </div>
              <h4 className="text-xl font-medium mb-2">Message Sent!</h4>
              <p className="text-white/70 mb-4">
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-white/70 block">
                  昵称
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full glass bg-white/5 text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all"
                  placeholder="您的昵称"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-white/70 block">
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full glass bg-white/5 text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all"
                  placeholder="您的邮箱"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-white/70 block">
                  留言
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full glass bg-white/5 text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent/50 focus:outline-none resize-none transition-all"
                  placeholder="您的留言"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 ${
                  isSubmitting
                    ? "bg-accent/50 cursor-not-allowed"
                    : "bg-accent hover:bg-accent/90"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        <div
          className={`lg:w-1/2 ${
            isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-medium mb-6">与我取得联系</h3>
          
          <div className="glass rounded-xl p-8 mb-8">
            <p className="text-white/80 mb-6">
            我很乐意听取您的想法或讨论新的项目、创意或机会。请随时与我分享更多细节，期待您的留言！
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="min-w-10 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail size={20} className="text-accent" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm text-white/50">Email</h4>
                  <a href="mailto:penghulin2794@outlook.com" className="hover:text-accent transition-colors block break-all">
                    penghulin2794@outlook.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="min-w-10 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Github size={20} className="text-accent" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm text-white/50">GitHub</h4>
                  <a href="https://github.com/lin-jona" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors block break-all">
                    github.com/lin-jona
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-8">
            <h4 className="text-lg font-medium mb-4">期待一起合作</h4>
            <p className="text-white/80">
              无论您是否有关于项目的问题，或需要开发人员来实现您的下一个创意，或者只是想打声招呼，我会尽力回复您！
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
