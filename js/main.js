// Main JavaScript for general functionality

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
  
  // Initialize tab navigation
  setupTabNavigation();
  
  // Scrollspy for navigation
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-links a');
  
  function resetActiveClass() {
    navItems.forEach(item => {
      item.classList.remove('active');
    });
  }
  
  // Highlight active nav link based on scroll position
  function handleScroll() {
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        resetActiveClass();
        const activeNavLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeNavLink) {
          activeNavLink.classList.add('active');
        }
      }
    });
  }
  
  // Only add scroll event listener if there are nav items to update
  if (navItems.length > 0) {
    window.addEventListener('scroll', handleScroll);
  }
  
  // Smooth scrolling for navigation links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = item.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 50,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
        }
      }
    });
  });
  
  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      // For demonstration - display form values in console
      console.log('Form Submitted:', formValues);
      
      // Here you would typically send the data to a backend service
      // For a simple implementation without backend, you could use a service like formspree.io
      
      // Show success message
      alert('Thank you! Your message has been sent.');
      
      // Reset form
      contactForm.reset();
    });
  }
  
  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .timeline-item, .portfolio-item');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;
      
      if (elementPosition < screenHeight * 0.9) {
        element.classList.add('fade-in');
      }
    });
  };
  
  // Initial check for elements in view
  animateOnScroll();
  
  // Add event listener for scroll
  window.addEventListener('scroll', animateOnScroll);
});

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  // Set default active tab (first tab)
  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons[0].classList.add('active');
    tabPanes[0].classList.add('active');
  }
  
  // Add click event listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get tab target
      const target = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const targetPane = document.getElementById(target);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
} 