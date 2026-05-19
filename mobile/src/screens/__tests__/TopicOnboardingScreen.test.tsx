import { fireEvent, render, screen } from '@testing-library/react-native';

import { TOPIC_OPTIONS } from '../../data/mockData';
import { TopicOnboardingScreen } from '../TopicOnboardingScreen';

describe('TopicOnboardingScreen', () => {
  it('allows continuing with a single selected topic', () => {
    const onContinue = jest.fn();

    render(
      <TopicOnboardingScreen
        mode="setup"
        onContinue={onContinue}
        onSelectionChange={jest.fn()}
        selectedTopics={['llms']}
        topics={TOPIC_OPTIONS}
      />
    );

    fireEvent.press(screen.getByText('Continue'));

    expect(screen.getByText('Pick one or more topics to shape which AI papers rise into today\'s top five.')).toBeTruthy();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});