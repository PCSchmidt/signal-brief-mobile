import { Paper, TopicOption } from '../types';

export const TOPIC_OPTIONS: TopicOption[] = [
  { key: 'llms', label: 'LLMs' },
  { key: 'agents', label: 'Agents' },
  { key: 'rag', label: 'RAG' },
  { key: 'vision', label: 'Vision' },
  { key: 'evaluation', label: 'Evaluation' },
  { key: 'optimization', label: 'Optimization' },
  { key: 'reasoning', label: 'Reasoning' },
  { key: 'robotics', label: 'Robotics' },
  { key: 'multimodal', label: 'Multimodal' },
  { key: 'safety', label: 'Safety' },
  { key: 'inference', label: 'Inference' },
  { key: 'fine-tuning', label: 'Fine-tuning' },
];

export const MOCK_PAPERS: Paper[] = [
  {
    abstractExcerpt:
      'We study adaptive inference policies for large language models under latency constraints and show that selective deliberation can improve workload efficiency on heterogeneous request mixes.',
    arxivUrl: 'https://arxiv.org/abs/2505.01321',
    authors: 'J. Patel, R. Kim, L. Torres',
    id: 'paper-1',
    publishedAt: 'May 13, 2026',
    score: 96,
    summaryBullets: [
      'Introduces a routing policy that only triggers slower reasoning passes for harder prompts.',
      'Reports lower average latency while preserving most benchmark accuracy on mixed workloads.',
      'Highlights an operational tradeoff between routing confidence and tail latency.',
    ],
    tags: ['llms', 'inference', 'optimization'],
    title: 'Selective Deliberation for Low-Latency Language Model Routing',
    whyItMatters: [
      'Useful if you care about production-style model serving decisions rather than leaderboard-only gains.',
      'Makes the cost-versus-quality question explicit instead of treating all prompts the same.',
    ],
  },
  {
    abstractExcerpt:
      'Current RAG evaluation often entangles retrieval and generation. We propose grounded benchmarks and analysis methods to separate these error sources for more actionable system improvement.',
    arxivUrl: 'https://arxiv.org/abs/2505.01008',
    authors: 'M. Evans, S. Roy, D. Chan',
    id: 'paper-2',
    publishedAt: 'May 12, 2026',
    score: 92,
    summaryBullets: [
      'Builds evaluation sets that isolate retrieval quality from downstream generation quality.',
      'Shows how common RAG metrics hide failure modes when context is partially relevant.',
      'Provides a clearer template for regression testing retrieval changes.',
    ],
    tags: ['rag', 'evaluation', 'llms'],
    title: 'Grounded Evaluation Sets for Retrieval-Augmented Generation Systems',
    whyItMatters: [
      'Valuable if you want evaluation setups that say more than a single end-to-end score.',
      'Useful for teams trying to decide whether to improve retrieval, prompting, or ranking first.',
    ],
  },
  {
    abstractExcerpt:
      'Automated judges are increasingly used to score technical summaries. We analyze calibration gaps, inter-judge disagreement, and practical strategies for improving trust in evaluation pipelines.',
    arxivUrl: 'https://arxiv.org/abs/2505.00877',
    authors: 'A. Singh, T. Wu',
    id: 'paper-3',
    publishedAt: 'May 11, 2026',
    score: 90,
    summaryBullets: [
      'Studies how automated judges rate summary quality across technical domains.',
      'Finds that judge-model confidence often exceeds actual consistency on nuanced factual checks.',
      'Suggests a hybrid review pattern combining model critique with lightweight human spot checks.',
    ],
    tags: ['evaluation', 'llms', 'reasoning'],
    title: 'Calibrating Automated Judges for Research Paper Summaries',
    whyItMatters: [
      'Directly relevant to any app that summarizes technical content and needs a defensible quality bar.',
      'Makes evaluation feel like a product problem, not just a prompt problem.',
    ],
  },
  {
    abstractExcerpt:
      'We introduce a compressed memory representation for multimodal agents that preserves high-value context while reducing prompt growth over long task trajectories.',
    arxivUrl: 'https://arxiv.org/abs/2505.00731',
    authors: 'C. Lopez, Y. Zhang, K. Nair',
    id: 'paper-4',
    publishedAt: 'May 10, 2026',
    score: 88,
    summaryBullets: [
      'Presents a memory compression method for long-running agent workflows with images and text.',
      'Keeps retrieval quality stable while shrinking context footprint across task horizons.',
      'Frames memory management as a systems problem instead of a prompt-length problem.',
    ],
    tags: ['agents', 'multimodal', 'optimization'],
    title: 'Multimodal Memory Compression for Agentic Workflows',
    whyItMatters: [
      'Interesting if you care about practical agent orchestration rather than one-shot demos.',
      'Points toward cost control for multimodal workflows.',
    ],
  },
  {
    abstractExcerpt:
      'Scientific diagrams remain a weak point for many vision-language models. We propose a pretraining recipe that improves representation quality on sparse, labeled, and compositional technical figures.',
    arxivUrl: 'https://arxiv.org/abs/2505.00492',
    authors: 'R. Hale, N. Brooke, P. Iyer',
    id: 'paper-5',
    publishedAt: 'May 9, 2026',
    score: 85,
    summaryBullets: [
      'Focuses on understanding sparse scientific figures, not everyday natural images.',
      'Improves reasoning on labeled diagrams by mixing structured annotations into pretraining.',
      'Shows gains on chart and schematic interpretation benchmarks.',
    ],
    tags: ['vision', 'multimodal', 'reasoning'],
    title: 'Vision-Language Pretraining with Sparse Scientific Diagrams',
    whyItMatters: [
      'Useful if you want to track work that bridges perception and technical document understanding.',
      'Feels closer to real technical workflows than generic image captioning.',
    ],
  },
  {
    abstractExcerpt:
      'We study constrained fine-tuning strategies for improving safety behavior in language models when compute, labeling, and deployment budgets are limited.',
    arxivUrl: 'https://arxiv.org/abs/2505.00214',
    authors: 'H. Farah, E. Monroe',
    id: 'paper-6',
    publishedAt: 'May 8, 2026',
    score: 82,
    summaryBullets: [
      'Examines how smaller teams can tune safer model behavior without full-scale retraining budgets.',
      'Compares lightweight alignment strategies under realistic compute limits.',
      'Argues for narrower, domain-specific safety targets over generic tuning goals.',
    ],
    tags: ['safety', 'fine-tuning', 'llms'],
    title: 'Safety-Focused Fine-Tuning Under Resource Constraints',
    whyItMatters: [
      'Useful for applied teams that need practical safety work, not only frontier-scale methods.',
      'Shows how resource constraints reshape what responsible tuning actually looks like.',
    ],
  },
];