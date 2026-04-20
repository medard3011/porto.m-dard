// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');
const fadeElements = document.querySelectorAll('.fade-in');

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  if (theme === 'dark') {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

// Navigation Toggle
function toggleNav() {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
}

// Smooth Scrolling
function smoothScroll(e) {
  e.preventDefault();
  const targetId = e.target.getAttribute('href');
  const targetSection = document.querySelector(targetId);
  
  if (targetSection) {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetSection.offsetTop - navHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
      toggleNav();
    }
  }
}

// Active Navigation Link
function updateActiveNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    if (scrollY >= (sectionTop - navHeight - 100)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Animate Skill Bars
function animateSkillBars() {
  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    const rect = bar.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      bar.style.width = progress + '%';
    }
  });
}

// Scroll Animations
function handleScrollAnimation() {
  fadeElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      element.classList.add('visible');
    }
  });
}

// Form Validation and Submission
function validateForm(formData) {
  const errors = [];
  
  if (!formData.get('name').trim()) {
    errors.push('Le nom complet est requis');
  }
  
  if (!formData.get('email').trim()) {
    errors.push('L\'email est requis');
  } else if (!isValidEmail(formData.get('email'))) {
    errors.push('L\'email n\'est pas valide');
  }
  
  if (!formData.get('subject').trim()) {
    errors.push('Le sujet est requis');
  }
  
  if (!formData.get('message').trim()) {
    errors.push('Le message est requis');
  }
  
  // Validation optionnelle du téléphone si fourni
  const phone = formData.get('phone').trim();
  if (phone && !isValidPhone(phone)) {
    errors.push('Le numéro de téléphone n\'est pas valide');
  }
  
  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = 'Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.';
  
  contactForm.appendChild(successDiv);
  contactForm.reset();
  
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

function showErrors(errors) {
  // Remove existing error messages
  const existingErrors = contactForm.querySelectorAll('.error-message');
  existingErrors.forEach(error => error.remove());
  
  errors.forEach(error => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = error;
    errorDiv.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    `;
    
    contactForm.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const errors = validateForm(formData);
  
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }
  
  // Show loading state
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<span>Envoi en cours...</span>';
  submitButton.classList.add('loading');
  
  // Simulate form submission (replace with actual form submission logic)
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, you would send the data to a server here
    console.log('Form submitted:', {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      budget: formData.get('budget')
    });
    
    showSuccessMessage();
  } catch (error) {
    showErrors(['Une erreur est survenue. Veuillez réessayer.']);
  } finally {
    submitButton.innerHTML = originalText;
    submitButton.classList.remove('loading');
  }
}

// Navbar Background on Scroll
function updateNavbarBackground() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      navbar.style.background = 'rgba(17, 24, 39, 0.98)';
    }
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      navbar.style.background = 'rgba(17, 24, 39, 0.95)';
    }
  }
}

// Typing Effect for Hero Title
function typeWriter() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  heroTitle.style.borderRight = '3px solid var(--primary-color)';
  
  let i = 0;
  function type() {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(type, 50);
    } else {
      heroTitle.style.borderRight = 'none';
    }
  }
  
  setTimeout(type, 500);
}

// Parallax Effect for Hero Section
function handleParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const scrolled = window.pageYOffset;
  const parallax = hero.querySelector('.hero-container');
  if (parallax) {
    const speed = 0.5;
    parallax.style.transform = `translateY(${scrolled * speed}px)`;
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Add event listeners
  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Add smooth scrolling to navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', smoothScroll);
  });
  
  // Initial animations
  typeWriter();
  animateSkillBars();
  handleScrollAnimation();
  
  // Add fade-in class to elements for scroll animations
  const elementsToAnimate = document.querySelectorAll(
    '.section-header, .skill-item, .timeline-item, .project-card, .contact-form'
  );
  elementsToAnimate.forEach(element => {
    element.classList.add('fade-in');
  });
});

// Scroll event listeners
window.addEventListener('scroll', () => {
  updateActiveNav();
  updateNavbarBackground();
  handleScrollAnimation();
  animateSkillBars();
  handleParallax();
});

// Window resize event
window.addEventListener('resize', () => {
  // Close mobile menu on resize if window becomes larger
  if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
    toggleNav();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    toggleNav();
  }
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
  updateActiveNav();
  updateNavbarBackground();
  handleScrollAnimation();
  animateSkillBars();
  handleParallax();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('load', function() {
    this.classList.add('loaded');
  });
  
  img.addEventListener('error', function() {
    this.classList.add('error');
    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="Arial" font-size="14"%3EImage non disponible%3C/text%3E%3C/svg%3E';
  });
});

// Intersection Observer for better performance
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Animate skill bars when visible
      if (entry.target.classList.contains('skill-progress')) {
        const progress = entry.target.getAttribute('data-progress');
        entry.target.style.width = progress + '%';
      }
    }
  });
}, observerOptions);

// Observe elements
document.querySelectorAll('.fade-in, .skill-progress').forEach(el => {
  observer.observe(el);
});

// Console welcome message
console.log('%c🚀 Portfolio chargé avec succès!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%cCréé avec ❤️ et JavaScript vanilla', 'color: #10b981; font-size: 14px;');
