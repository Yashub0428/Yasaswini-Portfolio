document.addEventListener('DOMContentLoaded', () => {
  // --- THEME MANAGEMENT ---
  const themeToggle = document.querySelector('.theme-toggle');
  const htmlElement = document.documentElement;
  
  // Default to light theme as requested
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    if (window.refreshCanvasColors) {
      window.refreshCanvasColors(newTheme);
    }
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      themeToggle.querySelector('span').textContent = 'Light Mode';
    } else {
      icon.className = 'fas fa-moon';
      themeToggle.querySelector('span').textContent = 'Dark Mode';
    }
  }

  // --- ATS MODE TOGGLE ---
  const atsToggle = document.querySelector('.ats-toggle');
  const exitAtsBtn = document.querySelector('.btn-exit-ats');

  function toggleAtsMode(activate) {
    if (activate) {
      document.body.classList.add('ats-mode');
      localStorage.setItem('atsMode', 'true');
    } else {
      document.body.classList.remove('ats-mode');
      localStorage.setItem('atsMode', 'false');
    }
  }

  atsToggle.addEventListener('click', () => toggleAtsMode(true));
  exitAtsBtn.addEventListener('click', () => toggleAtsMode(false));

  if (localStorage.getItem('atsMode') === 'true') {
    toggleAtsMode(true);
  }

  // --- MOBILE SIDEBAR NAVIGATION ---
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleSidebar(open) {
    if (open) {
      sidebar.classList.add('show');
      overlay.classList.add('show');
    } else {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleSidebar(true));
  }
  
  if (overlay) {
    overlay.addEventListener('click', () => toggleSidebar(false));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleSidebar(false);
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // --- SCROLL SPY FOR NAVIGATION ---
  const sections = document.querySelectorAll('.dashboard-section');
  
  const scrollObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, scrollObserverOptions);

  sections.forEach(section => {
    scrollObserver.observe(section);
  });

  // --- TYPING CAROUSEL EFFECT ---
  const typingTarget = document.querySelector('.typing-text');
  if (typingTarget) {
    const roles = [
      'Machine Learning Engineer',
      'AI Developer',
      'Data Scientist',
      'Software Developer',
      'Explainable AI Researcher'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
  }



  // --- SKILLS DYNAMIC SEARCH FILTER ---
  const searchInput = document.getElementById('skills-search');
  const skillBadges = document.querySelectorAll('.skill-badge');
  const skillsCategories = document.querySelectorAll('.skills-cat-card');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query === '') {
        skillBadges.forEach(badge => badge.classList.remove('highlight', 'dimmed'));
        skillsCategories.forEach(cat => {
          cat.style.display = 'block';
          cat.querySelector('h3').style.opacity = '1';
        });
        return;
      }

      skillsCategories.forEach(category => {
        let hasMatch = false;
        const categoryBadges = category.querySelectorAll('.skill-badge');
        
        categoryBadges.forEach(badge => {
          const skillName = badge.textContent.toLowerCase();
          if (skillName.includes(query)) {
            badge.classList.add('highlight');
            badge.classList.remove('dimmed');
            hasMatch = true;
          } else {
            badge.classList.remove('highlight');
            badge.classList.add('dimmed');
          }
        });

        if (hasMatch) {
          category.style.display = 'block';
          category.querySelector('h3').style.opacity = '1';
        } else {
          category.querySelector('h3').style.opacity = '0.4';
        }
      });
    });
  }

  // --- MOCK CONTACT FORM ---
  const contactForm = document.querySelector('.contact-form');
  const toast = document.querySelector('.toast-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const msg = document.getElementById('form-message').value;

      if (!name || !email || !msg) return;

      toast.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    });
  }

  // --- 3D TILT EFFECT CARD PHYSICS ---
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      
      // Calculate mouse position relative to card center
      const mouseX = e.clientX - cardRect.left - (cardWidth / 2);
      const mouseY = e.clientY - cardRect.top - (cardHeight / 2);
      
      // Calculate rotation angles (max 10 degrees)
      const rotateX = -(mouseY / (cardHeight / 2)) * 10;
      const rotateY = (mouseX / (cardWidth / 2)) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // --- HTML5 CANVAS NEON PARTICLE NETWORK ---
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 65;
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cosmic neon colors
    let primaryColor = 'rgba(99, 102, 241, 0.4)';  // Neon Indigo
    let secondaryColor = 'rgba(6, 182, 212, 0.4)'; // Neon Cyan
    let accentColor = 'rgba(217, 70, 239, 0.4)';    // Neon Magenta/Pink
    let lineColors = 'rgba(99, 102, 241, 0.08)';

    window.refreshCanvasColors = function(theme) {
      if (theme === 'dark') {
        primaryColor = 'rgba(99, 102, 241, 0.35)';
        secondaryColor = 'rgba(6, 182, 212, 0.35)';
        accentColor = 'rgba(217, 70, 239, 0.35)';
        lineColors = 'rgba(99, 102, 241, 0.08)';
      } else {
        primaryColor = 'rgba(99, 102, 241, 0.3)';
        secondaryColor = 'rgba(6, 182, 212, 0.3)';
        accentColor = 'rgba(217, 70, 239, 0.3)';
        lineColors = 'rgba(99, 102, 241, 0.12)';
      }
    };

    window.refreshCanvasColors(htmlElement.getAttribute('data-theme') || 'light');

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2.5 + 1.2;
        
        const rand = Math.random();
        if (rand < 0.33) {
          this.color = 'primary';
        } else if (rand < 0.66) {
          this.color = 'secondary';
        } else {
          this.color = 'accent';
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        if (this.color === 'primary') {
          ctx.fillStyle = primaryColor;
        } else if (this.color === 'secondary') {
          ctx.fillStyle = secondaryColor;
        } else {
          ctx.fillStyle = accentColor;
        }
        
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      if (window.innerWidth < 768) {
        particleCount = 30;
      } else {
        particleCount = 65;
      }
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();
    window.addEventListener('resize', initParticles);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      ctx.strokeStyle = lineColors;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }
});
