import type { ProfileData } from "@/types/profile"
import type { SiteSettings } from "@/types/site-settings"

export const generateWebsiteHTML = (data: ProfileData, settings?: Partial<SiteSettings>): string => {
    const applied = {
        fontFamily:
            settings?.fontFamily ||
            'ui-monospace, SFMono-Regular, Menlo, monospace',
        theme: settings?.theme || 'light',
        primaryColor: settings?.primaryColor || '#2563eb',
        backgroundColor: settings?.backgroundColor || (settings?.theme === 'dark' ? '#0d1117' : '#ffffff'),
        textColor: settings?.textColor || (settings?.theme === 'dark' ? '#d1d5db' : '#374151'),
        sectionTitles: {
            about: settings?.sectionTitles?.about || 'About',
            experience: settings?.sectionTitles?.experience || 'Work Experience',
            education: settings?.sectionTitles?.education || 'Education',
            skills: settings?.sectionTitles?.skills || 'Skills',
            projects: settings?.sectionTitles?.projects || 'Projects',
        },
    }
    const isDark = applied.theme === 'dark'
    const surface = isDark ? '#161b22' : '#ffffff'
    const border = isDark ? '#30363d' : '#e5e7eb'
    const subtle = isDark ? '#8b949e' : '#6b7280'
    const heading = isDark ? '#f1f5f9' : '#000000'
    const tagBg = isDark ? '#1f2937' : '#f3f4f6'
    const tagBorder = isDark ? '#30363d' : '#e5e7eb'
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Personal Website</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${applied.fontFamily};
            line-height: 1.6;
            color: #374151;
            background-color: ${applied.backgroundColor};
            font-size: 15px;
        }
        
        .container {
            min-height: 100vh;
        }
        
        /* Header */
        .header {
            border-bottom: 1px solid ${border};
            background-color: ${surface};
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .header-content {
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .header-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: ${heading};
        }
        
        .header-buttons {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .btn {
            padding: 0.375rem 0.875rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            text-decoration: none;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-minimal {
            color: ${applied.textColor};
            border-color: ${border};
            background-color: transparent;
        }
        
        .btn-minimal:hover {
            background-color: ${isDark ? '#1f2937' : '#f3f4f6'};
        }
        
        .btn-silver {
            color: ${applied.textColor};
            background-color: ${isDark ? '#1f2937' : '#f9fafb'};
            border-color: ${border};
        }
        
        .btn-silver:hover {
            background-color: ${isDark ? '#243041' : '#f3f4f6'};
        }
        
        /* Main Content */
        .main-content {
            max-width: 700px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
            line-height: 1.6;
        }
        
        /* Top Navigation */
        .top-nav {
            text-align: right;
            margin-bottom: 2rem;
        }
        
        .nav-links {
            font-size: 0.75rem;
            text-transform: uppercase;
            display: flex;
            gap: 1.5rem;
            justify-content: flex-end;
        }
        
        .nav-link {
            color: ${applied.primaryColor};
            text-decoration: underline;
            font-weight: normal;
        }
        
        .nav-link:hover {
            text-decoration: none;
        }
        
        /* Header Section */
        .profile-header {
            margin-bottom: 2rem;
        }
        
        .profile-name {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: ${heading};
        }
        
        .profile-summary {
            color: ${subtle};
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .profile-location {
            color: ${subtle};
            margin-bottom: 1rem;
        }
        
        /* Sections */
        .section {
            margin-bottom: 2rem;
        }
        
        .section-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: ${heading};
            margin-bottom: 1rem;
        }
        
        .section-content {
            color: ${subtle};
            line-height: 1.6;
        }
        
        /* Experience */
        .experience-item {
            margin-bottom: 1.5rem;
        }
        
        .experience-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .experience-title {
            font-weight: 600;
            color: ${heading};
            font-size: 1rem;
            margin-bottom: 0.25rem;
        }
        
        .experience-company {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: ${subtle};
            font-size: 0.9rem;
        }
        
        .experience-period {
            color: ${subtle};
            margin-left: 1rem;
            white-space: nowrap;
            text-align: right;
        }
        
        .experience-description {
            color: ${subtle};
            line-height: 1.6;
            margin-top: 0.5rem;
        }
        
        /* Education */
        .education-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .education-content h3 {
            font-weight: 600;
            color: ${heading};
            margin-bottom: 0.25rem;
        }
        
        .education-content p {
            color: ${subtle};
        }
        
        .education-period {
            color: ${subtle};
            margin-left: 1rem;
            white-space: nowrap;
        }
        
        /* Projects */
        .project-item {
            margin-bottom: 1.5rem;
        }
        
        .project-title {
            font-weight: 600;
            color: ${heading};
            margin-bottom: 0.25rem;
        }
        
        .project-description {
            color: ${subtle};
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }
        
        .project-technologies {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
        }
        
        .project-tech-tag {
            padding: 0.125rem 0.5rem;
            background-color: ${tagBg};
            color: ${applied.textColor};
            border: 1px solid ${tagBorder};
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .project-links {
            display: flex;
            gap: 1rem;
        }
        
        .project-link {
            color: ${applied.primaryColor};
            text-decoration: underline;
            font-size: 0.875rem;
        }
        
        .project-link:hover {
            text-decoration: none;
        }
        
        /* Skills */
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill-tag {
            padding: 0.25rem 0.75rem;
            background-color: ${tagBg};
            color: ${applied.textColor};
            border: 1px solid ${tagBorder};
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .main-content {
                padding: 1.5rem 1rem;
            }
            
            .header-content {
                padding: 0.75rem 1rem;
            }
            
            .header-title {
                font-size: 1rem;
            }
            
            .experience-header {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .experience-period {
                margin-left: 0;
                text-align: left;
            }
            
            .education-item {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .education-period {
                margin-left: 0;
            }
            
            .nav-links {
                flex-wrap: wrap;
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Navigation -->
            <div class="top-nav">
                <div class="nav-links">
                    ${data.email ? `<a href="mailto:${data.email}" class="nav-link">EMAIL</a>` : ''}
                    ${data.socialLinks.map(social => {
                        let url = social.url;
                        // Fix URL if it doesn't start with http/https
                        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                            url = 'https://' + url;
                        }
                        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="nav-link">${social.platform.toUpperCase()}</a>`;
                    }).join('')}
                </div>
            </div>

            <!-- Profile Header -->
            <div class="profile-header">
                <h1 class="profile-name">${data.name}</h1>
                ${data.location ? `<p class="profile-location">📍 ${data.location}</p>` : ''}
            </div>

            <!-- About Section -->
            <section class="section">
                <h2 class="section-title">${applied.sectionTitles.about}</h2>
                <div class="section-content">
                    <p>${data.summary || 'Professional with experience in technology and innovation. Passionate about creating impactful solutions and driving results.'}</p>
                </div>
            </section>

            <!-- Work Experience Section -->
            ${data.experience.length > 0 ? `
            <section class="section">
                <h2 class="section-title">${applied.sectionTitles.experience}</h2>
                <div class="section-content">
                    ${data.experience.map(exp => `
                    <div class="experience-item">
                        <div class="experience-header">
                            <div style="flex: 1;">
                                <h3 class="experience-title">${exp.position}</h3>
                                <div class="experience-company">
                                    <span>${exp.company}</span>
                                    <span>•</span>
                                    <span>Full-Time</span>
                                </div>
                            </div>
                            <div class="experience-period">
                                ${exp.startDate} - ${exp.endDate}
                            </div>
                        </div>
                        ${exp.description ? `<p class="experience-description">${exp.description}</p>` : ''}
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Education Section -->
            ${data.education.length > 0 ? `
            <section class="section">
                <h2 class="section-title">${applied.sectionTitles.education}</h2>
                <div class="section-content">
                    ${data.education.map(edu => `
                    <div class="education-item">
                        <div class="education-content">
                            <h3>${edu.institution}</h3>
                            <p>${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</p>
                        </div>
                        <span class="education-period">${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Projects Section -->
            ${data.projects.length > 0 ? `
            <section class="section">
                <h2 class="section-title">${applied.sectionTitles.projects}</h2>
                <div class="section-content">
                    ${data.projects.map(project => `
                    <div class="project-item">
                        <h3 class="project-title">${project.name}</h3>
                        <p class="project-description">${project.description}</p>
                        ${project.technologies.length > 0 ? `
                        <div class="project-technologies">
                            ${project.technologies.map(tech => `<span class="project-tech-tag">${tech}</span>`).join('')}
                        </div>
                        ` : ''}
                        <div class="project-links">
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link">GitHub</a>` : ''}
                            ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">Website</a>` : ''}
                        </div>
                    </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <!-- Skills Section -->
            ${data.skills.length > 0 ? `
            <section class="section">
                <h2 class="section-title">${applied.sectionTitles.skills}</h2>
                <div class="skills-container">
                    ${data.skills.slice(0, 10).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </section>
            ` : ''}

        </main>
    </div>

    <script>
        function downloadHTML() {
            const htmlContent = document.documentElement.outerHTML;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '${data.name.replace(/[^a-zA-Z0-9]/g, '_')}_portfolio.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>`;

  return html;
};
