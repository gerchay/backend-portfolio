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
                        'data/contact.json'
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
                        contact: jsonData[5]
                    };

                    console.log('Fetched CV data:', cvData);

                    // Get jsPDF from window object
                    if (typeof window.jspdf === 'undefined') {
                        throw new Error('jsPDF library not loaded!');
                    }
                    const { jsPDF } = window.jspdf;
                    generatePdf(cvData, jsPDF);

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

function generatePdf(data, jsPDF) {
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

    // Helper to add a section title in main content
    function addMainSectionTitle(title, y) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor('#3B82F6'); // Blue
        doc.text(title.toUpperCase(), mainContentX, y);
        
        // Add blue dot
        doc.setFillColor('#3B82F6');
        doc.circle(mainContentX - 4, y - 2, 1, 'F');
        
        return y + 8;
    }

    // Helper to add a sidebar section title
    function addSidebarSectionTitle(title, y) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor('#FFFFFF'); // White
        doc.text(title.toUpperCase(), margin, y);
        return y + 6;
    }

    // Try to add profile picture
    try {
        if (data.profile.avatar) {
            const imgWidth = 45;
            const imgX = 10;
            const imgY = 10;
            
            // Simple circle background before image
            doc.setFillColor(255, 255, 255);
            doc.circle(imgX + imgWidth/2, imgY + imgWidth/2, imgWidth/2, 'F');
            
            // Try to add image directly
            doc.addImage(data.profile.avatar, 'PNG', imgX, imgY, imgWidth, imgWidth);
        }
    } catch (error) {
        console.error('Error adding profile picture:', error);
    }

    // Profile Section
    mainY = addMainText(data.profile.name, mainY, 24, 'bold', true);
    mainY = addMainText(data.profile.title, mainY, 14, 'normal', true);
    mainY += 5;

    // Contact info
    let contactInfo = [];
    data.profile.contactInfo.forEach(info => {
        if (info.icon.includes('fa-envelope')) contactInfo.push(info.text);
        if (info.icon.includes('fa-phone')) contactInfo.push(info.text);
        if (info.icon.includes('fa-map-marker-alt')) contactInfo.push(info.text);
    });
    
    // Contact info box
    const contactY = mainY;
    const contactHeight = 15;
    doc.setFillColor('#111827');
    doc.roundedRect(mainContentX, contactY - 5, mainContentWidth, contactHeight, 2, 2, 'F');
    
    // Add contact info text
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(9);
    contactInfo.forEach((info, index) => {
        const x = mainContentX + 5 + (index * (mainContentWidth / 3));
        doc.text(info, x, contactY + 3);
    });
    mainY = contactY + contactHeight + 5;

    // About section
    if (data.about && data.about.description) {
        doc.setTextColor('#000000');
        mainY = addMainText(data.about.description, mainY, 10);
        mainY += 10;
    }

    // Skills Section
    sidebarY = addSidebarSectionTitle('TECHNICAL SKILLS', sidebarY);
    if (data.resume.technicalSkills) {
        data.resume.technicalSkills.forEach(skill => {
            const cleanedSkill = skill.name.replace(/\s*\([^)]*\)/g, '').trim();
            sidebarY = addSidebarText(cleanedSkill, sidebarY, 9);
        });
    }
    sidebarY += 5;
    sidebarY = addSidebarSectionTitle('SOFT SKILLS', sidebarY);
    if (data.resume.softSkills) {
        data.resume.softSkills.forEach(skill => {
            const cleanedSkill = skill.name.replace(/\s*\([^)]*\)/g, '').trim();
            sidebarY = addSidebarText(cleanedSkill, sidebarY, 9);
        });
    }
    sidebarY += 5;

    // Work Experience
    mainY = addMainSectionTitle('WORK EXPERIENCE', mainY);
    if (data.resume.experience) {
        data.resume.experience.forEach(job => {
            mainY = addMainText(job.title, mainY, 12, 'bold');
            mainY = addMainText(job.company, mainY, 11, 'normal');
            doc.setTextColor('#808080'); // Gray for dates
            mainY = addMainText(job.period, mainY, 10, 'italic');
            doc.setTextColor('#000000'); // Reset to black
            if (job.description) {
                mainY = addMainText(job.description, mainY, 10, 'normal', false, 5);
            }
            mainY += 5;
        });
    }

    // Education
    mainY = addMainSectionTitle('EDUCATION', mainY);
    if (data.resume.education) {
        data.resume.education.forEach(edu => {
            mainY = addMainText(edu.degree, mainY, 12, 'bold');
            mainY = addMainText(edu.institution, mainY, 11);
            doc.setTextColor('#808080'); // Gray for dates
            mainY = addMainText(edu.period, mainY, 10, 'italic');
            doc.setTextColor('#000000'); // Reset to black
            mainY += 5;
        });
    }

    // Certifications
    mainY = addMainSectionTitle('CONFERENCES & COURSES', mainY);
    if (data.resume.certifications) {
        data.resume.certifications.forEach(category => {
            if (category.items) {
                category.items.forEach(cert => {
                    mainY = addMainText(`• ${cert}`, mainY, 10, 'normal', false, 5);
                });
            }
        });
    }

    console.log('Generated PDF with hex colors');

    try {
        doc.save('Asad_Al_Badi_CV.pdf');
        console.log('PDF saved.');
    } catch (e) {
        console.error('Error saving PDF:', e);
        alert('Could not save the PDF.');
    }
}