// Portfolio JavaScript for handling portfolio items and filtering

document.addEventListener('DOMContentLoaded', () => {
  // Get portfolio grid element
  const portfolioGrid = document.querySelector('.portfolio-grid');
  
  // Fetch portfolio data from JSON file
  fetch('data/portfolio.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(portfolioItems => {
      // Initial render once data is loaded
      renderPortfolioItems(portfolioItems);
      
      // Set up filter buttons after data is loaded
      setupFilterButtons(portfolioItems);
      
      // Create placeholder images for the portfolio if needed
      createPlaceholderImages();
    })
    .catch(error => {
      console.error('Error loading portfolio data:', error);
      portfolioGrid.innerHTML = '<p class="text-center">Error loading portfolio data. Please try again later.</p>';
    });
  
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
  
  // Set up filter buttons functionality
  function setupFilterButtons(portfolioItems) {
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
        
        // Create placeholders for newly filtered items
        createPlaceholderImages();
      });
    });
  }
  
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
}); 