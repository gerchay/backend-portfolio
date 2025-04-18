// Blog JavaScript for handling blog posts

document.addEventListener('DOMContentLoaded', () => {
  // Blog items data
  const blogItems = [
    {
      id: 1,
      title: 'The Future of Web Development in 2023',
      date: 'June 15, 2023',
      image: 'assets/images/blog-placeholder-1.jpg',
      snippet: 'Exploring emerging trends and technologies that will shape web development in the coming years.',
      tags: ['Web Development', 'Trends']
    },
    {
      id: 2,
      title: 'Building Accessible Web Applications',
      date: 'May 20, 2023',
      image: 'assets/images/blog-placeholder-2.jpg',
      snippet: 'Best practices and guidelines for creating web applications that are accessible to all users.',
      tags: ['Accessibility', 'UI/UX']
    },
    {
      id: 3,
      title: 'Getting Started with React Hooks',
      date: 'April 10, 2023',
      image: 'assets/images/blog-placeholder-3.jpg',
      snippet: 'A comprehensive guide to understanding and implementing React Hooks in your projects.',
      tags: ['React', 'JavaScript']
    },
    {
      id: 4,
      title: 'Optimizing Performance in Mobile Applications',
      date: 'March 5, 2023',
      image: 'assets/images/blog-placeholder-4.jpg',
      snippet: 'Strategies and techniques to improve the performance of your mobile applications.',
      tags: ['Mobile', 'Performance']
    },
    {
      id: 5,
      title: 'Introduction to GraphQL',
      date: 'February 18, 2023',
      image: 'assets/images/blog-placeholder-5.jpg',
      snippet: 'Learn the basics of GraphQL and how it can improve API development and data fetching.',
      tags: ['GraphQL', 'API']
    },
    {
      id: 6,
      title: 'The Importance of UI/UX Design',
      date: 'January 25, 2023',
      image: 'assets/images/blog-placeholder-6.jpg',
      snippet: 'Why good design matters and how it can significantly improve user engagement and satisfaction.',
      tags: ['Design', 'UI/UX']
    }
  ];

  // Get blog grid element
  const blogGrid = document.querySelector('.blog-grid');
  
  // Create and render blog items
  function renderBlogItems() {
    // Clear existing items
    blogGrid.innerHTML = '';
    
    // Loop through items and create HTML
    blogItems.forEach(item => {
      const blogItem = document.createElement('div');
      blogItem.classList.add('blog-item');
      
      // Create tags HTML
      const tagsHTML = item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('');
      
      // Set inner HTML
      blogItem.innerHTML = `
        <div class="blog-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="blog-content">
          <p class="blog-date">${item.date}</p>
          <h4>${item.title}</h4>
          <p>${item.snippet}</p>
          <div class="portfolio-tags">
            ${tagsHTML}
          </div>
        </div>
      `;
      
      // Add click event for blog detail (placeholder for now)
      blogItem.addEventListener('click', () => {
        console.log(`Blog clicked: ${item.title}`);
        // In a real implementation, this would navigate to the blog post page
      });
      
      // Add to grid
      blogGrid.appendChild(blogItem);
    });
  }
  
  // Initial render
  renderBlogItems();
  
  // Create placeholder images for the blog if needed
  function createPlaceholderImages() {
    // Use a simple colored div as placeholder if images don't exist
    const blogImages = document.querySelectorAll('.blog-image img');
    
    blogImages.forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        this.parentElement.style.backgroundColor = '#8b5cf6';
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