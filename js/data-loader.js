// Data loader for all JSON data files

document.addEventListener('DOMContentLoaded', () => {
  // Load all data
  Promise.all([
    fetch('data/profile.json').then(res => res.json()),
    fetch('data/navigation.json').then(res => res.json()),
    fetch('data/about.json').then(res => res.json()),
    fetch('data/resume.json').then(res => res.json()),
    fetch('data/honors.json').then(res => res.json()),
    fetch('data/contact.json').then(res => res.json())
  ])
  .then(([profileData, navigationData, aboutData, resumeData, honorsData, contactData]) => {
    // Load profile data (Sidebar and Mobile Header)
    loadProfileData(profileData);
    
    // Load navigation (Main Tabs)
    loadNavigation(navigationData); 
    
    // Load content sections
    loadAboutSection(aboutData);
    loadResumeSection(resumeData);
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
    }
  }
  
  // Load main navigation tabs (for Desktop/Tablet view)
  function loadNavigation(data) {
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      tabNavigation.innerHTML = ''; // Clear only main tab buttons
      data.tabs.forEach(tab => {
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
        timelineItem.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>${job.title}</h4>
            <p class="company">${job.company}</p>
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