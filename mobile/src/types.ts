export type TopicKey =
  | 'agents'
  | 'ai-systems'
  | 'benchmarks'
  | 'data-engineering'
  | 'deployment'
  | 'developer-tools'
  | 'evaluation'
  | 'fine-tuning'
  | 'inference'
  | 'llms'
  | 'model-serving'
  | 'multimodal'
  | 'optimization'
  | 'rag'
  | 'reasoning'
  | 'robotics'
  | 'safety'
  | 'synthetic-data'
  | 'vision'
  | 'governance';

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

export type SearchResults = {
  generatedAt: string;
  papers: Paper[];
  query: string;
  startDate: string | null;
  endDate: string | null;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Onboarding: { mode?: 'edit' | 'setup' } | undefined;
  PaperDetail: { paperId: string };
};

export type MainTabParamList = {
  Search: undefined;
  Brief: undefined;
  Saved: undefined;
  Settings: undefined;
};