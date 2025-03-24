
// This file will contain 3D planet visualization utilities
// For this version, we'll create a simple CSS-based planet effect

export const createStarryBackground = (container: HTMLElement) => {
  const starCount = 200;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Random position
    const left = Math.floor(Math.random() * 100);
    const top = Math.floor(Math.random() * 100);
    
    // Random size
    const size = Math.random() * 2 + 1;
    
    // Random opacity
    const opacity = Math.random() * 0.8 + 0.2;
    
    // Random animation delay
    const delay = Math.random() * 5;
    
    star.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: ${top}%;
      width: ${size}px;
      height: ${size}px;
      background-color: rgba(255, 255, 255, ${opacity});
      border-radius: 50%;
      animation: pulse 3s infinite;
      animation-delay: ${delay}s;
    `;
    
    fragment.appendChild(star);
  }
  
  container.appendChild(fragment);
};

export const initParallaxEffect = () => {
  const handleMouseMove = (e: MouseEvent) => {
    const elements = document.querySelectorAll('.parallax');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    elements.forEach(element => {
      const el = element as HTMLElement;
      const intensity = parseFloat(el.dataset.intensity || '0.05');
      
      el.style.transform = `translate(${mouseX * -intensity * 100}px, ${mouseY * -intensity * 100}px)`;
    });
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
};
