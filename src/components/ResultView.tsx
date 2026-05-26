import { MockTest, TestAttempt } from '../types';
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft, Trophy, BookOpen, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ResultViewProps {
  test: MockTest;
  attempt: TestAttempt;
  onGoHome: () => void;
}

export default function ResultView({ test, attempt, onGoHome }: ResultViewProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const { scoreDetails, subjectStats } = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const stats: Record<string, { total: number, correct: number, incorrect: number, unattempted: number, marks: number }> = {};
    
    const pMarks = test.positiveMarks || 2;
    const nMarks = test.negativeMarks || 0.5;

    test.questions.forEach(q => {
      if (!stats[q.subject]) {
        stats[q.subject] = { total: 0, correct: 0, incorrect: 0, unattempted: 0, marks: 0 };
      }
      stats[q.subject].total++;

      const ans = attempt.answers[q.id];
      if (!ans) {
        unattempted++;
        stats[q.subject].unattempted++;
      } else if (ans === q.correctOptionId) {
        correct++;
        stats[q.subject].correct++;
        stats[q.subject].marks += pMarks;
      } else {
        incorrect++;
        stats[q.subject].incorrect++;
        stats[q.subject].marks -= nMarks;
      }
    });

    const rawMarks = (correct * pMarks) - (incorrect * nMarks);
    const marks = Math.round(rawMarks * 100) / 100;
    
    for (const sub in stats) {
      stats[sub].marks = Math.round(stats[sub].marks * 100) / 100;
    }

    const subjectStatsArray = Object.entries(stats).map(([subject, data]) => ({ subject, ...data }));

    return { 
      scoreDetails: { correct, incorrect, unattempted, marks },
      subjectStats: subjectStatsArray
    };
  }, [test, attempt]);

  const timeTaken = test.durationMinutes * 60 - attempt.timeRemaining;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-4">
          <button 
            onClick={onGoHome}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Scorecard: {test.title}</h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        
        {/* Score Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Test Completed</h2>
          <div className="flex justify-center items-end gap-2 mb-8">
            <span className="text-5xl font-black text-indigo-600">{scoreDetails.marks}</span>
            <span className="text-xl text-gray-500 font-medium mb-1">/ {test.totalMarks}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-gray-500 text-sm font-semibold mb-1">Time Taken</div>
              <div className="text-xl font-bold text-gray-800">{formatTime(timeTaken)}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="text-green-600 text-sm font-semibold mb-1">Correct</div>
              <div className="text-xl font-bold text-green-700">{scoreDetails.correct}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="text-red-600 text-sm font-semibold mb-1">Incorrect</div>
              <div className="text-xl font-bold text-red-700">{scoreDetails.incorrect}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-gray-500 text-sm font-semibold mb-1">Unattempted</div>
              <div className="text-xl font-bold text-gray-800">{scoreDetails.unattempted}</div>
            </div>
          </div>
        </div>

        {/* Subject Analysis */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-6">Subject Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectStats.map((stat) => (
              <div key={stat.subject} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">{stat.subject}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="text-gray-600">Total</div>
                    <div className="text-right font-semibold">{stat.total}</div>
                    <div className="text-green-600">Correct</div>
                    <div className="text-right font-semibold text-green-700">{stat.correct}</div>
                    <div className="text-red-500">Incorrect</div>
                    <div className="text-right font-semibold text-red-600">{stat.incorrect}</div>
                    <div className="text-gray-500">Unattempted</div>
                    <div className="text-right font-semibold">{stat.unattempted}</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-600 text-sm">Marks</span>
                  <span className={`font-black text-lg ${stat.marks > 0 ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {stat.marks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Solutions */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Detailed Solutions</h3>
          
          {test.questions.map((q, index) => {
            const selectedOptId = attempt.answers[q.id];
            const isCorrect = selectedOptId === q.correctOptionId;
            const isUnattempted = !selectedOptId;

            return (
              <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-200 text-gray-700 text-sm font-bold px-2.5 py-1 rounded">Q {index + 1}</span>
                    <span className="text-gray-600 text-sm font-medium">{q.subject}</span>
                  </div>
                  <div>
                    {isCorrect && <span className="flex items-center gap-1 text-green-600 text-sm font-bold"><CheckCircle2 className="w-4 h-4"/> Correct (+{test.positiveMarks || 2})</span>}
                    {!isCorrect && !isUnattempted && <span className="flex items-center gap-1 text-red-600 text-sm font-bold"><XCircle className="w-4 h-4"/> Incorrect (-{test.negativeMarks || 0.5})</span>}
                    {isUnattempted && <span className="flex items-center gap-1 text-gray-500 text-sm font-bold"><MinusCircle className="w-4 h-4"/> Unattempted (0)</span>}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="prose max-w-none mb-6">
                    {q.context && (
                      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <h4 className="text-sm font-bold text-yellow-800 uppercase mb-2">Comprehension Passage</h4>
                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                          {q.context}
                        </p>
                      </div>
                    )}
                    <p className="text-gray-900 font-medium whitespace-pre-wrap">{q.text}</p>
                    {q.imageUrl && (
                      <div className="mt-4 flex justify-center">
                        <img 
                          src={q.imageUrl} 
                          alt="Question figure" 
                          className="max-w-full h-auto max-h-64 object-contain rounded border border-gray-200 p-2 bg-white cursor-zoom-in hover:border-blue-400 transition-colors" 
                          onClick={() => setExpandedImage(q.imageUrl!)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {q.options.map(opt => {
                      const isThisSelected = selectedOptId === opt.id;
                      const isThisCorrect = q.correctOptionId === opt.id;
                      
                      let optStyles = "border-gray-200 text-gray-700";
                      let borderClass = "border";

                      if (isThisCorrect) {
                        optStyles = "bg-green-50 text-green-800 border-green-300";
                        borderClass = "border-2";
                      } else if (isThisSelected && !isCorrect) {
                        optStyles = "bg-red-50 text-red-800 border-red-300";
                        borderClass = "border-2";
                      }

                      return (
                        <div key={opt.id} className={`p-4 rounded-lg flex items-start gap-3 flex-col sm:flex-row ${borderClass} ${optStyles}`}>
                          <div className="flex items-start gap-3 w-full">
                            <div className={`mt-0.5 rounded-full w-5 h-5 flex items-center justify-center border text-xs shrink-0
                              ${isThisCorrect ? 'bg-green-500 border-green-600 text-white' : 
                                isThisSelected ? 'bg-red-500 border-red-600 text-white' : 'border-gray-300'}`}
                            >
                              {isThisCorrect && <CheckCircle2 className="w-3 h-3" />}
                              {isThisSelected && !isThisCorrect && <XCircle className="w-3 h-3" />}
                            </div>
                            <div className="flex-1">
                              <span>{opt.text}</span>
                              {opt.imageUrl && (
                                <div className="mt-3">
                                  <img 
                                    src={opt.imageUrl} 
                                    alt="Option figure" 
                                    className="max-w-full h-auto max-h-32 object-contain rounded border border-gray-200 bg-white cursor-zoom-in hover:border-blue-400 transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setExpandedImage(opt.imageUrl!);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Solution
                    </h4>
                    <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </main>

      {/* Zoomed Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-zoom-out"
          onClick={() => setExpandedImage(null)}
        >
          <img 
            src={expandedImage} 
            alt="Expanded view" 
            className="max-w-[95vw] max-h-[90vh] object-contain bg-white rounded-lg shadow-2xl p-2 cursor-default" 
            onClick={(e) => e.stopPropagation()} 
          />
          <button 
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 focus:outline-none"
            onClick={() => setExpandedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
