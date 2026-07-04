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
  resultKey: string;
  tags: string[];
  images: string[];
}

export interface ServiceItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  deliverableKeys: string[];
  icon: string;
}

export interface ProcessStep {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

export interface TestimonialItem {
  id: string;
  quoteKey: string;
  authorKey: string;
  roleKey: string;
}

export interface StatItem {
  id: string;
  value: number;
  labelKey: string;
  suffix?: string;
}

export interface InterestItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
}
