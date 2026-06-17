export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: any;
  githubUrl: string;
  liveUrl?: string;
  isUploaded?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  image: any;
  pdfUrl: string;
  isUploaded?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Ionicons names
  features: string[];
}

export const portfolioData = {
  profile: {
    name: 'Arvin F. Catalbas',
    title: 'Network/IT Product Associate & Web Developer',
    avatar: require('../../assets/images/profile_avatar.png'),
    bio: 'Detail-oriented Information Technology graduate with a strong foundation in network infrastructure, device configuration, and software development. Seeking an entry-level IT role (such as Network Support Associate, Systems Administrator, or Junior Developer) to leverage technical diagnostics, networking, and front-end development competencies.',
    location: 'Sorsogon, Philippines',
    email: 'arvin9999990@gmail.com',
    phone: '09773105952',
    facebook: 'https://facebook.com/senemorph',
    github: 'https://github.com/arvincatalbas',
    instagram: 'https://instagram.com/ar.vinnn09',
    linkedin: 'https://linkedin.com/in/arvincatalbas',
    twitter: 'https://twitter.com/arvincatalbas',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    stats: [
      { label: 'Certifications', value: '9+' },
      { label: 'Technical Skills', value: '12+' },
      { label: 'IT Projects', value: '4+' },
    ]
  },
  services: [
    {
      id: '1',
      title: 'Networking & IT Infrastructure',
      description: 'Hands-on network deployment including local area networks (LAN), IP addressing, network cabling, CCTV camera installation, and router configuration.',
      icon: 'smartphone',
      features: ['LAN Cabling & Termination', 'Cisco Router Configuration', 'CCTV Camera Setup', 'Network Troubleshooting'],
    },
    {
      id: '2',
      title: 'Front-End Development',
      description: 'Creating responsive, clean web interfaces using HTML5, CSS3, and JavaScript, with experience in Python and basic SQL (MySQL/PostgreSQL).',
      icon: 'globe',
      features: ['Responsive UI Layouts', 'JavaScript Interactivity', 'Git/GitHub Version Control', 'Basic Database Queries'],
    },
    {
      id: '3',
      title: 'System Administration & OS Support',
      description: 'Installing and configuring operating systems (Windows 10/11, Linux), using the CLI (command line), and resolving software/hardware diagnostics.',
      icon: 'color-wand',
      features: ['OS Installation & Config', 'Linux Command Line Basics', 'System Diagnostics', 'Technical Documentation'],
    },
    {
      id: '4',
      title: 'Hardware & Electrical Maintenance',
      description: 'NCII Certified in Electrical Installation & Maintenance (EIM NCII), specializing in circuit wiring, hardware assembly/disassembly, and preventative maintenance.',
      icon: 'chatbubbles',
      features: ['Electrical Wiring Installation', 'Hardware Assembly/Disassembly', 'Preventive Maintenance', 'Safety Compliance (NCII)'],
    }
  ] as Service[],
  projects: [
    {
      id: '1',
      title: 'Structural IT Costing & Inventory System',
      description: 'An internship project designed to track commercial IT procurement, automate structural costing analysis, sort product inventory, and generate brochures for technical clients.',
      techStack: ['Python', 'SQL', 'Git/GitHub', 'Technical Documentation'],
      image: require('../../assets/images/project_web.png'), // Reuse generated web dashboard mockup
      githubUrl: 'https://github.com/arvincatalbas/it-costing-system',
    },
    {
      id: '2',
      title: 'Enterprise LAN & CCTV Infrastructure',
      description: 'Real-world deployment of local area networks, IP addressing, and CCTV security configuration during internship training, including structural diagram costing.',
      techStack: ['Cisco Packet Tracer', 'TCP/IP Networking', 'Hardware Configuration', 'CCTV Setup'],
      image: require('../../assets/images/project_mobile.png'), // Reuse generated mobile/network mockup
      githubUrl: 'https://github.com/arvincatalbas/lan-cctv-infrastructure',
    },
    {
      id: '3',
      title: 'React Native & Expo Router Portfolio',
      description: 'This current premium portfolio application, showing mastery of file-based routing in Expo Router, TypeScript, and React Native Web interface development.',
      techStack: ['React Native', 'Expo Router', 'TypeScript', 'Responsive Styles'],
      image: require('../../assets/images/project_web.png'), // Show layout preview
      githubUrl: 'https://github.com/arvincatalbas/my-portfolio',
    }
  ] as Project[],
  certificates: [
    {
      id: '1',
      title: 'Electrical Installation & Maintenance NCII',
      issuer: 'TESDA / Sorsogon State University',
      issueDate: 'Certified',
      image: require('../../assets/images/certificate_eim.png'),
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: '2',
      title: 'JavaScript Essentials 1',
      issuer: 'Cisco Networking Academy',
      issueDate: 'Certified',
      image: require('../../assets/images/certificate_js.png'),
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: '3',
      title: 'Networking Basics & Cisco Packet Tracer',
      issuer: 'Cisco Networking Academy',
      issueDate: 'Certified',
      image: require('../../assets/images/certificate_networking.png'),
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    }
  ] as Certificate[],
};
