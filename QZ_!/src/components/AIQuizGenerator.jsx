import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Sparkles, Brain, BookOpen, Target } from 'lucide-react';

export function AIQuizGenerator({ onQuizGenerated, onCancel }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(5);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(['multiple-choice']);

  const promptSuggestions = [
    {
      category: "Academic",
      icon: "📚",
      prompts: [
        "Create a quiz about the Solar System with questions about planets, moons, and space exploration",
        "Generate questions about World War II including key battles, dates, and historical figures",
        "Make a biology quiz covering photosynthesis, cell structure, and genetics",
        "Create a mathematics quiz on algebra, equations, and problem solving"
      ]
    },
    {
      category: "Business",
      icon: "💼",
      prompts: [
        "Create a quiz about digital marketing strategies, SEO, and social media advertising",
        "Generate questions about project management methodologies like Agile and Scrum",
        "Make a quiz on financial literacy covering budgeting, investing, and saving",
        "Create questions about leadership skills and team management"
      ]
    },
    {
      category: "Technology",
      icon: "💻",
      prompts: [
        "Create a quiz about JavaScript programming including variables, functions, and DOM manipulation",
        "Generate questions about artificial intelligence, machine learning, and neural networks",
        "Make a cybersecurity quiz covering passwords, phishing, and data protection",
        "Create a quiz about cloud computing, AWS services, and DevOps practices"
      ]
    },
    {
      category: "General Knowledge",
      icon: "🌍",
      prompts: [
        "Create a general knowledge quiz about world capitals, famous landmarks, and geography",
        "Generate questions about popular movies, TV shows, and entertainment",
        "Make a sports quiz covering football, basketball, and Olympic games",
        "Create a quiz about famous scientists, inventors, and their discoveries"
      ]
    }
  ];

  const handleGenerateQuiz = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      // Simulate AI generation with a realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const generatedQuiz = await generateQuizFromPrompt(
        prompt,
        selectedQuestionCount,
        selectedDifficulty,
        selectedQuestionTypes
      );

      onQuizGenerated(generatedQuiz);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Handle error - could show toast notification
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionTypeToggle = (type) => {
    setSelectedQuestionTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-4xl mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <span>✨</span>
        </div>
        <h1 className="text-3xl font-bold text-primary">AI Quiz Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Describe what you want your quiz to be about, and our AI will create engaging questions for you. 
          Be specific about the topic, difficulty level, and any particular areas you want to focus on.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Describe Your Quiz
              </CardTitle>
              <CardDescription>
                Tell the AI what kind of quiz you want to create. Be as detailed as possible for better results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Create a quiz about renewable energy sources including solar, wind, and hydroelectric power. Include questions about environmental benefits, costs, and efficiency. Make it suitable for high school students."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 resize-none"
                disabled={isGenerating}
              />
              
              {/* Quick Settings */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Questions Count</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedQuestionCount}
                    onChange={(e) => setSelectedQuestionCount(Number(e.target.value))}
                    disabled={isGenerating}
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    disabled={isGenerating}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Types</label>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'multiple-choice', label: 'Multiple Choice' },
                      { id: 'true-false', label: 'True/False' },
                      { id: 'open-ended', label: 'Open Ended' }
                    ].map((type) => (
                      <Badge
                        key={type.id}
                        variant={selectedQuestionTypes.includes(type.id) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleQuestionTypeToggle(type.id)}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateQuiz}
                disabled={!prompt.trim() || isGenerating || selectedQuestionTypes.length === 0}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Quiz with AI
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Creating your quiz...</span>
                    <span>⚡ AI at work</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Analyzing your prompt and crafting {selectedQuestionCount} engaging questions...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Suggestions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Prompt Ideas
              </CardTitle>
              <CardDescription>
                Get inspired by these example prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promptSuggestions.map((category) => (
                <div key={category.category} className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.category}
                  </h4>
                  <div className="space-y-1">
                    {category.prompts.slice(0, 2).map((examplePrompt, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(examplePrompt)}
                        className="text-xs text-left p-2 rounded border hover:bg-accent transition-colors w-full"
                        disabled={isGenerating}
                      >
                        {examplePrompt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p className="font-medium text-foreground">📝 Be Specific</p>
                <p>Include the target audience, specific topics, and learning objectives</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">🎯 Set Context</p>
                <p>Mention the difficulty level and any special requirements</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">📚 Add Examples</p>
                <p>Reference specific concepts or areas you want covered</p>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
            disabled={isGenerating}
          >
            Back to Manual Creation
          </Button>
        </div>
      </div>
    </div>
  );
}

// Mock AI service - replace with actual AI API call
async function generateQuizFromPrompt(
  prompt,
  questionCount,
  difficulty,
  questionTypes
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const timesByDifficulty = {
    easy: 45,
    medium: 30,
    hard: 20
  };

  const baseTime = timesByDifficulty[difficulty];

  // Generate questions based on the prompt
  const questions = [];
  
  for (let i = 0; i < questionCount; i++) {
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    let question;
    
    if (questionType === 'multiple-choice') {
      question = {
        id: `q${i + 1}`,
        type: 'multiple-choice',
        question: generateQuestionText(prompt, i + 1, difficulty),
        options: generateMultipleChoiceOptions(prompt, difficulty),
        correctAnswer: 0, // First option is correct
        hint: generateHint(prompt, difficulty),
        difficulty: difficulty,
        timeLimit: baseTime
      };
    } else if (questionType === 'true-false') {
      question = {
        id: `q${i + 1}`,
        type: 'true-false',
        question: generateTrueFalseQuestion(prompt, i + 1, difficulty),
        options: ['True', 'False'],
        correctAnswer: Math.random() > 0.5 ? 0 : 1,
        hint: generateHint(prompt, difficulty),
        difficulty: difficulty,
        timeLimit: baseTime
      };
    } else {
      question = {
        id: `q${i + 1}`,
        type: 'open-ended',
        question: generateOpenEndedQuestion(prompt, i + 1, difficulty),
        correctAnswer: generateOpenEndedAnswer(prompt, difficulty),
        hint: generateHint(prompt, difficulty),
        difficulty: difficulty,
        timeLimit: baseTime + 30 // More time for open-ended
      };
    }
    
    questions.push(question);
  }

  // Extract topic from prompt for title
  const topic = extractTopicFromPrompt(prompt);
  
  return {
    title: `${topic} Quiz`,
    description: `AI-generated quiz about ${topic.toLowerCase()} based on your requirements`,
    tags: generateTags(prompt),
    questions: questions,
    randomizeQuestions: false,
    theme: {
      primaryColor: '#030213',
      backgroundColor: '#ffffff',
      fontStyle: 'system'
    }
  };
}

function generateQuestionText(prompt, questionNumber, difficulty) {
  const topics = extractKeywords(prompt);
  const mainTopic = topics[0] || 'the topic';
  
  const questionStarters = [
    `What is the primary purpose of ${mainTopic}?`,
    `Which of the following best describes ${mainTopic}?`,
    `What are the main characteristics of ${mainTopic}?`,
    `How does ${mainTopic} relate to modern applications?`,
    `What is the most significant benefit of ${mainTopic}?`
  ];
  
  return questionStarters[questionNumber % questionStarters.length];
}

function generateMultipleChoiceOptions(prompt, difficulty) {
  const topics = extractKeywords(prompt);
  const mainTopic = topics[0] || 'the subject';
  
  return [
    `Correct answer related to ${mainTopic}`,
    `Incorrect but plausible option`,
    `Another reasonable distractor`,
    `Less likely but possible answer`
  ];
}

function generateTrueFalseQuestion(prompt, questionNumber, difficulty) {
  const topics = extractKeywords(prompt);
  const mainTopic = topics[0] || 'the topic';
  
  return `${mainTopic} is considered one of the most important developments in its field.`;
}

function generateOpenEndedQuestion(prompt, questionNumber, difficulty) {
  const topics = extractKeywords(prompt);
  const mainTopic = topics[0] || 'the topic';
  
  return `Explain the significance of ${mainTopic} and provide specific examples of its applications.`;
}

function generateOpenEndedAnswer(prompt, difficulty) {
  const topics = extractKeywords(prompt);
  const mainTopic = topics[0] || 'the topic';
  
  return `Sample answer discussing ${mainTopic} with relevant examples and explanations.`;
}

function generateHint(prompt, difficulty) {
  return "Think about the key concepts mentioned in the lesson material.";
}

function extractTopicFromPrompt(prompt) {
  // Simple extraction - look for common patterns
  const words = prompt.toLowerCase().split(' ');
  const topicIndicators = ['about', 'on', 'covering', 'regarding', 'quiz'];
  
  for (let i = 0; i < words.length; i++) {
    if (topicIndicators.includes(words[i]) && words[i + 1]) {
      return words[i + 1].charAt(0).toUpperCase() + words[i + 1].slice(1);
    }
  }
  
  return 'Custom Topic';
}

function extractKeywords(prompt) {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'quiz', 'questions', 'create', 'make', 'generate'];
  const words = prompt.toLowerCase().split(/\s+/).filter(word => 
    word.length > 3 && !commonWords.includes(word)
  );
  
  return words.slice(0, 5); // Return first 5 meaningful words
}

function generateTags(prompt) {
  const keywords = extractKeywords(prompt);
  return keywords.slice(0, 3).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  );
}