import { MockTest } from '../types';
import { Clock, BookOpen, ChevronRight, Award } from 'lucide-react';

interface HomeProps {
  tests: MockTest[];
  onStartTest: (testId: string) => void;
}

export default function Home({ tests, onStartTest }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <Award className="w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight">SSC CGL Mock Test Portal</h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Available Mock Tests</h2>
          <p className="mt-2 text-gray-600">Practice with previous year papers to boost your preparation.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{test.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{test.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{test.questions.length} Questions</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Max Marks: {test.totalMarks}</span>
                  <button 
                    onClick={() => onStartTest(test.id)}
                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Start Test
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
