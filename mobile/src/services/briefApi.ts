import { API_BASE_URL } from '../config';
import { DailyBrief, Paper, SearchResults, TopicKey } from '../types';

type ApiPaper = {
  abstract_excerpt: string;
  arxiv_url: string;
  authors: string;
  id: string;
  published_at: string;
  rank: number;
  summary_bullets: string[];
  tags: string[];
  title: string;
  why_it_matters: string[];
};

type ApiDailyBrief = {
  digest_date: string;
  generated_at: string;
  papers: ApiPaper[];
  topics: string[];
};

type ApiSearchResults = {
  generated_at: string;
  papers: ApiPaper[];
  query: string;
  start_date: string | null;
  end_date: string | null;
};

const VALID_TOPICS: TopicKey[] = [
  'agents',
  'ai-systems',
  'benchmarks',
  'data-engineering',
  'deployment',
  'developer-tools',
  'evaluation',
  'fine-tuning',
  'governance',
  'inference',
  'llms',
  'model-serving',
  'multimodal',
  'optimization',
  'rag',
  'reasoning',
  'robotics',
  'safety',
  'synthetic-data',
  'vision',
];

export async function fetchTodayBrief(selectedTopics: TopicKey[]): Promise<DailyBrief> {
  const topicQuery = selectedTopics.map((topic) => `topics=${encodeURIComponent(topic)}`).join('&');
  const response = await fetch(`${API_BASE_URL}/brief/today?${topicQuery}`);

  if (!response.ok) {
    throw new Error(`Brief request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiDailyBrief;

  return {
    digestDate: payload.digest_date,
    generatedAt: payload.generated_at,
    papers: payload.papers.map(mapPaper),
    topics: payload.topics.filter(isTopicKey),
  };
}

export async function searchPapers(query: string, limit = 10): Promise<SearchResults> {
  const response = await fetch(
    `${API_BASE_URL}/papers/search?query=${encodeURIComponent(query)}&limit=${limit.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Search request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiSearchResults;

  return {
    endDate: payload.end_date,
    generatedAt: payload.generated_at,
    papers: payload.papers.map(mapPaper),
    query: payload.query,
    startDate: payload.start_date,
  };
}

function mapPaper(paper: ApiPaper): Paper {
  return {
    abstractExcerpt: paper.abstract_excerpt,
    arxivUrl: paper.arxiv_url,
    authors: paper.authors,
    id: paper.id,
    publishedAt: paper.published_at,
    rank: paper.rank,
    summaryBullets: paper.summary_bullets,
    tags: paper.tags.filter(isTopicKey),
    title: paper.title,
    whyItMatters: paper.why_it_matters,
  };
}

function isTopicKey(value: string): value is TopicKey {
  return VALID_TOPICS.includes(value as TopicKey);
}