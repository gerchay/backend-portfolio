document.addEventListener('DOMContentLoaded', () => {
    // Create a MutationObserver to watch for the button
    const observer = new MutationObserver((mutations, obs) => {
        const downloadButton = document.getElementById('download-cv-btn');
        if (downloadButton) {
            obs.disconnect(); // Stop observing once we find the button
            console.log('Download CV button found, initializing PDF generator');
            
            downloadButton.addEventListener('click', async () => {
                console.log('Download CV button clicked');
                downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                downloadButton.disabled = true;

                try {
                    const dataUrls = [
                        'data/profile.json',
                        'data/about.json',
                        'data/resume.json',
                        'data/portfolio.json',
                        'data/honors.json',
                        'data/contact.json',
                        'data/interests.json'
                    ];

                    const responses = await Promise.all(dataUrls.map(url => fetch(url)));
                    const jsonData = await Promise.all(responses.map(res => {
                        if (!res.ok) {
                            throw new Error(`Failed to fetch ${res.url}: ${res.statusText}`);
                        }
                        return res.json();
                    }));

                    const cvData = {
                        profile: jsonData[0],
                        about: jsonData[1],
                        resume: jsonData[2],
                        portfolio: jsonData[3],
                        honors: jsonData[4],
                        contact: jsonData[5],
                        interests: jsonData[6]
                    };

                    console.log('Fetched CV data:', cvData);

                    // Load icon maps
                    const iconMap = await loadIconMap();

                    // Get jsPDF from window object
                    if (typeof window.jspdf === 'undefined') {
                        throw new Error('jsPDF library not loaded!');
                    }
                    const { jsPDF } = window.jspdf;
                    generatePdf(cvData, jsPDF, iconMap);

                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Failed to generate PDF. Please check the console for details.');
                } finally {
                    downloadButton.innerHTML = '<i class="fas fa-download"></i>';
                    downloadButton.disabled = false;
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Function to create icon map with image URLs
async function loadIconMap() {
    // Map FontAwesome icons to image URLs
    const iconMap = {
        // Section icons
        'fas fa-briefcase': 'https://img.icons8.com/ios-filled/50/FFFFFF/briefcase.png',
        'fas fa-graduation-cap': 'https://img.icons8.com/ios-filled/50/FFFFFF/graduation-cap.png',
        'fas fa-certificate': 'https://img.icons8.com/ios-filled/50/FFFFFF/certificate.png',
        'fas fa-language': 'https://img.icons8.com/ios-filled/50/FFFFFF/language.png',
        'fas fa-laptop-code': 'https://img.icons8.com/ios-filled/50/FFFFFF/source-code.png',
        'fas fa-brain': 'https://img.icons8.com/ios-filled/50/FFFFFF/brain.png',
        'fas fa-heart': 'https://img.icons8.com/ios-filled/50/FFFFFF/hearts.png',
        'fas fa-award': 'https://img.icons8.com/ios-filled/50/FFFFFF/medal.png',
        
        // Contact icons
        'fas fa-envelope': 'https://img.icons8.com/ios-filled/50/FFFFFF/mail.png',
        'fas fa-phone': 'https://img.icons8.com/ios-filled/50/FFFFFF/phone.png',
        'fas fa-map-marker-alt': 'https://img.icons8.com/ios-filled/50/FFFFFF/marker.png',
        'fab fa-linkedin': 'https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png'
    };
    
    // For dark icons (for white backgrounds)
    const darkIconMap = {};
    for (const [key, url] of Object.entries(iconMap)) {
        darkIconMap[key] = url.replace('FFFFFF', '111827');
    }
    
    return { 
        light: iconMap,
        dark: darkIconMap 
    };
}

// Function to get fallback character if icon image fails
function getFontAwesomeChar(iconName) {
    const iconMap = {
        'fas fa-briefcase': 'W',
        'fas fa-graduation-cap': 'E',
        'fas fa-certificate': 'C',
        'fas fa-language': 'L',
        'fas fa-brain': 'S',
        'fas fa-heart': 'I',
        'fas fa-award': 'A',
        'fas fa-code': 'C',
        'fas fa-code': 'T',
        'fas fa-envelope': '@',
        'fas fa-phone': '#',
        'fas fa-map-marker-alt': 'L',
        'fab fa-linkedin': 'in'
    };
    
    return iconMap[iconName] || iconName.charAt(iconName.length - 1).toUpperCase();
}

async function generatePdf(data, jsPDF, iconMap) {
    console.log('Generating PDF with data:', data);
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Force black text by default
    doc.setTextColor('#000000');
    
    // Document Settings
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    
    // Layout settings
    const sidebarWidth = 65;
    const mainContentX = sidebarWidth + margin;
    const mainContentWidth = pageWidth - mainContentX - margin;
    let sidebarY = margin + 50;
    let mainY = margin;

    // Draw sidebar background
    doc.setFillColor('#111827'); // Dark gray
    doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

    // Helper function to add text in the main content area
    function addMainText(text, y, size = 10, style = 'normal', isBlue = false, indent = 0) {
        if (!text) return y;
        
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        
        // Set text color
        if (isBlue) {
            doc.setTextColor('#3B82F6'); // Blue
        } else {
            doc.setTextColor('#000000'); // Black
        }
        
        const x = mainContentX + indent;
        const maxWidth = mainContentWidth - indent;
        const splitText = doc.splitTextToSize(text, maxWidth);
        
        // Force-print text
        for (let i = 0; i < splitText.length; i++) {
            doc.text(splitText[i], x, y + (i * size * 0.353));
        }
        
        return y + (splitText.length * size * 0.353) + 2;
    }

    // Helper function to add text in the sidebar
    function addSidebarText(text, y, size = 10, style = 'normal') {
        if (!text) return y;
        
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor('#FFFFFF'); // White
        
        const splitText = doc.splitTextToSize(text, sidebarWidth - margin);
        
        // Force-print text
        for (let i = 0; i < splitText.length; i++) {
            doc.text(splitText[i], margin, y + (i * size * 0.353));
        }
        
        return y + (splitText.length * size * 0.353) + 2;
    }

    // Helper to add a section title in main content with icon
    function addMainSectionTitle(title, y, iconName = null) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor('#3B82F6'); // Blue
        
        // Add icon
        if (iconName) {
            try {
                const iconSize = 6; // mm
                const circleSize = 9; // mm - increased circle size
                const iconX = mainContentX - circleSize - 2;
                const iconY = y - circleSize/2;
                
                // Draw circle background for main content icons
                doc.setFillColor('#111827'); // Dark gray background
                doc.circle(iconX + circleSize/2, iconY + circleSize/2, circleSize/2, 'F');
                
                // Add icon image if available in map
                if (iconMap.light[iconName]) {
                    // Center the icon within the circle
                    const iconOffset = (circleSize - iconSize) / 2;
                    doc.addImage(iconMap.light[iconName], 'PNG', iconX + iconOffset, iconY + iconOffset, iconSize, iconSize);
                } else {
                    // Fallback to letter
                    const iconChar = getFontAwesomeChar(iconName);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor('#FFFFFF');
                    doc.setFontSize(7);
                    doc.text(iconChar, mainContentX - 10, y - 0.5);
                }
            } catch (e) {
                console.error('Error adding icon image:', e);
                // Fallback to letter
                const iconChar = getFontAwesomeChar(iconName);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor('#FFFFFF');
                doc.setFontSize(7);
                doc.text(iconChar, mainContentX - 10, y - 0.5);
            }
        }
        
        // Add the title text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor('#3B82F6'); // Blue
        doc.text(title.toUpperCase(), mainContentX, y);
        
        return y + 8;
    }

    // Helper to add a sidebar section title with icon
    function addSidebarSectionTitle(title, y, iconName = null) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor('#FFFFFF'); // White
        
        // Add icon without circle
        if (iconName) {
            try {
                const iconSize = 6; // mm
                const iconX = margin - iconSize - 2;
                const iconY = y - iconSize/2;
                
                // Add icon image if available in map
                if (iconMap.light[iconName]) {
                    doc.addImage(iconMap.light[iconName], 'PNG', iconX, iconY, iconSize, iconSize);
                } else {
                    // Fallback to letter
                    const iconChar = getFontAwesomeChar(iconName);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor('#FFFFFF');
                    doc.setFontSize(7);
                    doc.text(iconChar, margin - 7, y - 0.5);
                }
            } catch (e) {
                console.error('Error adding sidebar icon image:', e);
                // Fallback to letter
                const iconChar = getFontAwesomeChar(iconName);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor('#FFFFFF');
                doc.setFontSize(7);
                doc.text(iconChar, margin - 7, y - 0.5);
            }
        }
        
        // Add the title text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor('#FFFFFF'); // White
        doc.text(title.toUpperCase(), margin, y);
        return y + 6;
    }

    // Helper to add bullet point with different style
    function addBulletPoint(text, y, size = 10, style = 'normal', indent = 5) {
        if (!text) return y;
        
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor('#000000'); // Black
        
        // Add bullet point
        doc.setFillColor('#3B82F6'); // Blue bullet
        doc.circle(mainContentX + 2, y - 2, 1, 'F');
        
        const x = mainContentX + indent;
        const maxWidth = mainContentWidth - indent;
        const splitText = doc.splitTextToSize(text, maxWidth);
        
        // Force-print text
        for (let i = 0; i < splitText.length; i++) {
            doc.text(splitText[i], x, y + (i * size * 0.353));
        }
        
        return y + (splitText.length * size * 0.353) + 2;
    }

    // Try to add profile picture
    try {
        if (data.profile.avatar) {
            const imgWidth = 45;
            const imgX = 10;
            const imgY = 10;
            
            // Draw circle background for profile picture
            doc.setFillColor(255, 255, 255);
            doc.circle(imgX + imgWidth/2, imgY + imgWidth/2, imgWidth/2, 'F');
            
            // Try to add image directly
            doc.addImage(data.profile.avatar, 'PNG', imgX, imgY, imgWidth, imgWidth);
            
            // Add border with increased size
            doc.setDrawColor('#3B82F6'); // Blue border
            doc.setLineWidth(1.5); // Increased border width
            doc.circle(imgX + imgWidth/2, imgY + imgWidth/2, imgWidth/2, 'S');
        }
    } catch (error) {
        console.error('Error adding profile picture:', error);
    }

    // Profile Section
    mainY = addMainText(data.profile.name, mainY, 24, 'bold', true);
    mainY = addMainText(data.profile.title, mainY, 14, 'normal', true);
    mainY += 5;

    // Contact info with icons
    let contactInfo = [];
    let contactIcons = [];
    data.profile.contactInfo.forEach(info => {
        if (info.icon.includes('fa-envelope') || 
           info.icon.includes('fa-phone') || 
           info.icon.includes('fa-map-marker-alt') || 
           info.icon.includes('fa-linkedin')) {
            contactInfo.push(info.text);
            contactIcons.push(info.icon);
        }
    });
    
    // Contact info box
    const contactY = mainY;
    const contactHeight = 15;
    doc.setFillColor('#111827');
    doc.roundedRect(mainContentX, contactY - 5, mainContentWidth, contactHeight, 2, 2, 'F');
    
    // Add contact info text with icons
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(9);
    
    // Add contact icons and text
    for (let i = 0; i < contactInfo.length; i++) {
        // Adjust spacing for second contact
        const spacing = i === 1 ? 15 : 10; // More space for second contact
        const x = mainContentX + spacing + (i * (mainContentWidth / contactInfo.length));
        const iconSize = 4; // mm
        const iconY = contactY + 3; // Align with text
        
        try {
            // Add icon image if available in map
            if (iconMap.light[contactIcons[i]]) {
                doc.addImage(iconMap.light[contactIcons[i]], 'PNG', x - 6, iconY - iconSize/2, iconSize, iconSize);
            } else {
                // Fallback to text
                doc.setFont('helvetica', 'bold');
                doc.text(getFontAwesomeChar(contactIcons[i]), x - 7, iconY + 1);
            }
        } catch (e) {
            console.error('Error adding contact icon:', e);
            // Fallback to text
            doc.setFont('helvetica', 'bold');
            doc.text(getFontAwesomeChar(contactIcons[i]), x - 7, iconY + 1);
        }
        
        // Add contact text
        doc.setFont('helvetica', 'normal');
        doc.text(contactInfo[i], x, iconY + 1);
    }
    
    mainY = contactY + contactHeight + 5;

    // About section
    if (data.about && data.about.description) {
        doc.setTextColor('#000000');
        mainY = addMainText(data.about.description, mainY, 10);
        mainY += 10;
    }

    // Skills Section
    sidebarY = addSidebarSectionTitle('TECHNICAL SKILLS', sidebarY, data.resume.sectionIcons?.technicalSkills || 'T');
    if (data.resume.technicalSkills) {
        data.resume.technicalSkills.forEach(skill => {
            const cleanedSkill = skill.name.replace(/\s*\([^)]*\)/g, '').trim();
            sidebarY = addSidebarText(cleanedSkill, sidebarY, 9);
        });
    }
    sidebarY += 10;
    sidebarY = addSidebarSectionTitle('SOFT SKILLS', sidebarY, data.resume.sectionIcons?.softSkills || 'S');
    
    if (data.resume.softSkills) {
        data.resume.softSkills.forEach(skill => {
            const cleanedSkill = skill.name.replace(/\s*\([^)]*\)/g, '').trim();
            sidebarY = addSidebarText(cleanedSkill, sidebarY, 9);
        });
    }
    sidebarY += 10;

    // Education Section in Sidebar
    sidebarY = addSidebarSectionTitle('EDUCATION', sidebarY, data.resume.sectionIcons?.education || 'E');
    if (data.resume.education) {
        data.resume.education.forEach(edu => {
            sidebarY = addSidebarText(edu.degree, sidebarY, 9, 'bold');
            sidebarY = addSidebarText(edu.institution, sidebarY, 8);
            sidebarY = addSidebarText(edu.period, sidebarY, 8, 'italic');
            sidebarY += 3;
        });
    }
    sidebarY += 10;

    // Languages Section in Sidebar
    sidebarY = addSidebarSectionTitle('LANGUAGES', sidebarY, data.resume.sectionIcons?.languages || 'L');
    if (data.resume.languages && data.resume.languages.length > 0) {
        data.resume.languages.forEach(lang => {
            sidebarY = addSidebarText(lang.language, sidebarY, 9, 'bold');
            sidebarY = addSidebarText(lang.proficiency, sidebarY, 8, 'italic');
            sidebarY += 2;
        });
    } else {
        // Fallback to some common languages if not specified
        sidebarY = addSidebarText('English', sidebarY, 9, 'bold');
        sidebarY = addSidebarText('Bilingual Proficiency', sidebarY, 8, 'italic');
        sidebarY += 2;
    }
    sidebarY += 10;

    // Interests Section
    sidebarY = addSidebarSectionTitle('INTERESTS', sidebarY, data.interests?.sectionIcon || 'I');
    console.log('Interests data:', data.interests);
    
    // Interest icons and titles in sidebar
    if (data.interests && data.interests.coreInterests && data.interests.coreInterests.length > 0) {
        console.log('Using coreInterests from interests data');
        for (const interest of data.interests.coreInterests) {
            try {
                console.log('Adding interest:', interest.title);
                const iconSize = 4; // mm
                const iconX = margin;
                const iconY = sidebarY;
                
                // Add icon if available
                if (interest.icon && iconMap.light[interest.icon]) {
                    doc.addImage(iconMap.light[interest.icon], 'PNG', iconX, iconY - iconSize/2, iconSize, iconSize);
                    sidebarY = addSidebarText('  ' + interest.title, sidebarY, 9, 'bold');
                } else {
                    sidebarY = addSidebarText(interest.title, sidebarY, 9, 'bold');
                }
                sidebarY += 2; // Extra space after each interest
            } catch (e) {
                console.error('Error adding interest icon:', e);
                sidebarY = addSidebarText(interest.title, sidebarY, 9, 'bold');
                sidebarY += 2;
            }
        }
    } else if (data.resume.interests) {
        console.log('Falling back to resume interests');
        data.resume.interests.forEach(interest => {
            sidebarY = addSidebarText(interest, sidebarY, 9);
            sidebarY += 2;
        });
    } else {
        console.log('Using placeholder interests');
        // Add some placeholder interests
        ['Technology', 'Web 3.0', 'Sustainability'].forEach(interest => {
            sidebarY = addSidebarText(interest, sidebarY, 9);
            sidebarY += 2;
        });
    }

    // Work Experience Section in Main Content
    mainY = addMainSectionTitle('WORK EXPERIENCE', mainY, data.resume.sectionIcons?.experience || 'W');
    if (data.resume.experience) {
        data.resume.experience.forEach(job => {
            mainY = addMainText(job.title, mainY, 12, 'bold');
            mainY = addMainText(job.company, mainY, 11, 'normal');
            doc.setTextColor('#808080'); // Gray for dates
            mainY = addMainText(job.period, mainY, 10, 'italic');
            doc.setTextColor('#000000'); // Reset to black
            
            // Add achievements as bullet points
            if (job.achievements && Array.isArray(job.achievements)) {
                mainY += 2;
                doc.text('Achievements', mainContentX, mainY);
                mainY += 4;
                job.achievements.forEach(achievement => {
                    mainY = addBulletPoint(achievement, mainY, 10, 'normal', 8);
                });
            } else if (job.description) {
                mainY = addMainText(job.description, mainY, 10, 'normal', false, 5);
            }
            mainY += 5;
        });
    }

    // Certifications/Courses Section
    mainY = addMainSectionTitle('CONFERENCES & COURSES', mainY, data.resume.sectionIcons?.certifications || 'C');
    if (data.resume.certifications) {
        // Collect all certification items
        const allCerts = [];
        data.resume.certifications.forEach(category => {
            if (category.items) {
                category.items.forEach(cert => {
                    const certText = cert.includes('|') ? cert.split('|')[0].trim() : cert;
                    allCerts.push(certText);
                });
            }
        });
        
        // Limit to first 4 items
        const maxCerts = 4;
        const certsToShow = allCerts.slice(0, maxCerts);
        certsToShow.forEach(certText => {
            mainY = addBulletPoint(certText, mainY, 10, 'normal', 8);
        });
        
        // Add "...etc" if there are more
        if (allCerts.length > maxCerts) {
            mainY = addBulletPoint(`...and ${allCerts.length - maxCerts} more`, mainY, 10, 'italic', 8);
        }
    }
    
    // Honors & Awards Section
    mainY += 5;
    mainY = addMainSectionTitle('HONORS & AWARDS', mainY, data.honors?.sectionIcon || 'A');
    if (data.honors && data.honors.awards && data.honors.awards.length > 0) {
        data.honors.awards.forEach(award => {
            const awardText = `${award.title} - ${award.organization}, ${award.date}`;
            mainY = addBulletPoint(awardText, mainY, 10, 'normal', 8);
        });
    }

    console.log('Generated PDF with icons from data');

    try {
        doc.save('Asad_Al_Badi_CV.pdf');
        console.log('PDF saved.');
    } catch (e) {
        console.error('Error saving PDF:', e);
        alert('Could not save the PDF.');
    }
}