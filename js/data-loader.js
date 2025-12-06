// Data loader for all JSON data files

document.addEventListener('DOMContentLoaded', () => {
  // Load all data
  Promise.all([
    fetch('data/profile.json').then(res => res.json()),
    fetch('data/navigation.json').then(res => res.json()),
    fetch('data/about.json').then(res => res.json()),
    fetch('data/resume.json').then(res => res.json()),
    fetch('data/portfolio.json').then(res => res.json()),
    fetch('data/interests.json').then(res => res.json()),
    fetch('data/honors.json').then(res => res.json()),
    fetch('data/contact.json').then(res => res.json())
  ])
  .then(([profileData, navigationData, aboutData, resumeData, portfolioData, interestsData, honorsData, contactData]) => {
    // Load profile data (Sidebar and Mobile Header)
    loadProfileData(profileData);
    
    // Load navigation (Main Tabs)
    loadNavigation(navigationData); 
    
    // Load content sections
    loadAboutSection(aboutData);
    loadResumeSection(resumeData);
    loadInterestsSection(interestsData);
    loadHonorsSection(honorsData);
    loadContactSection(contactData);
    
    // Set footer
    loadFooter(profileData.footer);
    
    // Reinitialize tab navigation AFTER data and buttons are loaded
    if (typeof setupTabNavigation === 'function') {
      setupTabNavigation();
    }

    // Debug log to check if skills data exists
    console.log('Technical Skills:', resumeData.technicalSkills);
    console.log('Soft Skills:', resumeData.softSkills);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
  
  // Load profile data into sidebar and mobile header/menu
  function loadProfileData(data) {
    // Name and Title (Sidebar & Mobile Header)
    document.querySelectorAll('.sidebar .name, .mobile-profile .name').forEach(el => {
      el.textContent = data.name;
    });
    document.querySelectorAll('.sidebar .title, .mobile-profile .title').forEach(el => {
      el.textContent = data.title;
    });
    
    // Avatar (Sidebar & Mobile Header)
    document.querySelectorAll('.sidebar .avatar img, .mobile-profile img').forEach(el => {
      el.src = data.avatar;
      el.alt = data.name ? `${data.name}'s profile picture` : 'Profile picture'; 
    });
    
    // Contact info (Sidebar)
    const contactInfoContainerSidebar = document.querySelector('.sidebar .contact-info');
    if (contactInfoContainerSidebar) {
      contactInfoContainerSidebar.innerHTML = '';
      data.contactInfo.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
          <i class="${item.icon}"></i>
          <span>${item.text}</span>
        `;
        contactInfoContainerSidebar.appendChild(infoItem);
      });
    }

    // Contact info (Mobile Menu)
    const contactInfoContainerMobileMenu = document.querySelector('.mobile-contact-info');
    if (contactInfoContainerMobileMenu) {
      contactInfoContainerMobileMenu.innerHTML = ''; // Clear existing
      data.contactInfo.forEach(item => {
          const infoItem = document.createElement('div');
          infoItem.className = 'info-item mobile'; // Add specific class if needed
          infoItem.innerHTML = `
              <i class="${item.icon}"></i>
              <span>${item.text}</span>
          `;
          contactInfoContainerMobileMenu.appendChild(infoItem);
      });
    }

    // Contact info (Mobile Header)
    const contactInfoContainerMobileHeader = document.querySelector('.mobile-header-contact');
    if (contactInfoContainerMobileHeader) {
      contactInfoContainerMobileHeader.innerHTML = ''; // Clear existing
      data.contactInfo.forEach(item => {
          const infoItem = document.createElement('div');
          // Use a different class to allow separate styling if needed
          infoItem.className = 'mobile-header-contact-item'; 
          // Omit icon for brevity in header
          infoItem.innerHTML = `<span>${item.text}</span>`; 
          contactInfoContainerMobileHeader.appendChild(infoItem);
      });
    }
    
    // Social links (Sidebar only - could be added to mobile too if desired)
    const socialLinksContainer = document.querySelector('.sidebar .social-links');
    if (socialLinksContainer) {
      socialLinksContainer.innerHTML = '';
      data.socialLinks.forEach(item => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'social-icon';
        link.target = '_blank';
        link.innerHTML = `<i class="${item.icon}"></i>`;
        link.setAttribute('aria-label', item.label);
        socialLinksContainer.appendChild(link);
      });
      const downloadLink = document.createElement('a');
      downloadLink.className = 'btn btn-primary social-icon';
      downloadLink.id = 'download-cv-btn';
      downloadLink.innerHTML = '<i class="fas fa-download"></i>';
      downloadLink.setAttribute('aria-label', 'Download CV');
      socialLinksContainer.appendChild(downloadLink);
    }
  }
  
  // Load main navigation tabs (for Desktop/Tablet view)
  function loadNavigation(data) {
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      tabNavigation.innerHTML = ''; // Clear only main tab buttons
      // Filter out hidden tabs
      const visibleTabs = data.tabs.filter(tab => !tab.hidden);
      visibleTabs.forEach(tab => {
        const button = document.createElement('button');
        button.className = 'tab-btn' + (tab.active ? ' active' : '');
        button.dataset.tab = tab.id;
        button.textContent = tab.title;
        tabNavigation.appendChild(button);
      });
    } 
    // Mobile links are now generated in setupTabNavigation in main.js
  }
  
  // Load about section
  function loadAboutSection(data) {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    // Set section title
    const sectionHeader = aboutSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Set about description
    const aboutText = aboutSection.querySelector('.about-text');
    if (aboutText) {
      aboutText.textContent = data.description;
    }
    
    // Set services
    const servicesGrid = aboutSection.querySelector('.services-grid');
    if (servicesGrid) {
      servicesGrid.innerHTML = '';
      
      data.services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
          <i class="${service.icon}"></i>
          <h4>${service.title}</h4>
          <p>${service.description}</p>
        `;
        servicesGrid.appendChild(serviceCard);
      });
    }
  }
  
  // Load resume section
  function loadResumeSection(data) {
    const resumeSection = document.getElementById('resume');
    if (!resumeSection) return;
    
    // Set section title
    const sectionHeader = resumeSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Work Experience
    const experienceTimeline = resumeSection.querySelector('.resume-section:nth-of-type(1) .timeline');
    if (experienceTimeline) {
      experienceTimeline.innerHTML = '';
      data.experience.forEach(job => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        // Create logo element if URL exists
        let logoHTML = '';
        if (job.logo) {
            logoHTML = `<img src="${job.logo}" alt="${job.company} logo" class="company-logo">`;
        }

        timelineItem.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>${job.title}</h4>
            <div class="company-info"> 
              ${logoHTML}
              <p class="company">${job.company}</p>
            </div>
            <p class="period">${job.period}</p>
            <p class="description">${job.description}</p>
          </div>
        `;
        experienceTimeline.appendChild(timelineItem);
      });
    }
    
    // Education
    const educationTimeline = resumeSection.querySelector('.resume-section:nth-of-type(2) .timeline');
    if (educationTimeline) {
      educationTimeline.innerHTML = '';
      data.education.forEach(edu => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>${edu.degree}</h4>
            <p class="company">${edu.institution}</p>
            <p class="period">${edu.period}</p>
          </div>
        `;
        educationTimeline.appendChild(timelineItem);
      });
    }
    
    // Certifications
    const certTimeline = resumeSection.querySelector('.resume-section:nth-of-type(3) .timeline');
    if (certTimeline) {
      certTimeline.innerHTML = '';
      data.certifications.forEach(cert => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        const listItems = cert.items.map(item => `<li>${item}</li>`).join('');
        timelineItem.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>${cert.category}</h4>
            <ul class="certification-list">
              ${listItems}
            </ul>
          </div>
        `;
        certTimeline.appendChild(timelineItem);
      });
    }
    
    // Technical Skills
    const techSkillsGrid = resumeSection.querySelector('#technical-skills .skills-grid');
    if (techSkillsGrid && data.technicalSkills) {
      techSkillsGrid.innerHTML = '';
      data.technicalSkills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        // Create icon element with background
        let iconContainerHTML = '';
        if (skill.icon) {
            let iconTag = '';
            // Basic check: if it looks like a Font Awesome class
            if (skill.icon.startsWith('fa')) { 
                iconTag = `<i class="${skill.icon} skill-icon"></i>`;
            } else { // Assume it's an image URL
                iconTag = `<img src="${skill.icon}" alt="${skill.name} icon" class="skill-icon">`;
            }
            // Wrap the icon tag in the background container
            iconContainerHTML = `<span class="skill-icon-background">${iconTag}</span>`;
        }

        skillItem.innerHTML = `
          <div class="skill-header">
            ${iconContainerHTML} 
            <span class="skill-name">${skill.name}</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: ${skill.percentage}%"></div>
          </div>
        `;
        techSkillsGrid.appendChild(skillItem);
      });
    } else {
      console.warn('Technical skills section (#technical-skills .skills-grid) or data not found');
    }
    
    // Soft Skills
    const softSkillsGrid = resumeSection.querySelector('#soft-skills .skills-grid');
    if (softSkillsGrid && data.softSkills) {
      softSkillsGrid.innerHTML = '';
      data.softSkills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
          <div class="skill-name">${skill.name}</div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: ${skill.percentage}%"></div>
          </div>
        `;
        softSkillsGrid.appendChild(skillItem);
      });
    } else {
      console.warn('Soft skills section (#soft-skills .skills-grid) or data not found');
    }
  }
  
  // Load interests section
  function loadInterestsSection(data) {
    const interestsSection = document.getElementById('interests');
    if (!interestsSection || !data) {
        console.warn('Interests section element or data not found.');
        return;
    }

    // Set main section title
    const mainHeader = interestsSection.querySelector('.section-header h2');
    if (mainHeader) {
      mainHeader.textContent = data.title || 'Interests & Passions';
    }

    // Helper function to create a card element
    const createCardElement = (itemData, baseClass) => {
        const cardElement = document.createElement('div');
        cardElement.className = baseClass;
        
        const iconHTML = itemData.icon ? `<i class="${itemData.icon} interest-icon"></i>` : '';
        
        // Check for links and generate buttons for ALL valid links
        let linksHTML = '';
        if (itemData.links && Array.isArray(itemData.links) && itemData.links.length > 0) {
            const linkButtons = itemData.links
                .filter(link => link.url && link.icon) // Ensure both url and icon exist
                .map(link => `
                    <a href="${link.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="interest-link-btn" 
                       aria-label="${itemData.title} Link">
                        <i class="${link.icon}"></i>
                    </a>
                `).join(''); // Join multiple buttons
            
            if (linkButtons) { // Only add container if there are buttons
                linksHTML = `<div class="interest-card-links">${linkButtons}</div>`;
            }
        }

        cardElement.innerHTML = `
          <div class="interest-card-header">
            ${iconHTML}
            <h3>${itemData.title}</h3>
          </div>
          <p>${itemData.description}</p>
          ${linksHTML}
        `;
        
        return cardElement; 
    };

    // Load Core Interests
    const coreGrid = interestsSection.querySelector('.core-interests-grid');
    if (coreGrid && data.coreInterests) {
      coreGrid.innerHTML = '';
      data.coreInterests.forEach(interest => {
        const cardElement = createCardElement(interest, 'interest-card');
        coreGrid.appendChild(cardElement);
      });
    }

    // Load Fusion Passions
    const fusionContainer = interestsSection.querySelector('.fusion-passions');
    if (fusionContainer && data.fusionPassions) {
      const fusionHeader = fusionContainer.querySelector('h2');
      const fusionGrid = fusionContainer.querySelector('.fusions-grid');
      
      if(fusionHeader) fusionHeader.textContent = data.fusionTitle || 'Where Worlds Collide';
      
      if (fusionGrid) {
          fusionGrid.innerHTML = '';
          data.fusionPassions.forEach(fusion => {
             // Note: createCardElement expects h3, so we use h4 in the baseClass if needed for CSS
             // Or adjust createCardElement to accept title tag type parameter
            const cardElement = createCardElement(fusion, 'interest-card fusion-item'); 
            // Manually change h3 back to h4 if createCardElement always makes h3
            const titleElement = cardElement.querySelector('h3');
            if (titleElement) {
                const h4 = document.createElement('h4');
                h4.textContent = titleElement.textContent;
                titleElement.replaceWith(h4);
            }
            fusionGrid.appendChild(cardElement);
          });
      }
    }

    // Load Homelab Showcase
    const homelabContainer = interestsSection.querySelector('.homelab-showcase');
    if (homelabContainer && data.homelabDetails) {
      const homelabHeader = homelabContainer.querySelector('h2');
      const homelabLinksContainer = homelabContainer.querySelector('.homelab-links'); // Target new links container
      const homelabContent = homelabContainer.querySelector('.homelab-content');

      if(homelabHeader) homelabHeader.textContent = data.homelabTitle || 'The Digital Forge – My Homelab';

      // Populate Homelab Links under the title
      if(homelabLinksContainer && data.homelabDetails.links && Array.isArray(data.homelabDetails.links)) {
          homelabLinksContainer.innerHTML = ''; // Clear previous
          data.homelabDetails.links
              .filter(link => link.url && link.icon) // Keep filtering for valid links
              .forEach(link => {
                  const linkButton = document.createElement('a');
                  linkButton.href = link.url;
                  linkButton.target = '_blank';
                  linkButton.rel = 'noopener noreferrer';
                  linkButton.className = 'homelab-link-btn'; 
                  linkButton.setAttribute('aria-label', link.label || 'Homelab Link');
                  // Add both icon and label text
                  linkButton.innerHTML = `<i class="${link.icon}"></i> <span>${link.label || 'Link'}</span>`; 
                  homelabLinksContainer.appendChild(linkButton);
              });
      }

      // Populate Homelab Content (Image, Description, Specs)
      if(homelabContent) {
          homelabContent.innerHTML = ''; // Clear existing
          
          // Keep image separate, no longer linked itself
          let imageHTML = '';
          if(data.homelabDetails.image) {
              imageHTML = `<img src="${data.homelabDetails.image}" alt="My Homelab Setup" class="homelab-image">`;
          }
          const imageContainerHTML = imageHTML ? `<div class="homelab-image-container">${imageHTML}</div>` : '';

          let descriptionHTML = '';
          if(data.homelabDetails.description) {
              descriptionHTML = `<p class="homelab-description">${data.homelabDetails.description}</p>`;
          }

          let specsHTML = '';
          if(data.homelabDetails.specs && Array.isArray(data.homelabDetails.specs)) {
              const specItems = data.homelabDetails.specs.map(spec => 
                  `<li>${spec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`
              ).join('');
              specsHTML = `<ul class="homelab-specs">${specItems}</ul>`;
          }

          // Structure: description (left) + image (right), specs full width below
          homelabContent.innerHTML = `
              <div class="homelab-text">
                  ${descriptionHTML}
              </div>
              ${imageContainerHTML}
              <div class="homelab-specs-container">
                  ${specsHTML}
              </div>
          `;
      }
    }
  }
  
  // Load honors section
  function loadHonorsSection(data) {
    const honorsSection = document.getElementById('honors');
    if (!honorsSection) return;
    
    // Set section title
    const sectionHeader = honorsSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Awards timeline
    const timeline = honorsSection.querySelector('.timeline');
    if (timeline) {
      timeline.innerHTML = '';
      
      data.awards.forEach(award => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>${award.title}</h4>
            <p class="company">${award.organization}</p>
            <p class="period">${award.date}</p>
            <p class="description">${award.description}</p>
          </div>
        `;
        timeline.appendChild(timelineItem);
      });
    }
  }
  
  // Load contact section
  function loadContactSection(data) {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    
    // Set section title
    const sectionHeader = contactSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    // Form fields
    const form = contactSection.querySelector('.contact-form');
    if (form) {
      form.innerHTML = '';
      
      // Create form fields
      data.form.fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);
        
        if (field.type === 'textarea') {
          const textarea = document.createElement('textarea');
          textarea.id = field.id;
          textarea.name = field.id;
          textarea.rows = field.rows || 5;
          if (field.required) textarea.required = true;
          formGroup.appendChild(textarea);
        } else {
          const input = document.createElement('input');
          input.type = field.type;
          input.id = field.id;
          input.name = field.id;
          if (field.required) input.required = true;
          formGroup.appendChild(input);
        }
        
        form.appendChild(formGroup);
      });
      
      // Add submit button
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'submit-btn';
      button.textContent = data.form.submitButton;
      form.appendChild(button);
    }
    
    // Map
    const mapContainer = contactSection.querySelector('.map-container');
    if (mapContainer && data.map.embedUrl) {
      mapContainer.innerHTML = `
        <iframe src="${data.map.embedUrl}" 
                style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      `;
    }
  }
  
  // Load footer
  function loadFooter(data) {
    const footer = document.querySelector('.footer');
    if (footer && data) {
      footer.innerHTML = `<p>${data.copyright}</p>`;
    }
  }
}); 

// Moved utility functions outside DOMContentLoaded scope 
// to be accessible by data-loader.js's call to setupTabNavigation

// Function to apply fade-in class to visible elements in a tab
function showTabContent(tabPane) {
  if (!tabPane) return;
  const elements = tabPane.querySelectorAll('.service-card, .timeline-item, .portfolio-item, .skill-item');
  elements.forEach(element => {
    // Ensure the class is added to trigger the transition/animation
    element.classList.add('fade-in'); 
  });
}

// Setup tab navigation (for main tabs and mobile menu)
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