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
  role: string;
  period: string;
  description: string;
}

export interface Skill {
  id: string;
  label: string;
  iconName: string | null;
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
