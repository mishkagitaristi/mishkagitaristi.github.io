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
  locationKey?: string;
  responsibilityKeys: string[];
}

export interface EducationItem {
  id: string;
  institutionKey: string;
  credentialKey: string;
  periodKey: string;
  descriptionKey?: string;
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
  display?: 'cards' | 'tags';
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
    id: 'education-gtu',
    yearKey: 'about.timeline.education.year',
    titleKey: 'about.timeline.education.title',
    descriptionKey: 'about.timeline.education.description',
  },
  {
    id: 'education-techub',
    yearKey: 'about.timeline.techub.year',
    titleKey: 'about.timeline.techub.title',
    descriptionKey: 'about.timeline.techub.description',
  },
  {
    id: 'singular',
    yearKey: 'about.timeline.singular.year',
    titleKey: 'about.timeline.singular.title',
    descriptionKey: 'about.timeline.singular.description',
  },
  {
    id: 'syniotec',
    yearKey: 'about.timeline.syniotec.year',
    titleKey: 'about.timeline.syniotec.title',
    descriptionKey: 'about.timeline.syniotec.description',
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'syniotec',
    companyKey: 'experience.syniotec.company',
    roleKey: 'experience.syniotec.role',
    periodKey: 'experience.syniotec.period',
    locationKey: 'experience.syniotec.location',
    responsibilityKeys: [
      'experience.syniotec.items.angular',
      'experience.syniotec.items.legacy',
      'experience.syniotec.items.storybook',
      'experience.syniotec.items.testing',
      'experience.syniotec.items.uiux',
      'experience.syniotec.items.planning',
      'experience.syniotec.items.mfe',
      'experience.syniotec.items.library',
      'experience.syniotec.items.collaboration',
      'experience.syniotec.items.reviews',
      'experience.syniotec.items.mentoring',
      'experience.syniotec.items.uml',
      'experience.syniotec.items.modern',
    ],
  },
  {
    id: 'singular',
    companyKey: 'experience.singular.company',
    roleKey: 'experience.singular.role',
    periodKey: 'experience.singular.period',
    locationKey: 'experience.singular.location',
    responsibilityKeys: [
      'experience.singular.items.sportsbook',
      'experience.singular.items.mobile',
      'experience.singular.items.mentoring',
      'experience.singular.items.reviews',
      'experience.singular.items.performance',
      'experience.singular.items.structure',
      'experience.singular.items.team',
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: 'gtu',
    institutionKey: 'education.gtu.institution',
    credentialKey: 'education.gtu.credential',
    periodKey: 'education.gtu.period',
    descriptionKey: 'education.gtu.description',
  },
  {
    id: 'techub',
    institutionKey: 'education.techub.institution',
    credentialKey: 'education.techub.credential',
    periodKey: 'education.techub.period',
    descriptionKey: 'education.techub.description',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'core',
    titleKey: 'skills.core.title',
    skills: [
      { id: 'angular', nameKey: 'skills.core.angular', descriptionKey: 'skills.descriptions.angular' },
      { id: 'ngrx', nameKey: 'skills.core.ngrx', descriptionKey: 'skills.descriptions.ngrx' },
      { id: 'signals', nameKey: 'skills.core.signals', descriptionKey: 'skills.descriptions.signals' },
      { id: 'rxjs', nameKey: 'skills.core.rxjs', descriptionKey: 'skills.descriptions.rxjs' },
      { id: 'typescript', nameKey: 'skills.core.typescript', descriptionKey: 'skills.descriptions.typescript' },
      { id: 'javascript', nameKey: 'skills.core.javascript', descriptionKey: 'skills.descriptions.javascript' },
      { id: 'jest', nameKey: 'skills.core.jest', descriptionKey: 'skills.descriptions.jest' },
      { id: 'jasmine', nameKey: 'skills.core.jasmine', descriptionKey: 'skills.descriptions.jasmine' },
      { id: 'cypress', nameKey: 'skills.core.cypress', descriptionKey: 'skills.descriptions.cypress' },
    ],
  },
  {
    id: 'uiux',
    titleKey: 'skills.uiux.title',
    skills: [
      { id: 'html', nameKey: 'skills.uiux.html', descriptionKey: 'skills.descriptions.html' },
      { id: 'css', nameKey: 'skills.uiux.css', descriptionKey: 'skills.descriptions.css' },
      { id: 'responsive', nameKey: 'skills.uiux.responsive', descriptionKey: 'skills.descriptions.responsive' },
      { id: 'tailwind', nameKey: 'skills.uiux.tailwind', descriptionKey: 'skills.descriptions.tailwind' },
      { id: 'bem', nameKey: 'skills.uiux.bem', descriptionKey: 'skills.descriptions.bem' },
      { id: 'figma', nameKey: 'skills.uiux.figma', descriptionKey: 'skills.descriptions.figma' },
      { id: 'adobe-xd', nameKey: 'skills.uiux.adobeXd', descriptionKey: 'skills.descriptions.adobeXd' },
      { id: 'material', nameKey: 'skills.uiux.material', descriptionKey: 'skills.descriptions.material' },
      { id: 'storybook', nameKey: 'skills.uiux.storybook', descriptionKey: 'skills.descriptions.storybook' },
    ],
  },
  {
    id: 'architecture',
    titleKey: 'skills.architecture.title',
    skills: [
      { id: 'mfe', nameKey: 'skills.architecture.mfe', descriptionKey: 'skills.descriptions.mfe' },
      { id: 'oop', nameKey: 'skills.architecture.oop', descriptionKey: 'skills.descriptions.oop' },
      { id: 'solid', nameKey: 'skills.architecture.solid', descriptionKey: 'skills.descriptions.solid' },
      { id: 'kiss', nameKey: 'skills.architecture.kiss', descriptionKey: 'skills.descriptions.kiss' },
      { id: 'state', nameKey: 'skills.architecture.state', descriptionKey: 'skills.descriptions.state' },
      { id: 'performance', nameKey: 'skills.architecture.performance', descriptionKey: 'skills.descriptions.performance' },
    ],
  },
  {
    id: 'tools',
    titleKey: 'skills.tools.title',
    skills: [
      { id: 'webpack', nameKey: 'skills.tools.webpack', descriptionKey: 'skills.descriptions.webpack' },
      { id: 'vite', nameKey: 'skills.tools.vite', descriptionKey: 'skills.descriptions.vite' },
      { id: 'rest', nameKey: 'skills.tools.rest', descriptionKey: 'skills.descriptions.rest' },
      { id: 'git', nameKey: 'skills.tools.git', descriptionKey: 'skills.descriptions.git' },
      { id: 'cicd', nameKey: 'skills.tools.cicd', descriptionKey: 'skills.descriptions.cicd' },
      { id: 'postman', nameKey: 'skills.tools.postman', descriptionKey: 'skills.descriptions.postman' },
      { id: 'eslint', nameKey: 'skills.tools.eslint', descriptionKey: 'skills.descriptions.eslint' },
      { id: 'sonarqube', nameKey: 'skills.tools.sonarqube', descriptionKey: 'skills.descriptions.sonarqube' },
      { id: 'agile', nameKey: 'skills.tools.agile', descriptionKey: 'skills.descriptions.agile' },
      { id: 'jira', nameKey: 'skills.tools.jira', descriptionKey: 'skills.descriptions.jira' },
      { id: 'notion', nameKey: 'skills.tools.notion', descriptionKey: 'skills.descriptions.notion' },
      { id: 'slack', nameKey: 'skills.tools.slack', descriptionKey: 'skills.descriptions.slack' },
    ],
  },
  {
    id: 'softSkills',
    titleKey: 'skills.softSkills.title',
    display: 'tags',
    skills: [
      { id: 'communication', nameKey: 'skills.softSkills.communication', descriptionKey: 'skills.softSkills.communication' },
      { id: 'empathy', nameKey: 'skills.softSkills.empathy', descriptionKey: 'skills.softSkills.empathy' },
      { id: 'ownership', nameKey: 'skills.softSkills.ownership', descriptionKey: 'skills.softSkills.ownership' },
      { id: 'problemSolving', nameKey: 'skills.softSkills.problemSolving', descriptionKey: 'skills.softSkills.problemSolving' },
      { id: 'criticalThinking', nameKey: 'skills.softSkills.criticalThinking', descriptionKey: 'skills.softSkills.criticalThinking' },
      { id: 'mentoring', nameKey: 'skills.softSkills.mentoring', descriptionKey: 'skills.softSkills.mentoring' },
      { id: 'independence', nameKey: 'skills.softSkills.independence', descriptionKey: 'skills.softSkills.independence' },
      { id: 'learning', nameKey: 'skills.softSkills.learning', descriptionKey: 'skills.softSkills.learning' },
    ],
  },
  {
    id: 'languages',
    titleKey: 'skills.languages.title',
    display: 'tags',
    skills: [
      { id: 'english', nameKey: 'skills.languages.english', descriptionKey: 'skills.languages.english' },
      { id: 'georgian', nameKey: 'skills.languages.georgian', descriptionKey: 'skills.languages.georgian' },
      { id: 'russian', nameKey: 'skills.languages.russian', descriptionKey: 'skills.languages.russian' },
    ],
  },
  {
    id: 'ai',
    titleKey: 'skills.ai.title',
    skills: [
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
  { id: 'years', value: 6, labelKey: 'stats.years', suffix: '+' },
  { id: 'projects', value: 10, labelKey: 'stats.projects', suffix: '+' },
  { id: 'technologies', value: 20, labelKey: 'stats.technologies', suffix: '+' },
  { id: 'industries', value: 4, labelKey: 'stats.industries' },
];

export const NAV_ITEMS = [
  { id: 'home', labelKey: 'nav.home', route: '/', fragment: undefined },
  { id: 'about', labelKey: 'nav.about', route: '/', fragment: 'about' },
  { id: 'experience', labelKey: 'nav.experience', route: '/', fragment: 'experience' },
  { id: 'education', labelKey: 'nav.education', route: '/', fragment: 'education' },
  { id: 'skills', labelKey: 'nav.skills', route: '/', fragment: 'skills' },
  { id: 'projects', labelKey: 'nav.projects', route: '/', fragment: 'projects' },
  { id: 'contact', labelKey: 'nav.contact', route: '/contact', fragment: undefined },
] as const;
