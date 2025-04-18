// Portfolio JavaScript for handling portfolio items and filtering

document.addEventListener('DOMContentLoaded', () => {
  // Portfolio items data
  const portfolioItems = [
    {
      id: 1,
      title: 'Modern E-commerce Platform',
      category: 'web',
      image: 'assets/images/portfolio-placeholder-1.jpg',
      description: 'A fully responsive e-commerce platform with cart, checkout, and payment integration.',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'mobile',
      image: 'assets/images/portfolio-placeholder-2.jpg',
      description: 'A secure banking application for iOS and Android with biometric authentication.',
      tags: ['React Native', 'Redux', 'Firebase']
    },
    {
      id: 3,
      title: 'Portfolio Website Design',
      category: 'design',
      image: 'assets/images/portfolio-placeholder-3.jpg',
      description: 'Clean and modern portfolio website design for creative professionals.',
      tags: ['Figma', 'UI/UX', 'Prototype']
    },
    {
      id: 4,
      title: 'Task Management Dashboard',
      category: 'web',
      image: 'assets/images/portfolio-placeholder-4.jpg',
      description: 'Intuitive dashboard for team collaboration and project management.',
      tags: ['Vue.js', 'Express', 'PostgreSQL']
    },
    {
      id: 5,
      title: 'Health Tracking App',
      category: 'mobile',
      image: 'assets/images/portfolio-placeholder-5.jpg',
      description: 'Mobile application for tracking fitness activities and health metrics.',
      tags: ['Flutter', 'Dart', 'GraphQL']
    },
    {
      id: 6,
      title: 'Brand Identity Design',
      category: 'design',
      image: 'assets/images/portfolio-placeholder-6.jpg',
      description: 'Complete brand identity design including logo, color palette, and guidelines.',
      tags: ['Branding', 'Illustrator', 'Identity']
    }
  ];

  // Get portfolio grid element
  const portfolioGrid = document.querySelector('.portfolio-grid');
  
  // Create and render portfolio items
  function renderPortfolioItems(items) {
    // Clear existing items
    portfolioGrid.innerHTML = '';
    
    // If no items match the filter
    if (items.length === 0) {
      portfolioGrid.innerHTML = '<p class="text-center">No projects found in this category.</p>';
      return;
    }
    
    // Loop through items and create HTML
    items.forEach(item => {
      const portfolioItem = document.createElement('div');
      portfolioItem.classList.add('portfolio-item');
      portfolioItem.dataset.category = item.category;
      
      // Create tags HTML
      const tagsHTML = item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('');
      
      // Set inner HTML
      portfolioItem.innerHTML = `
        <div class="portfolio-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="portfolio-content">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="portfolio-tags">
            ${tagsHTML}
          </div>
        </div>
      `;
      
      // Add to grid
      portfolioGrid.appendChild(portfolioItem);
    });
  }
  
  // Initial render
  renderPortfolioItems(portfolioItems);
  
  // Filter buttons functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filter = button.dataset.filter;
      
      // Filter items
      if (filter === 'all') {
        renderPortfolioItems(portfolioItems);
      } else {
        const filteredItems = portfolioItems.filter(item => item.category === filter);
        renderPortfolioItems(filteredItems);
      }
    });
  });
  
  // Create placeholder images for the portfolio if needed
  function createPlaceholderImages() {
    // Use a simple colored div as placeholder if images don't exist
    const portfolioImages = document.querySelectorAll('.portfolio-image img');
    
    portfolioImages.forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        this.parentElement.style.backgroundColor = '#3a1c71';
        this.parentElement.style.display = 'flex';
        this.parentElement.style.alignItems = 'center';
        this.parentElement.style.justifyContent = 'center';
        
        const placeholderText = document.createElement('div');
        placeholderText.textContent = this.alt;
        placeholderText.style.color = 'white';
        placeholderText.style.padding = '2rem';
        placeholderText.style.textAlign = 'center';
        
        this.parentElement.appendChild(placeholderText);
      });
    });
  }
  
  // Call placeholder function after rendering
  createPlaceholderImages();
}); 