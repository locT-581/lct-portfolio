export interface Project {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  shortDescription: string;
}

export interface ProjectMediaItem {
  type: string;
  url: string;
  caption?: string | null;
}

export interface ProjectDetail extends Project {
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  media: ProjectMediaItem[] | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  categoryTags: string[];
  contentType: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  companyUrl?: string | null;
  role: string;
  period: string;
  location?: string;
  description: string;
  descriptionRaw?: unknown;
}

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string | null;
  description?: string;
  descriptionRaw?: unknown;
}

export interface SkillCategory {
  id: string;
  name: string;
  groupType: "technical" | "soft_skills";
  displayType: "badges" | "bullet_list";
  description?: string | null;
  orderIndex: number;
  skills: SkillItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  iconImage?: { url: string; previewUrl?: string } | null;
  iconImageDark?: { url: string; previewUrl?: string } | null;
  iconName?: string | null;
  description?: string | null;
  isHighlight?: boolean;
  proficiencyLevel?: string | null;
  orderIndex: number;
}

export interface Skill {
  id: string;
  label: string;
  iconName: string | null;
  iconImage?: { url: string; previewUrl?: string } | null;
  iconImageDark?: { url: string; previewUrl?: string } | null;
  category?: string;
  description?: string | null;
  isHighlight?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  iconName: string | null;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
  iconName: string | null;
}

export interface SocialLinkItem {
  platform: string;
  url: string;
  icon?: string | null;
  label: string;
}

export interface ProfileIntro {
  avatarUrl: string;
  name: string;
  title: string;
  headline?: string;
  bio: string;
  bioRaw?: unknown;
  resumeUrl?: string | null;
}

export interface NewsletterSubscribePayload {
  email: string;
  locale: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
  locale: string;
  honeypot?: string;
}

export interface ApiErrorResponse {
  error: string;
  status: number;
}
