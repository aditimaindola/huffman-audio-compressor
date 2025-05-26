
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { HuffmanNode } from '@/utils/huffmanUtils';
import { CheckCircle, XCircle, Brain, Trophy } from 'lucide-react';

interface QuizModeProps {
  codes: {[key: string]: string};
  tree: HuffmanNode | null;
  isEnabled: boolean;
}

interface Question {
  type: 'symbol-to-code' | 'code-to-symbol' | 'tree-path';
  symbol?: string;
  code?: string;
  question: string;
  correctAnswer: string;
}

const QuizMode: React.FC<QuizModeProps> = ({ codes, tree, isEnabled }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (isEnabled && Object.keys(codes).length > 0) {
      generateQuestions();
    }
  }, [isEnabled, codes]);

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    const symbols = Object.keys(codes);

    // Symbol to code questions
    symbols.forEach(symbol => {
      newQuestions.push({
        type: 'symbol-to-code',
        symbol,
        question: `What is the Huffman code for symbol '${symbol === ' ' ? 'SPACE' : symbol}'?`,
        correctAnswer: codes[symbol]
      });
    });

    // Code to symbol questions
    symbols.forEach(symbol => {
      newQuestions.push({
        type: 'code-to-symbol',
        code: codes[symbol],
        question: `Which symbol does the code '${codes[symbol]}' represent?`,
        correctAnswer: symbol === ' ' ? 'SPACE' : symbol
      });
    });

    // Tree path questions
    symbols.forEach(symbol => {
      const path = getTreePath(symbol);
      if (path) {
        newQuestions.push({
          type: 'tree-path',
          symbol,
          question: `What is the tree path (0=left, 1=right) to reach symbol '${symbol === ' ' ? 'SPACE' : symbol}'?`,
          correctAnswer: path
        });
      }
    });

    // Shuffle and limit questions
    const shuffled = newQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions(0);
    setQuizCompleted(false);
  };

  const getTreePath = (symbol: string): string => {
    if (!tree) return '';
    
    const path: string[] = [];
    
    function findPath(node: HuffmanNode | null, targetSymbol: string): boolean {
      if (!node) return false;
      
      if (node.symbol === targetSymbol) {
        return true;
      }
      
      if (node.left && findPath(node.left, targetSymbol)) {
        path.unshift('0');
        return true;
      }
      
      if (node.right && findPath(node.right, targetSymbol)) {
        path.unshift('1');
        return true;
      }
      
      return false;
    }
    
    findPath(tree, symbol);
    return path.join('');
  };

  const submitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrect = currentQuestion.correctAnswer.toLowerCase();
    
    const correct = normalizedAnswer === normalizedCorrect;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions(answeredQuestions + 1);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);
    setUserAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    generateQuestions();
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
  };

  if (!isEnabled) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Quiz Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Complete the Huffman coding process to unlock quiz mode
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Quiz Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Button onClick={generateQuestions} className="bg-blue-500 hover:bg-blue-600">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Your Score</h3>
              <div className="text-4xl font-bold text-blue-600">
                {score} / {questions.length}
              </div>
              <div className="text-xl text-gray-600">
                {percentage.toFixed(0)}%
              </div>
            </div>
            
            <Progress value={percentage} className="h-4" />
            
            <div className="text-sm text-gray-600">
              {percentage >= 80 && "Excellent! You've mastered Huffman coding!"}
              {percentage >= 60 && percentage < 80 && "Good job! You understand the basics well."}
              {percentage < 60 && "Keep practicing! Review the concepts and try again."}
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={restartQuiz} className="bg-blue-500 hover:bg-blue-600">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => setQuizCompleted(false)}>
              Review Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Quiz Mode
          </div>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>Score: {score}/{answeredQuestions}</span>
          </div>
          <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2" />
        </div>

        {/* Question */}
        <div className="space-y-4">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {currentQuestion.question}
            </h3>
            
            {currentQuestion.type === 'symbol-to-code' && (
              <div className="text-sm text-blue-600">
                Enter the binary code (e.g., "101")
              </div>
            )}
            
            {currentQuestion.type === 'code-to-symbol' && (
              <div className="text-sm text-blue-600">
                Enter the symbol (use "SPACE" for space character)
              </div>
            )}
            
            {currentQuestion.type === 'tree-path' && (
              <div className="text-sm text-blue-600">
                Enter the path as binary digits (0=left, 1=right)
              </div>
            )}
          </div>

          {/* Answer Input */}
          {!showResult ? (
            <div className="flex gap-2">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                className="flex-1"
              />
              <Button 
                onClick={submitAnswer}
                disabled={!userAnswer.trim()}
                className="bg-green-500 hover:bg-green-600"
              >
                Submit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Result */}
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <div className="font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <div className="text-sm text-gray-600">
                  {currentQuestion.type === 'symbol-to-code' && (
                    `The symbol '${currentQuestion.symbol === ' ' ? 'SPACE' : currentQuestion.symbol}' has the Huffman code '${currentQuestion.correctAnswer}' based on its frequency in the input text.`
                  )}
                  {currentQuestion.type === 'code-to-symbol' && (
                    `The code '${currentQuestion.code}' represents the symbol '${currentQuestion.correctAnswer}' in the Huffman tree.`
                  )}
                  {currentQuestion.type === 'tree-path' && (
                    `To reach '${currentQuestion.symbol === ' ' ? 'SPACE' : currentQuestion.symbol}' in the tree, follow the path '${currentQuestion.correctAnswer}' where 0=left and 1=right.`
                  )}
                </div>
              </div>

              <Button 
                onClick={nextQuestion}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          )}
        </div>

        {/* Reference Codebook */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Quick Reference</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {Object.entries(codes).slice(0, 8).map(([symbol, code]) => (
              <div key={symbol} className="flex justify-between bg-white p-2 rounded">
                <span className="font-mono">{symbol === ' ' ? '⎵' : symbol}</span>
                <span className="font-mono text-blue-600">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizMode;
