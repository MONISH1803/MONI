import { useState } from 'react';
import Home from './components/Home';
import ExamPortal from './components/ExamPortal';
import ResultView from './components/ResultView';
import { mockTests } from './data';
import { MockTest, TestAttempt, QuestionStatus } from './types';

type AppState = 'HOME' | 'TEST' | 'RESULT';

export default function App() {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [testAttempt, setTestAttempt] = useState<TestAttempt | null>(null);

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
    setAppState('TEST');
  };

  const handleSubmitTest = (answers: Record<string, string>, statuses: Record<string, QuestionStatus>, timeRemaining: number) => {
    setTestAttempt({ answers, statuses, timeRemaining });
    setAppState('RESULT');
  };

  const handleGoHome = () => {
    setAppState('HOME');
    setActiveTestId(null);
    setTestAttempt(null);
  };

  const activeTest = mockTests.find(t => t.id === activeTestId) as MockTest;

  return (
    <>
      {appState === 'HOME' && (
        <Home tests={mockTests} onStartTest={handleStartTest} />
      )}
      {appState === 'TEST' && activeTest && (
        <ExamPortal test={activeTest} onSubmit={handleSubmitTest} />
      )}
      {appState === 'RESULT' && activeTest && testAttempt && (
        <ResultView test={activeTest} attempt={testAttempt} onGoHome={handleGoHome} />
      )}
    </>
  );
}
