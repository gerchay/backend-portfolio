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
    // Load profile data
    loadProfileData(profileData);
    
    // Load navigation
    loadNavigation(navigationData);
    
    // Load content sections
    loadAboutSection(aboutData);
    loadResumeSection(resumeData);
    loadHonorsSection(honorsData);
    loadContactSection(contactData);
    
    // Set footer
    loadFooter(profileData.footer);
    
    // Reinitialize tab navigation after all tabs are loaded
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
  
  // Load profile data into sidebar and mobile header
  function loadProfileData(data) {
    // Sidebar profile
    document.querySelectorAll('.sidebar .name, .mobile-profile .name').forEach(el => {
      el.textContent = data.name;
    });
    
    document.querySelectorAll('.sidebar .title, .mobile-profile .title').forEach(el => {
      el.textContent = data.title;
    });
    
    document.querySelectorAll('.avatar img').forEach(el => {
      el.src = data.avatar;
      el.alt = data.name;
    });
    
    // Contact info
    const contactInfoContainer = document.querySelector('.contact-info');
    if (contactInfoContainer) {
      contactInfoContainer.innerHTML = '';
      
      data.contactInfo.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
          <i class="${item.icon}"></i>
          <span>${item.text}</span>
        `;
        contactInfoContainer.appendChild(infoItem);
      });
    }
    
    // Social links
    const socialLinksContainer = document.querySelector('.social-links');
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
  
  // Load navigation tabs
  function loadNavigation(data) {
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      tabNavigation.innerHTML = '';
      
      data.tabs.forEach(tab => {
        const button = document.createElement('button');
        button.className = 'tab-btn' + (tab.active ? ' active' : '');
        button.dataset.tab = tab.id;
        button.textContent = tab.title;
        tabNavigation.appendChild(button);
      });
    }
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
    const techSkillsGrid = resumeSection.querySelector('.skills-section:nth-of-type(1) .skills-grid');
    if (techSkillsGrid && data.technicalSkills) {
      techSkillsGrid.innerHTML = '';
      
      data.technicalSkills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
          <div class="skill-name">${skill.name}</div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: ${skill.percentage}%"></div>
          </div>
        `;
        techSkillsGrid.appendChild(skillItem);
      });
    } else {
      console.warn('Technical skills section or data not found');
    }
    
    // Soft Skills
    const softSkillsGrid = resumeSection.querySelector('.skills-section:nth-of-type(2) .skills-grid');
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
      console.warn('Soft skills section or data not found');
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