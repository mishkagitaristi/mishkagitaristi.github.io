export type Theme = 'dark' | 'light';

export type Language = 'en' | 'ka';

export interface TimelineNode {
  id: string;
  yearKey: string;
  titleKey: string;
  descriptionKey: string;
}

export interface ExperienceItem {
  id: string;
  companyKey: string;
  roleKey: string;
  periodKey: string;
  responsibilityKeys: string[];
}

export interface SkillItem {
  id: string;
  nameKey: string;
  descriptionKey: string;
}

export interface SkillGroup {
  id: string;
  titleKey: string;
  skills: SkillItem[];
}

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  detailsKey: string;
  tags: string[];
  images: string[];
}

export interface ExpertiseItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
}

export interface StatItem {
  id: string;
  value: number;
  labelKey: string;
  suffix?: string;
}

export const PERSON = {
  name: 'Mikheil Mamniashvili',
  title: 'Senior Frontend Engineer',
  email: 'mishikomamniashvili@gmail.com',
  phone: '+995 598 114 304',
  linkedin: 'https://www.linkedin.com/in/mikheil-mamniashvili/',
  github: 'https://github.com/mishkagitaristi',
  location: 'Tbilisi, Georgia',
} as const;

export const CAREER_TIMELINE: TimelineNode[] = [
  {
    id: 'education',
    yearKey: 'about.timeline.education.year',
    titleKey: 'about.timeline.education.title',
    descriptionKey: 'about.timeline.education.description',
  },
  {
    id: 'early-career',
    yearKey: 'about.timeline.earlyCareer.year',
    titleKey: 'about.timeline.earlyCareer.title',
    descriptionKey: 'about.timeline.earlyCareer.description',
  },
  {
    id: 'syionec',
    yearKey: 'about.timeline.syionec.year',
    titleKey: 'about.timeline.syionec.title',
    descriptionKey: 'about.timeline.syionec.description',
  },
  {
    id: 'present',
    yearKey: 'about.timeline.present.year',
    titleKey: 'about.timeline.present.title',
    descriptionKey: 'about.timeline.present.description',
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'syionec',
    companyKey: 'experience.syionec.company',
    roleKey: 'experience.syionec.role',
    periodKey: 'experience.syionec.period',
    responsibilityKeys: [
      'experience.syionec.items.angular',
      'experience.syionec.items.enterprise',
      'experience.syionec.items.architecture',
      'experience.syionec.items.api',
      'experience.syionec.items.workflows',
      'experience.syionec.items.modern',
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend',
    titleKey: 'skills.frontend.title',
    skills: [
      { id: 'angular', nameKey: 'skills.frontend.angular', descriptionKey: 'skills.descriptions.angular' },
      { id: 'typescript', nameKey: 'skills.frontend.typescript', descriptionKey: 'skills.descriptions.typescript' },
      { id: 'rxjs', nameKey: 'skills.frontend.rxjs', descriptionKey: 'skills.descriptions.rxjs' },
      { id: 'javascript', nameKey: 'skills.frontend.javascript', descriptionKey: 'skills.descriptions.javascript' },
      { id: 'html', nameKey: 'skills.frontend.html', descriptionKey: 'skills.descriptions.html' },
      { id: 'css', nameKey: 'skills.frontend.css', descriptionKey: 'skills.descriptions.css' },
      { id: 'scss', nameKey: 'skills.frontend.scss', descriptionKey: 'skills.descriptions.scss' },
    ],
  },
  {
    id: 'architecture',
    titleKey: 'skills.architecture.title',
    skills: [
      { id: 'state', nameKey: 'skills.architecture.state', descriptionKey: 'skills.descriptions.state' },
      { id: 'rest', nameKey: 'skills.architecture.rest', descriptionKey: 'skills.descriptions.rest' },
      { id: 'modular', nameKey: 'skills.architecture.modular', descriptionKey: 'skills.descriptions.modular' },
      { id: 'performance', nameKey: 'skills.architecture.performance', descriptionKey: 'skills.descriptions.performance' },
    ],
  },
  {
    id: 'tools',
    titleKey: 'skills.tools.title',
    skills: [
      { id: 'git', nameKey: 'skills.tools.git', descriptionKey: 'skills.descriptions.git' },
      { id: 'github', nameKey: 'skills.tools.github', descriptionKey: 'skills.descriptions.github' },
      { id: 'cicd', nameKey: 'skills.tools.cicd', descriptionKey: 'skills.descriptions.cicd' },
      { id: 'agile', nameKey: 'skills.tools.agile', descriptionKey: 'skills.descriptions.agile' },
    ],
  },
  {
    id: 'ai',
    titleKey: 'skills.ai.title',
    skills: [
      { id: 'figma', nameKey: 'skills.ai.figma', descriptionKey: 'skills.descriptions.figma' },
      { id: 'ai-agents', nameKey: 'skills.ai.aiAgents', descriptionKey: 'skills.descriptions.aiAgents' },
      { id: 'prompting', nameKey: 'skills.ai.prompting', descriptionKey: 'skills.descriptions.prompting' },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'fintech',
    titleKey: 'projects.fintech.title',
    descriptionKey: 'projects.fintech.description',
    detailsKey: 'projects.fintech.details',
    tags: ['Angular', 'TypeScript', 'RxJS', 'SCSS'],
    images: [
      'assets/images/projects/fintech-1.svg',
      'assets/images/projects/fintech-2.svg',
    ],
  },
  {
    id: 'enterprise',
    titleKey: 'projects.enterprise.title',
    descriptionKey: 'projects.enterprise.description',
    detailsKey: 'projects.enterprise.details',
    tags: ['Angular', 'REST API', 'NgRx', 'Enterprise'],
    images: [
      'assets/images/projects/enterprise-1.svg',
      'assets/images/projects/enterprise-2.svg',
    ],
  },
  {
    id: 'construction',
    titleKey: 'projects.construction.title',
    descriptionKey: 'projects.construction.description',
    detailsKey: 'projects.construction.details',
    tags: ['Angular', 'TypeScript', 'Maps', 'Real-time'],
    images: [
      'assets/images/projects/construction-1.svg',
      'assets/images/projects/construction-2.svg',
    ],
  },
  {
    id: 'monitoring',
    titleKey: 'projects.monitoring.title',
    descriptionKey: 'projects.monitoring.description',
    detailsKey: 'projects.monitoring.details',
    tags: ['Angular', 'WebSockets', 'Charts', 'Dashboard'],
    images: [
      'assets/images/projects/monitoring-1.svg',
      'assets/images/projects/monitoring-2.svg',
    ],
  },
];

export const EXPERTISE: ExpertiseItem[] = [
  {
    id: 'architecture',
    titleKey: 'expertise.items.architecture.title',
    descriptionKey: 'expertise.items.architecture.description',
    icon: 'architecture',
  },
  {
    id: 'angular',
    titleKey: 'expertise.items.angular.title',
    descriptionKey: 'expertise.items.angular.description',
    icon: 'angular',
  },
  {
    id: 'enterprise',
    titleKey: 'expertise.items.enterprise.title',
    descriptionKey: 'expertise.items.enterprise.description',
    icon: 'enterprise',
  },
  {
    id: 'performance',
    titleKey: 'expertise.items.performance.title',
    descriptionKey: 'expertise.items.performance.description',
    icon: 'performance',
  },
  {
    id: 'api',
    titleKey: 'expertise.items.api.title',
    descriptionKey: 'expertise.items.api.description',
    icon: 'api',
  },
  {
    id: 'uiux',
    titleKey: 'expertise.items.uiux.title',
    descriptionKey: 'expertise.items.uiux.description',
    icon: 'uiux',
  },
  {
    id: 'markup',
    titleKey: 'expertise.items.markup.title',
    descriptionKey: 'expertise.items.markup.description',
    icon: 'markup',
  },
  {
    id: 'problem-solving',
    titleKey: 'expertise.items.problemSolving.title',
    descriptionKey: 'expertise.items.problemSolving.description',
    icon: 'problem-solving',
  },
];

export const STATS: StatItem[] = [
  { id: 'years', value: 5, labelKey: 'stats.years' },
  { id: 'projects', value: 20, labelKey: 'stats.projects', suffix: '+' },
  { id: 'technologies', value: 15, labelKey: 'stats.technologies', suffix: '+' },
  { id: 'industries', value: 4, labelKey: 'stats.industries' },
];

export const NAV_ITEMS = [
  { id: 'home', labelKey: 'nav.home', route: '/', fragment: undefined },
  { id: 'about', labelKey: 'nav.about', route: '/', fragment: 'about' },
  { id: 'experience', labelKey: 'nav.experience', route: '/', fragment: 'experience' },
  { id: 'skills', labelKey: 'nav.skills', route: '/', fragment: 'skills' },
  { id: 'projects', labelKey: 'nav.projects', route: '/', fragment: 'projects' },
  { id: 'contact', labelKey: 'nav.contact', route: '/contact', fragment: undefined },
] as const;

export const ABOUT_HIGHLIGHTS = [
  'about.highlights.developer',
  'about.highlights.angular',
  'about.highlights.typescript',
  'about.highlights.enterprise',
  'about.highlights.fintech',
  'about.highlights.gambling',
  'about.highlights.construction',
  'about.highlights.challenges',
  'about.highlights.innovation',
  'about.highlights.location',
  'about.highlights.remote',
] as const;
