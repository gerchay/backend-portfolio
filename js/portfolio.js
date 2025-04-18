// Portfolio JavaScript for handling portfolio items and filtering by tags

document.addEventListener('DOMContentLoaded', () => {
  // Get portfolio grid element and filters container
  const portfolioGrid = document.querySelector('.portfolio-grid');
  const filtersContainer = document.querySelector('.portfolio-filters');
  
  // Fetch portfolio data from JSON file
  fetch('data/portfolio.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(portfolioItems => {
      if (!Array.isArray(portfolioItems)) {
          throw new Error('Portfolio data is not an array');
      }
      
      // Extract unique tags from all items
      const allTags = portfolioItems.flatMap(item => item.tags || []) 
                                  .filter(tag => typeof tag === 'string' && tag.trim() !== ''); 
      const uniqueTags = ['all', ...new Set(allTags)].sort(); 
      
      // Generate filter buttons dynamically based on tags
      generateFilterButtons(uniqueTags, portfolioItems);

      // Initial render with all items
      renderPortfolioItems(portfolioItems);
      
      // Create placeholder images for the portfolio if needed
      createPlaceholderImages();
    })
    .catch(error => {
      console.error('Error loading or processing portfolio data:', error);
      if (portfolioGrid) {
        portfolioGrid.innerHTML = '<p class="text-center">Error loading portfolio projects. Please try again later.</p>';
      }
      if (filtersContainer) {
          filtersContainer.innerHTML = '<p class="text-center">Could not load filters.</p>';
      }
    });
  
  // Create and render portfolio items
  function renderPortfolioItems(items) {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';
    
    if (!items || items.length === 0) {
      console.log("Render: No items to display for the current filter."); // Log if no items
      portfolioGrid.innerHTML = '<p class="text-center">No projects found matching the filter.</p>';
      return;
    }
    
    console.log(`Render: Attempting to display ${items.length} items.`); // Log number of items to render
    items.forEach(item => {
      const portfolioItem = document.createElement('div');
      portfolioItem.classList.add('portfolio-item');
      // Add fade-in class immediately for animation
      portfolioItem.classList.add('fade-in'); 
      
      if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach(tag => portfolioItem.classList.add(`tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`));
      }
      
      const tagsHTML = item.tags && Array.isArray(item.tags) 
        ? item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')
        : '';
      
      portfolioItem.innerHTML = `
        <div class="portfolio-image">
          <img src="${item.image || 'https://placehold.co/800x600/eee/ccc?text=No+Image'}" alt="${item.title || 'Portfolio Item'}">
        </div>
        <div class="portfolio-content">
          <h4>${item.title || 'Untitled Project'}</h4>
          <p>${item.description || 'No description available.'}</p>
          <div class="portfolio-tags">
            ${tagsHTML}
          </div>
        </div>
      `;
      
      portfolioGrid.appendChild(portfolioItem);
    });
    console.log(`Render: Successfully added ${items.length} items to the grid.`); // Confirm rendering loop finished
  }
  
  // Generate filter buttons dynamically based on tags
  function generateFilterButtons(tags, portfolioItems) {
    if (!filtersContainer) return;

    filtersContainer.innerHTML = ''; 

    tags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.filter = tag; 
        button.textContent = tag === 'all' ? 'All' : tag.charAt(0).toUpperCase() + tag.slice(1);

        if (tag === 'all') {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            console.log('--- Filter Button Clicked ---'); // Log click
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterTag = button.dataset.filter;
            console.log(`Filtering by tag: '${filterTag}'`); // Log the tag being filtered

            let itemsToRender;
            if (filterTag === 'all') {
                itemsToRender = portfolioItems;
                console.log(`Filter result: Showing all ${itemsToRender.length} items.`); // Log 'all' case
            } else {
                itemsToRender = portfolioItems.filter(item => 
                    item.tags && Array.isArray(item.tags) && item.tags.includes(filterTag)
                );
                console.log(`Filter result: Found ${itemsToRender.length} items with tag '${filterTag}'.`); // Log filtered count
                // Optional: Log the actual filtered items for deeper debugging
                // console.log('Filtered items:', itemsToRender);
            }
            
            console.log('Calling renderPortfolioItems...'); // Log before render call
            renderPortfolioItems(itemsToRender);
            
            console.log('Calling createPlaceholderImages...'); // Log before placeholder call
            createPlaceholderImages();
            console.log('--- Filter Action Complete ---'); // Log end of action
        });
        filtersContainer.appendChild(button);
    });
  }
  
  // Create placeholder images for the portfolio if needed
  function createPlaceholderImages() {
    const portfolioImages = document.querySelectorAll('.portfolio-image img');
    
    portfolioImages.forEach(img => {
      img.onerror = null; 

      img.onerror = function() { 
        if (this.src.startsWith('https://placehold.co')) return; 

        this.style.display = 'none'; 
        const parent = this.parentElement;
        
        const existingPlaceholder = parent.querySelector('.placeholder-text');
        if (existingPlaceholder) parent.removeChild(existingPlaceholder);
        
        parent.style.backgroundColor = '#3a1c71'; 
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        parent.style.height = '200px'; 
        
        const placeholderText = document.createElement('div');
        placeholderText.className = 'placeholder-text'; 
        placeholderText.textContent = this.alt || 'Image Not Found';
        placeholderText.style.color = 'white';
        placeholderText.style.padding = '2rem';
        placeholderText.style.textAlign = 'center';
        
        parent.appendChild(placeholderText);
      };
    });
  }
}); 