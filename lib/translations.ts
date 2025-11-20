export const translations = {
  en: {
    // Navbar
    projects: 'projects',
    blog: 'blog',
    whoami: 'whoami',

    // Homepage
    heroTitle: 'Daniel Litwin',
    heroTagline: 'Security engineer focused on automation, infrastructure, and breaking things ethically.',
    heroBio: 'Self-taught pentester with a background in 3D printing automation and motion capture. Currently building homelab setups, solving HackTheBox challenges, and pivoting into cybersecurity full-time.',

    // Sections
    sectionProjects: 'Projects',
    sectionWriting: 'Writing',
    viewAll: 'View all',

    // Projects page
    projectsTitle: 'Projects',
    projectsSubtitle: 'Case studies and technical explorations',

    // Blog page
    blogTitle: 'Writing',
    blogSubtitle: 'Technical insights, tutorials, and lessons learned',

    // Writeups page
    writeupsTitle: 'Writeups',
    writeupsSubtitle: 'HackTheBox, TryHackMe, and CTF solutions',

    // Whoami page
    whoamiTitle: '$ whoami',
    whoamiSubtitle: 'Daniel Litwin / Security Engineer',
    whoamiBio: 'Bio',
    whoamiSkills: 'Skills',
    whoamiBackground: 'Background',
    whoamiLinks: 'Links',
    skillsSecurity: 'Security',
    skillsInfra: 'Infrastructure',
    securityPentest: 'Penetration Testing',
    securityWebApp: 'Web Application Security',
    securityCTF: 'CTF Challenges',
    infraProxmox: 'Proxmox / Docker',
    infraLinux: 'Linux Administration',
    infraAutomation: 'Automation',
    bgPolishUniversity: 'Silesian University of Technology',
    bgTelecom: 'Telecommunications',
    bg3DPrinting: '3D Printing Automation',
    bg3DPrintingDesc: 'First automated quotation system in Poland',
    bgMotionCap: 'Motion Capture & 3D Graphics',
    bgMotionCapDesc: 'Previous industry experience',

    // Footer
    footerCopyright: '© 2025 d@niel.technology',
  },
  pl: {
    // Navbar
    projects: 'projekty',
    blog: 'blog',
    whoami: 'whoami',

    // Homepage
    heroTitle: 'Daniel Litwin',
    heroTagline: 'Security engineer specjalizujący się w automatyzacji, infrastrukturze i etycznym łamaniu zabezpieczeń.',
    heroBio: 'Samouczek pentester z doświadczeniem w automatyzacji druku 3D i motion capture. Obecnie buduję homelab, rozwiązuję wyzwania HackTheBox i pełnoetatowo przechodzę do cybersecurity.',

    // Sections
    sectionProjects: 'Projekty',
    sectionWriting: 'Wpisy',
    viewAll: 'Zobacz wszystkie',

    // Projects page
    projectsTitle: 'Projekty',
    projectsSubtitle: 'Case studies i eksploracje techniczne',

    // Blog page
    blogTitle: 'Wpisy',
    blogSubtitle: 'Techniczne insights, tutoriale i wnioski',

    // Writeups page
    writeupsTitle: 'Writeups',
    writeupsSubtitle: 'Rozwiązania HackTheBox, TryHackMe i CTF',

    // Whoami page
    whoamiTitle: '$ whoami',
    whoamiSubtitle: 'Daniel Litwin / Security Engineer',
    whoamiBio: 'Bio',
    whoamiSkills: 'Umiejętności',
    whoamiBackground: 'Tło',
    whoamiLinks: 'Linki',
    skillsSecurity: 'Security',
    skillsInfra: 'Infrastruktura',
    securityPentest: 'Testy penetracyjne',
    securityWebApp: 'Bezpieczeństwo aplikacji web',
    securityCTF: 'Wyzwania CTF',
    infraProxmox: 'Proxmox / Docker',
    infraLinux: 'Administracja Linux',
    infraAutomation: 'Automatyzacja',
    bgPolishUniversity: 'Politechnika Śląska',
    bgTelecom: 'Teleinformatyka',
    bg3DPrinting: 'Automatyzacja druku 3D',
    bg3DPrintingDesc: 'Pierwsza automatyczna wyceniarka w Polsce',
    bgMotionCap: 'Motion Capture i grafika 3D',
    bgMotionCapDesc: 'Poprzednie doświadczenie branżowe',

    // Footer
    footerCopyright: '© 2025 d@niel.technology',
  },
};

export type Language = 'en' | 'pl';

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || translations.en[key];
}
