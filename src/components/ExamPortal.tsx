import { useState, useEffect, useMemo } from 'react';
import { MockTest, QuestionStatus, Subject } from '../types';
import { Clock, Info, UserRound } from 'lucide-react';

interface ExamPortalProps {
  test: MockTest;
  onSubmit: (answers: Record<string, string>, statuses: Record<string, QuestionStatus>, timeRemaining: number) => void;
}

export default function ExamPortal({ test, onSubmit }: ExamPortalProps) {
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>(() => {
    const initial: Record<string, QuestionStatus> = {};
    test.questions.forEach((q, i) => {
      initial[q.id] = i === 0 ? 'NOT_ANSWERED' : 'NOT_VISITED';
    });
    return initial;
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Group questions by subject
  const subjects = useMemo(() => {
    const subs: Subject[] = [];
    test.questions.forEach(q => {
      if (!subs.includes(q.subject)) subs.push(q.subject);
    });
    return subs;
  }, [test]);

  const [activeSubject, setActiveSubject] = useState<Subject>(subjects[0]);

  // Update timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmit(answers, statuses, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onSubmit, answers, statuses]);

  // Update active subject when current question changes
  useEffect(() => {
    const q = test.questions[currentQuestionIndex];
    if (q.subject !== activeSubject) {
      setActiveSubject(q.subject);
    }
    
    // Mark as NOT_ANSWERED if it was NOT_VISITED
    if (statuses[q.id] === 'NOT_VISITED') {
      setStatuses(prev => ({ ...prev, [q.id]: 'NOT_ANSWERED' }));
    }
  }, [currentQuestionIndex, test, activeSubject, statuses]);

  const currentQuestion = test.questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSaveAndNext = () => {
    const qId = currentQuestion.id;
    const hasAnswer = !!answers[qId];
    
    setStatuses(prev => ({
      ...prev,
      [qId]: hasAnswer ? 'ANSWERED' : 'NOT_ANSWERED'
    }));

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleClearResponse = () => {
    const qId = currentQuestion.id;
    const newAnswers = { ...answers };
    delete newAnswers[qId];
    setAnswers(newAnswers);
    setStatuses(prev => ({ ...prev, [qId]: 'NOT_ANSWERED' }));
  };

  const handleMarkForReviewAndNext = () => {
    const qId = currentQuestion.id;
    const hasAnswer = !!answers[qId];
    
    setStatuses(prev => ({
      ...prev,
      [qId]: hasAnswer ? 'ANSWERED_AND_MARKED_FOR_REVIEW' : 'MARKED_FOR_REVIEW'
    }));

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false);
    onSubmit(answers, statuses, timeLeft);
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'ANSWERED': return 'bg-green-500 text-white';
      case 'NOT_ANSWERED': return 'bg-red-500 text-white';
      case 'MARKED_FOR_REVIEW': return 'bg-purple-500 text-white';
      case 'ANSWERED_AND_MARKED_FOR_REVIEW': return 'bg-purple-500 text-white relative'; // Needs a green dot
      case 'NOT_VISITED': default: return 'bg-gray-200 text-gray-700';
    }
  };

  const counts = {
    answered: 0,
    notAnswered: 0,
    notVisited: 0,
    markedForReview: 0,
    answeredAndMarkedForReview: 0
  };

  Object.values(statuses).forEach(s => {
    if (s === 'ANSWERED') counts.answered++;
    else if (s === 'NOT_ANSWERED') counts.notAnswered++;
    else if (s === 'MARKED_FOR_REVIEW') counts.markedForReview++;
    else if (s === 'ANSWERED_AND_MARKED_FOR_REVIEW') counts.answeredAndMarkedForReview++;
    else counts.notVisited++;
  });

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden select-none">
      {/* Top Header */}
      <header className="bg-blue-900 text-white py-2 px-4 flex justify-between items-center shrink-0 shadow-md z-10">
        <h1 className="text-xl font-bold truncate">{test.title}</h1>
        <button className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm text-blue-100 border border-blue-600">
          Instructions
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Test Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          
          {/* Subjects Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto shrink-0 hide-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setActiveSubject(sub);
                  // Find first question of this subject
                  const idx = test.questions.findIndex(q => q.subject === sub);
                  if (idx !== -1) setCurrentQuestionIndex(idx);
                }}
                className={`px-4 py-3 whitespace-nowrap text-sm font-medium border-b-2 outline-none transition-colors ${
                  activeSubject === sub 
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Question Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <span className="text-lg font-bold text-gray-800">
                Question No. {currentQuestionIndex + 1}
              </span>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Marks: +2.0, -0.5
              </span>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((opt, i) => (
                <label 
                  key={opt.id} 
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === opt.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={opt.id}
                      checked={answers[currentQuestion.id] === opt.id}
                      onChange={() => handleOptionSelect(opt.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <span className="font-medium mr-2 text-gray-700">{i + 1}.</span>
                    <span className="text-gray-800">{opt.text}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 shrink-0 flex items-center justify-between">
            <div className="flex gap-3">
              <button 
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
              >
                Mark for Review & Next
              </button>
              <button 
                onClick={handleClearResponse}
                className="px-4 py-2 border border-blue-200 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
              >
                Clear Response
              </button>
            </div>
            
            <button 
              onClick={handleSaveAndNext}
              className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm"
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Right Sidebar: Profile & Palette */}
        <div className="w-80 border-l border-gray-200 bg-[#eef1f5] flex flex-col shrink-0 overflow-hidden">
          
          {/* Candidate Info */}
          <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3 shrink-0">
            <div className="bg-gray-100 p-2 rounded-md border border-gray-200">
              <UserRound className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Candidate Name:</div>
              <div className="font-bold text-gray-800 tracking-tight">John Doe</div>
            </div>
          </div>
          
          {/* Timer section */}
          <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-indigo-50 shrink-0">
            <span className="text-sm font-medium text-gray-600">Time Left:</span>
            <div className="bg-white px-3 py-1 rounded shadow-sm border border-indigo-100 flex items-center gap-2">
               <Clock className="w-4 h-4 text-indigo-500" />
               <span className="font-mono text-lg font-bold text-indigo-700">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Palette Legend */}
          <div className="p-4 border-b border-gray-200 bg-white shrink-0">
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-sm text-white bg-green-500">{counts.answered}</span> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-sm text-white bg-red-500">{counts.notAnswered}</span> Not Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-sm text-gray-700 bg-gray-200">{counts.notVisited}</span> Not Visited
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-sm text-white bg-purple-500">{counts.markedForReview}</span> Marked for Review
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-sm text-white bg-purple-500 relative">
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  {counts.answeredAndMarkedForReview}
                </span> 
                Answered & Marked for Review (will be considered for evaluation)
              </div>
            </div>
          </div>

          {/* Question Palette Grid */}
          <div className="flex-1 overflow-y-auto bg-[#eef1f5] p-3">
            <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide bg-blue-100 px-3 py-2 rounded text-blue-900 border border-blue-200">
              {activeSubject}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((q, idx) => {
                if (q.subject !== activeSubject) return null;
                const status = statuses[q.id];
                const isActive = currentQuestionIndex === idx;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => navigateToQuestion(idx)}
                    className={`relative w-full aspect-square rounded-sm text-sm font-medium flex items-center justify-center transition-all ${getStatusColor(status)} ${isActive ? 'ring-2 ring-offset-1 ring-blue-600 scale-105 shadow-md z-10' : 'hover:opacity-80'}`}
                  >
                    {idx + 1}
                    {status === 'ANSWERED_AND_MARKED_FOR_REVIEW' && (
                      <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 rounded-full border border-purple-600 shadow-sm" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="p-4 bg-gray-200 flex justify-center shrink-0 border-t border-gray-300">
            <button 
              onClick={handleSubmitClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded shadow transition-colors"
            >
              Submit
            </button>
          </div>
        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Test?</h2>
            <p className="text-gray-600 mb-6 font-medium">Are you sure you want to submit the test? You will not be able to change your answers after submission.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={handleCancelSubmit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
