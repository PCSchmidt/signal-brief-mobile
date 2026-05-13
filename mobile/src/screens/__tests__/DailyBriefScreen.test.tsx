import { fireEvent, render, screen } from '@testing-library/react-native';

import { DailyBriefScreen } from '../DailyBriefScreen';
import { Paper } from '../../types';

const PAPER_FIXTURE: Paper = {
  abstractExcerpt: 'A paper about routing language model workloads.',
  arxivUrl: 'https://arxiv.org/abs/2505.00001',
  authors: 'A. Researcher, B. Engineer',
  id: '2505.00001v1',
  publishedAt: '2026-05-13',
  rank: 1,
  summaryBullets: [
    'Introduces a routing policy for mixed request difficulty.',
    'Improves average latency under fixed compute.',
    'Makes serving tradeoffs more explicit.',
  ],
  tags: ['llms', 'inference', 'optimization'],
  title: 'Low-Latency Language Model Routing for Production Inference',
  whyItMatters: ['Useful for teams balancing speed and quality in serving.'],
};

describe('DailyBriefScreen', () => {
  it('renders live brief papers and selected topics', () => {
    render(
      <DailyBriefScreen
        digestDateLabel="May 13"
        errorMessage={null}
        isLoading={false}
        onOpenPaper={jest.fn()}
        onRefresh={jest.fn()}
        onToggleSave={jest.fn()}
        papers={[PAPER_FIXTURE]}
        savedPaperIds={[]}
        selectedTopics={['llms', 'evaluation', 'inference']}
      />
    );

    expect(screen.getByText('Low-Latency Language Model Routing for Production Inference')).toBeTruthy();
    expect(screen.getAllByText('LLMS')).toHaveLength(2);
    expect(screen.getByText('EVALUATION')).toBeTruthy();
    expect(screen.getAllByText('INFERENCE')).toHaveLength(2);
  });

  it('renders the digest error state and retries on demand', () => {
    const onRefresh = jest.fn();

    render(
      <DailyBriefScreen
        digestDateLabel="May 13"
        errorMessage="Backend unavailable"
        isLoading={false}
        onOpenPaper={jest.fn()}
        onRefresh={onRefresh}
        onToggleSave={jest.fn()}
        papers={[]}
        savedPaperIds={[]}
        selectedTopics={['llms', 'evaluation', 'inference']}
      />
    );

    fireEvent.press(screen.getByText('Retry'));

    expect(screen.getByText('We couldn\'t load today\'s brief.')).toBeTruthy();
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renders the digest-not-ready state with a refresh action', () => {
    const onRefresh = jest.fn();

    render(
      <DailyBriefScreen
        digestDateLabel="May 13"
        errorMessage={null}
        isLoading={false}
        onOpenPaper={jest.fn()}
        onRefresh={onRefresh}
        onToggleSave={jest.fn()}
        papers={[]}
        savedPaperIds={[]}
        selectedTopics={['llms', 'evaluation', 'inference']}
      />
    );

    fireEvent.press(screen.getByText('Refresh'));

    expect(screen.getByText('Today\'s brief is still being prepared.')).toBeTruthy();
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});