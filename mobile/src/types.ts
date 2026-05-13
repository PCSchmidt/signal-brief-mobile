export type TopicKey =
  | 'agents'
  | 'evaluation'
  | 'fine-tuning'
  | 'inference'
  | 'llms'
  | 'multimodal'
  | 'optimization'
  | 'rag'
  | 'reasoning'
  | 'robotics'
  | 'safety'
  | 'vision';

export type TopicOption = {
  key: TopicKey;
  label: string;
};

export type Paper = {
  abstractExcerpt: string;
  arxivUrl: string;
  authors: string;
  id: string;
  publishedAt: string;
  rank: number;
  summaryBullets: string[];
  tags: TopicKey[];
  title: string;
  whyItMatters: string[];
};

export type DailyBrief = {
  digestDate: string;
  generatedAt: string;
  papers: Paper[];
  topics: TopicKey[];
};

export type RootStackParamList = {
  MainTabs: undefined;
  Onboarding: { mode?: 'edit' | 'setup' } | undefined;
  PaperDetail: { paperId: string };
};

export type MainTabParamList = {
  Brief: undefined;
  Saved: undefined;
  Settings: undefined;
};