import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from '@/contexts/SessionContext';
import { useChat } from '@/hooks/useEnhancedChat';
import { Card, CardContent } from "@/components/ui/card";
import { topics, Topic } from '@/lib/constants/investmentTopics';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Shield,
  Building2,
  LineChart,
  PieChart,
  Globe,
  BarChart2
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  type: 'user' | 'ai';
  content: string;
  followUps?: string[];
}

interface InvestmentExplorerChatProps {
  sessionId: string;
  onError?: (error: Error) => void;
}

const MotionCard = motion(Card);

// Smart topic suggestions based on conversation context
const getSmartTopicSuggestions = (messages: Message[], session: any): string[] => {
  if (messages.length === 0) {
    // Initial suggestions based on user profile
    const profile = session?.metadata?.profile;
    if (profile === 'conservative') {
      return [
        "What are safe investment options for beginners?",
        "How can I build a conservative portfolio?",
        "What are the best bond investment strategies?",
        "How do I manage investment risk?"
      ];
    } else if (profile === 'moderate') {
      return [
        "How should I balance stocks and bonds?",
        "What's a good diversified portfolio strategy?",
        "How do I analyze market trends?",
        "What are the best ETFs for diversification?"
      ];
    } else if (profile === 'aggressive') {
      return [
        "What are the best growth stock opportunities?",
        "How do I find high-potential investments?",
        "What sectors are showing strong growth?",
        "How do I analyze stock fundamentals?"
      ];
    } else {
      return [
        "What should I invest in as a beginner?",
        "How do I start building an investment portfolio?",
        "What are the different types of investments?",
        "How do I assess my risk tolerance?"
      ];
    }
  }

  // Analyze recent conversation to suggest relevant topics
  const recentContent = messages.slice(-3).map(m => m.content.toLowerCase()).join(' ');
  
  if (recentContent.includes('stock') || recentContent.includes('equity')) {
    return [
      "How do I analyze a company's fundamentals?",
      "What are the best stock screening tools?",
      "How do I diversify my stock portfolio?",
      "What's the difference between growth and value stocks?"
    ];
  } else if (recentContent.includes('bond') || recentContent.includes('fixed income')) {
    return [
      "How do bond yields work?",
      "What are the different types of bonds?",
      "How do I assess bond risk?",
      "When should I invest in bonds vs stocks?"
    ];
  } else if (recentContent.includes('market') || recentContent.includes('trend')) {
    return [
      "What are the current market trends?",
      "How do I read market indicators?",
      "What causes market volatility?",
      "How do I time the market?"
    ];
  } else if (recentContent.includes('portfolio') || recentContent.includes('allocation')) {
    return [
      "How do I rebalance my portfolio?",
      "What's the optimal asset allocation?",
      "How do I manage portfolio risk?",
      "Should I use ETFs or individual stocks?"
    ];
  } else if (recentContent.includes('risk') || recentContent.includes('safety')) {
    return [
      "How can I hedge my portfolio?",
      "What are low-risk investment options?",
      "How do I protect against market volatility?",
      "What are defensive investment strategies?"
    ];
  } else if (recentContent.includes('dividend') || recentContent.includes('income')) {
    return [
      "How do I find high-dividend stocks?",
      "What are the best income-generating investments?",
      "How do I assess dividend sustainability?",
      "What are REITs and how do they work?"
    ];
  }

  // Default suggestions
  return [
    "Tell me more about this topic",
    "What are the risks involved?",
    "How do I get started?",
    "What resources should I use?"
  ];
};

// Get topic icon for visual suggestions
const getTopicIcon = (suggestion: string) => {
  const lowerSuggestion = suggestion.toLowerCase();
  if (lowerSuggestion.includes('stock') || lowerSuggestion.includes('fundamental')) {
    return TrendingUp;
  } else if (lowerSuggestion.includes('bond') || lowerSuggestion.includes('income')) {
    return DollarSign;
  } else if (lowerSuggestion.includes('market') || lowerSuggestion.includes('trend')) {
    return BarChart2;
  } else if (lowerSuggestion.includes('portfolio') || lowerSuggestion.includes('allocation')) {
    return PieChart;
  } else if (lowerSuggestion.includes('risk') || lowerSuggestion.includes('safety')) {
    return Shield;
  } else if (lowerSuggestion.includes('dividend') || lowerSuggestion.includes('reit')) {
    return Building2;
  } else if (lowerSuggestion.includes('technical') || lowerSuggestion.includes('chart')) {
    return LineChart;
  } else if (lowerSuggestion.includes('global') || lowerSuggestion.includes('international')) {
    return Globe;
  }
  return Lightbulb;
};

export const InvestmentExplorerChat: React.FC<InvestmentExplorerChatProps> = ({ sessionId, onError }) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { session } = useSession();
  
  // Use the real chat hook instead of mock data
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error, 
    behavioralInsights, 
    clearMessages, 
    clearError,
    loadMessages 
  } = useChat(sessionId);

  const generateFollowUpPrompts = (content: string): string[] => {
    // Generate contextual follow-ups based on the AI response content
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('stock') || contentLower.includes('equity')) {
      return [
        "How do I analyze a company's fundamentals?",
        "What are the best stock screening tools?",
        "How do I diversify my stock portfolio?",
        "What's the difference between growth and value stocks?"
      ];
    } else if (contentLower.includes('bond') || contentLower.includes('fixed income')) {
      return [
        "How do bond yields work?",
        "What are the different types of bonds?",
        "How do I assess bond risk?",
        "When should I invest in bonds vs stocks?"
      ];
    } else if (contentLower.includes('market') || contentLower.includes('trend')) {
      return [
        "What are the current market trends?",
        "How do I read market indicators?",
        "What causes market volatility?",
        "How do I time the market?"
      ];
    } else if (contentLower.includes('portfolio') || contentLower.includes('allocation')) {
      return [
        "How do I rebalance my portfolio?",
        "What's the optimal asset allocation?",
        "How do I manage portfolio risk?",
        "Should I use ETFs or individual stocks?"
      ];
    } else {
      return [
        "Tell me more about this topic",
        "What are the risks involved?",
        "How do I get started?",
        "What resources should I use?"
      ];
    }
  };

  // Convert API messages to UI format
  const uiMessages: Message[] = messages.map(msg => ({
    type: msg.isAIResponse ? 'ai' : 'user',
    content: msg.content,
    followUps: msg.isAIResponse ? generateFollowUpPrompts(msg.content) : undefined
  }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (error && onError) {
      onError(new Error(error));
    }
  }, [error, onError]);

  const handlePromptClick = async (prompt: string) => {
    try {
      await sendMessage(prompt);
    } catch (error) {
      console.error('Failed to send prompt:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    handlePromptClick(inputValue);
    setInputValue('');
  };

  const handleRetry = () => {
    clearError();
    loadMessages();
  };

  const smartSuggestions = getSmartTopicSuggestions(uiMessages, session);

  return (
    <div className="space-y-6 w-full">
      <Card className="w-full">
        <CardContent className="p-0">
          <div className="flex flex-col bg-background rounded-lg border-0 w-full min-w-0 flex-grow">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">AI Investment Assistant</h3>
              </div>
              {behavioralInsights && (
                <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Enhanced</span>
                </div>
              )}
            </div>

            {error && (
              <Alert className="m-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetry}
                    className="h-6 px-3"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <ScrollArea ref={scrollRef} className="flex-1 p-6 w-full min-w-0 flex-grow">
              <div className="space-y-6 w-full">
          <AnimatePresence>
            {uiMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-6 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-muted/50 border border-border mr-12'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.followUps && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {message.followUps.map((followUp, idx) => (
                        <Button
                          key={idx}
                          variant={message.type === 'user' ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handlePromptClick(followUp)}
                          className="rounded-full border-border hover:bg-muted hover:text-foreground"
                          disabled={isLoading}
                        >
                          {followUp}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-6 rounded-2xl bg-muted/50 border border-border mr-12">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner 
                      size="sm" 
                      variant="default" 
                      text="AI is thinking..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border bg-muted/20 w-full">
        {/* Smart Suggestions */}
        {uiMessages.length === 0 && (
          <div className="mb-6 w-full">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Suggested topics to explore:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {smartSuggestions.map((suggestion, index) => {
                const IconComponent = getTopicIcon(suggestion);
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start group hover:bg-primary/5 h-auto p-4 border-border hover:border-primary/20"
                    onClick={() => handlePromptClick(suggestion)}
                    disabled={isLoading}
                  >
                    <IconComponent className="h-4 w-4 mr-3 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-left text-sm">{suggestion}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 w-full">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about investing..."
            className="flex-1 w-full"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 