
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
        <h3 className="text-xl font-medium text-accent mb-2">Get In Touch</h3>
        <h2 className="section-title">Contact Me</h2>
        <p className="section-subtitle">
          Have a question or want to work together? Feel free to reach out.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <div
          className={`lg:w-1/2 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-medium mb-6">Send Me a Message</h3>
          
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
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full glass bg-white/5 text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-white/70 block">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full glass bg-white/5 text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all"
                  placeholder="Your email"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-white/70 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full glass bg-white/5 text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent/50 focus:outline-none resize-none transition-all"
                  placeholder="Your message"
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
          <h3 className="text-xl font-medium mb-6">Connect With Me</h3>
          
          <div className="glass rounded-xl p-8 mb-8">
            <p className="text-white/80 mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-sm text-white/50">Email</h4>
                  <a href="mailto:contact@example.com" className="hover:text-accent transition-colors">
                    contact@example.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Github size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-sm text-white/50">GitHub</h4>
                  <a href="https://github.com/username" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    github.com/username
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Linkedin size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-sm text-white/50">LinkedIn</h4>
                  <a href="https://linkedin.com/in/username" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    linkedin.com/in/username
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-8">
            <h4 className="text-lg font-medium mb-4">Let's Work Together</h4>
            <p className="text-white/80">
              Whether you have a question about a project, need a developer for your next big idea, or just want to say hello, I'll try my best to get back to you!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
