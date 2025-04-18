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
  
  // Tab navigation setup is now called from data-loader.js after data loads
  // setupTabNavigation(); 
  
  // Scrollspy for navigation (Keep if you want sidebar links to highlight on scroll)
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.sidebar .nav-links a'); // Target sidebar links specifically if they exist
  
  function resetActiveClass() {
    navItems.forEach(item => {
      item.classList.remove('active');
    });
  }
  
  // Highlight active nav link based on scroll position
  function handleScroll() {
    const scrollPosition = window.scrollY;
    let currentSectionId = null;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = sectionId;
      }
    });

    resetActiveClass();
    if (currentSectionId) {
      const activeNavLink = document.querySelector(`.sidebar .nav-links a[href="#${currentSectionId}"]`);
      if (activeNavLink) {
        activeNavLink.classList.add('active');
      }
    }
  }
  
  // Only add scroll event listener if there are sidebar nav items to update
  if (navItems.length > 0) {
    window.addEventListener('scroll', handleScroll);
  }
  
  // Smooth scrolling for navigation links (If sidebar links are used)
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
        
        // Close mobile menu if open (shouldn't apply to sidebar links)
        // if (navLinks && navLinks.classList.contains('show')) {
        //   navLinks.classList.remove('show');
        // }
      }
    });
  });
  
  // Contact form submission (remains unchanged)
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      console.log('Form Submitted:', formValues);
      alert('Thank you! Your message has been sent.');
      contactForm.reset();
    });
  }
  
  // REMOVED: General fade-in application on load
  // const elements = document.querySelectorAll('.service-card, .timeline-item, .portfolio-item, .skill-item');
  // elements.forEach(element => {
  //   element.classList.add('fade-in');
  // });
});

// Function to apply fade-in class to visible elements in a tab
function showTabContent(tabPane) {
  if (!tabPane) return;
  const elements = tabPane.querySelectorAll('.service-card, .timeline-item, .portfolio-item, .skill-item');
  elements.forEach(element => {
    // Ensure the class is added to trigger the transition/animation
    element.classList.add('fade-in'); 
  });
}

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  // Find the initially active tab and pane
  let initialActivePane = null;
  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach((btn, index) => {
      if (btn.classList.contains('active')) {
        const targetId = btn.getAttribute('data-tab');
        initialActivePane = document.getElementById(targetId);
        if (initialActivePane) {
          initialActivePane.classList.add('active');
        } else {
          // Fallback if active button doesn't match a pane
          tabButtons[0].classList.add('active');
          tabPanes[0].classList.add('active');
          initialActivePane = tabPanes[0];
        }
      }
    });
    // Ensure at least one tab is active if none were marked
    if (!initialActivePane && tabPanes.length > 0) {
      tabButtons[0].classList.add('active');
      tabPanes[0].classList.add('active');
      initialActivePane = tabPanes[0];
    }
  }

  // Show content for the initially active tab immediately
  if (initialActivePane) {
    showTabContent(initialActivePane);
  }
  
  // Add click event listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        // Show content for the newly activated tab
        showTabContent(targetPane);
      }
    });
  });
} 