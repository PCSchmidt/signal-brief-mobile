import { API_BASE_URL } from '../config';
import { DailyBrief, Paper, TopicKey } from '../types';

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

const VALID_TOPICS: TopicKey[] = [
  'agents',
  'evaluation',
  'fine-tuning',
  'inference',
  'llms',
  'multimodal',
  'optimization',
  'rag',
  'reasoning',
  'robotics',
  'safety',
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