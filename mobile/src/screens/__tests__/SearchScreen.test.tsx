import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { searchPapers } from '../../services/briefApi';
import { Paper } from '../../types';
import { SearchScreen } from '../SearchScreen';

jest.mock('../../services/briefApi', () => ({
  searchPapers: jest.fn(),
}));

const SEARCH_FIXTURE: Paper = {
  abstractExcerpt: 'A paper about retrieval evaluation for grounded generation.',
  arxivUrl: 'https://arxiv.org/abs/2505.00002',
  authors: 'B. Researcher',
  id: '2505.00002v1',
  publishedAt: '2026-05-12',
  rank: 1,
  summaryBullets: [
    'Separates retrieval quality from generation quality.',
    'Introduces a more useful evaluation frame.',
    'Targets grounded generation systems.',
  ],
  tags: ['evaluation', 'rag'],
  title: 'Grounded Evaluation Sets for Retrieval-Augmented Generation',
  whyItMatters: ['Useful for teams benchmarking retrieval-heavy systems.'],
};

describe('SearchScreen', () => {
  it('submits a query and renders matched papers', async () => {
    const onCachePapers = jest.fn();

    (searchPapers as jest.Mock).mockResolvedValue({
      endDate: null,
      generatedAt: '2026-05-18T12:00:00+00:00',
      papers: [SEARCH_FIXTURE],
      query: 'retrieval augmented generation evaluation',
      startDate: null,
    });

    render(
      <SearchScreen
        onCachePapers={onCachePapers}
        onOpenPaper={jest.fn()}
        onToggleSave={jest.fn()}
        savedPaperIds={[]}
        suggestedTopics={['llms', 'rag', 'evaluation']}
      />
    );

    fireEvent.changeText(
      screen.getByLabelText('Paper search query'),
      'retrieval augmented generation evaluation'
    );
    fireEvent.press(screen.getByLabelText('Search papers'));

    await waitFor(() => {
      expect(searchPapers).toHaveBeenCalledWith('retrieval augmented generation evaluation');
    });

    expect(
      await screen.findByText('Grounded Evaluation Sets for Retrieval-Augmented Generation')
    ).toBeTruthy();
    expect(onCachePapers).toHaveBeenCalledWith([SEARCH_FIXTURE]);
  });
});