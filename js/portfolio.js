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
      console.log("Render: No items to display for the current filter."); 
      portfolioGrid.innerHTML = '<p class="text-center">No projects found matching the filter.</p>';
      return;
    }
    
    console.log(`Render: Attempting to display ${items.length} items.`); 
    items.forEach(item => {
      // Create the main container div
      const portfolioItemContainer = document.createElement('div');
      portfolioItemContainer.classList.add('portfolio-item');
      portfolioItemContainer.classList.add('fade-in'); 
      
      // Add redacted class if applicable
      if (item.isRedacted) {
        portfolioItemContainer.classList.add('is-redacted');
      }
      
      if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach(tag => portfolioItemContainer.classList.add(`tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`));
      }
      
      // Create tags HTML
      const tagsHTML = item.tags && Array.isArray(item.tags) 
        ? `<div class="portfolio-tags">${item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}</div>`
        : '';

      // Create details HTML
      let detailsHTML = '';
      if (item.details) {
          detailsHTML += '<div class="portfolio-item-details">';
          if(item.details.client) detailsHTML += `<p><strong>Client:</strong> ${item.details.client}</p>`;
          if(item.details.completed) detailsHTML += `<p><strong>Completed:</strong> ${item.details.completed}</p>`;
          if(item.details.services && Array.isArray(item.details.services)) {
              detailsHTML += `<p><strong>Services:</strong> ${item.details.services.join(', ')}</p>`;
          }
          detailsHTML += '</div>';
      }

      // Create Redacted Badge HTML
      const redactedBadgeHTML = item.isRedacted 
          ? '<div class="redacted-badge"><i class="fas fa-lock"></i> Redacted</div>' 
          : '';
      
      // Set inner HTML for the container
      portfolioItemContainer.innerHTML = `
        ${redactedBadgeHTML}
        <div class="portfolio-image">
          <img src="${item.image || 'https://placehold.co/800x600/eee/ccc?text=No+Image'}" alt="${item.title || 'Portfolio Item'}">
        </div>
        <div class="portfolio-content">
          <h4>${item.title || 'Untitled Project'}</h4>
          <p>${item.description || 'No description available.'}</p>
          ${tagsHTML}
          ${detailsHTML} 
        </div>
      `;
      
      // Determine the wrapper: link if URL exists and not redacted
      let finalItemElement;
      if (item.url && item.url !== '#' && !item.isRedacted) { 
          finalItemElement = document.createElement('a');
          finalItemElement.href = item.url;
          finalItemElement.target = '_blank'; 
          finalItemElement.rel = 'noopener noreferrer';
          finalItemElement.className = 'portfolio-item-link'; 
          finalItemElement.appendChild(portfolioItemContainer);
      } else {
          finalItemElement = portfolioItemContainer;
      }

      portfolioGrid.appendChild(finalItemElement);
    });
    console.log(`Render: Successfully added ${items.length} items to the grid.`);
  }
  
  // Generate filter buttons dynamically based on tags, showing only most frequent initially
  function generateFilterButtons(tags, portfolioItems) {
    if (!filtersContainer) return;

    filtersContainer.innerHTML = ''; // Clear existing buttons

    // --- Tag Frequency Calculation ---
    const tagFrequencies = tags.reduce((freq, tag) => {
        if (tag !== 'all') { // Don't count 'all' for frequency ranking
          freq[tag] = (freq[tag] || 0) + 1;
        }
        return freq;
    }, {});

    // Sort unique tags (excluding 'all') by frequency (descending), then alphabetically
    const uniqueTags = [...new Set(tags)].filter(tag => tag !== 'all');
    uniqueTags.sort((a, b) => {
        const freqDiff = (tagFrequencies[b] || 0) - (tagFrequencies[a] || 0);
        if (freqDiff !== 0) return freqDiff; // Sort by frequency first
        return a.localeCompare(b); // Then alphabetically
    });
    // --- End Frequency Calculation ---

    const initialVisibleCount = 7; // Number of tags to show initially (excluding 'All')
    const allUniqueTagsSorted = ['all', ...uniqueTags]; // Add 'all' back to the beginning

    let hiddenTagsExist = uniqueTags.length > initialVisibleCount;

    allUniqueTagsSorted.forEach((tag, index) => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.filter = tag;
        button.textContent = tag === 'all' ? 'All' : tag.charAt(0).toUpperCase() + tag.slice(1);

        if (tag === 'all') {
            button.classList.add('active');
        } else if (index > initialVisibleCount) { // Hide less frequent tags (index includes 'all')
            button.classList.add('filter-btn-hidden');
        }

        button.addEventListener('click', () => {
            console.log('--- Filter Button Clicked ---'); 
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterTag = button.dataset.filter;
            console.log(`Filtering by tag: '${filterTag}'`); 
            let itemsToRender;
            if (filterTag === 'all') {
                itemsToRender = portfolioItems;
                console.log(`Filter result: Showing all ${itemsToRender.length} items.`); 
            } else {
                itemsToRender = portfolioItems.filter(item => 
                    item.tags && Array.isArray(item.tags) && item.tags.includes(filterTag)
                );
                console.log(`Filter result: Found ${itemsToRender.length} items with tag '${filterTag}'.`); 
            }
            console.log('Calling renderPortfolioItems...'); 
            renderPortfolioItems(itemsToRender);
            console.log('Calling createPlaceholderImages...'); 
            createPlaceholderImages();
            console.log('--- Filter Action Complete ---'); 
        });
        filtersContainer.appendChild(button);
    });

    // Add Show More/Less button if there are hidden tags
    if (hiddenTagsExist) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'filter-btn filter-toggle-btn';
        toggleButton.textContent = 'Show More';
        
        toggleButton.addEventListener('click', () => {
            const hiddenButtons = filtersContainer.querySelectorAll('.filter-btn-hidden');
            const isShowingMore = filtersContainer.classList.toggle('show-all-filters');
            
            hiddenButtons.forEach(btn => {
                // Toggle direct display style for immediate effect if needed, 
                // but class toggle on container is usually preferred
                // btn.style.display = isShowingMore ? 'inline-block' : 'none'; 
            });
            
            toggleButton.textContent = isShowingMore ? 'Show Less' : 'Show More';
        });
        filtersContainer.appendChild(toggleButton);
    }
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