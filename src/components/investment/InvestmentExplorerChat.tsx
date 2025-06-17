import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from '@/contexts/SessionContext';
import { 
  mockChatResponses, 
  actionBasedResponses, 
  educationalResponses,
  topicFallbackResponses,
  contextualFollowUps
} from '@/lib/mock/chatResponses';
import { Card, CardContent } from "@/components/ui/card";
import { topics, Topic } from '@/lib/constants/investmentTopics';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  ArrowLeft, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Message {
  type: 'user' | 'ai';
  content: string;
  followUps?: string[];
}

interface InvestmentExplorerChatProps {
  sessionId: string;
}

const MotionCard = motion(Card);

export const InvestmentExplorerChat: React.FC<InvestmentExplorerChatProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { session } = useSession();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePromptClick = async (prompt: string) => {
    const newMessage: Message = {
      type: 'user',
      content: prompt,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    
    // Simulate AI typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if it's an educational prompt
    if (educationalResponses[prompt]) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: educationalResponses[prompt].content,
        followUps: educationalResponses[prompt].followUps
      }]);
      setIsTyping(false);
      return;
    }
    
    // Generate personalized response
    const aiResponse: Message = {
      type: 'ai',
      content: generatePersonalizedResponse(prompt),
      followUps: generateFollowUpPrompts(prompt)
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const generatePersonalizedResponse = (prompt: string): string => {
    if (!session?.metadata) {
      return "I'd be happy to help you explore investment options. Could you tell me more about your investment goals?";
    }

    const { profile } = session.metadata;

    // Try to find a matching response in the profile-based responses
    const profileResponses = mockChatResponses[profile] || {};
    const matchingResponse = profileResponses[prompt];

    if (matchingResponse) {
      return matchingResponse.content;
    }

    // Try to find a matching response in the action-based responses
    const actionMatchingResponse = actionBasedResponses[prompt];

    if (actionMatchingResponse) {
      return actionMatchingResponse.content;
    }

    // Try to find a matching response in the educational responses
    const educationalMatchingResponse = educationalResponses[prompt];

    if (educationalMatchingResponse) {
      return educationalMatchingResponse.content;
    }

    // Try to find a matching response in the topic-based fallbacks
    const topicFallback = topicFallbackResponses[selectedTopic?.id || ''];
    if (topicFallback) {
      return topicFallback.content;
    }

    // Generate contextual response based on prompt content
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('stock')) {
      return topicFallbackResponses['stock-analysis'].content;
    } else if (promptLower.includes('bond')) {
      return topicFallbackResponses['income-investing'].content;
    } else if (promptLower.includes('market')) {
      return topicFallbackResponses['market-research'].content;
    }

    // Default response if no specific match is found
    return "I can help you explore investment options. Would you like to learn about stocks, bonds, or other investment types?";
  };

  const generateFollowUpPrompts = (prompt: string): string[] => {
    if (!session?.metadata) {
      return ["Tell me more about your goals", "What's your risk tolerance?", "How long do you plan to invest?"];
    }

    const { profile } = session.metadata;

    // Try to find matching follow-ups in the profile-based responses
    const profileResponses = mockChatResponses[profile] || {};
    const matchingResponse = profileResponses[prompt];

    if (matchingResponse?.followUps) {
      return matchingResponse.followUps;
    }

    // Try to find matching follow-ups in the action-based responses
    const actionMatchingResponse = actionBasedResponses[prompt];

    if (actionMatchingResponse?.followUps) {
      return actionMatchingResponse.followUps;
    }

    // Try to find matching follow-ups in the educational responses
    const educationalMatchingResponse = educationalResponses[prompt];

    if (educationalMatchingResponse?.followUps) {
      return educationalMatchingResponse.followUps;
    }

    // Try to find matching follow-ups in the topic-based fallbacks
    const topicFallback = topicFallbackResponses[selectedTopic?.id || ''];
    if (topicFallback?.followUps) {
      return topicFallback.followUps;
    }

    // Generate contextual follow-ups based on the prompt content
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('stock')) {
      return contextualFollowUps['stocks'];
    } else if (promptLower.includes('bond')) {
      return contextualFollowUps['bonds'];
    } else if (promptLower.includes('market')) {
      return contextualFollowUps['market'];
    } else {
      return contextualFollowUps['education'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    handlePromptClick(inputValue);
    setInputValue('');
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-background to-secondary/5 rounded-lg">
      {!selectedTopic ? (
        <div className="flex-1 p-6">
          <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Choose a topic to explore:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic, index) => (
              <MotionCard 
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer group hover:bg-primary/5 transition-all duration-300"
                onClick={() => handleTopicSelect(topic)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <topic.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{topic.name}</h4>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTopic(null)}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <selectedTopic.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{selectedTopic.name}</h3>
            </div>
          </div>

          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-12' 
                          : 'bg-gradient-to-br from-primary/10 to-primary/5 mr-12'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.followUps && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.followUps.map((followUp, idx) => (
                            <Button
                              key={idx}
                              variant={message.type === 'user' ? 'secondary' : 'outline'}
                              size="sm"
                              onClick={() => handlePromptClick(followUp)}
                              className="rounded-full"
                            >
                              {followUp}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mr-12">
                      <div className="flex items-center gap-2">
                        <LoadingSpinner 
                          size="sm" 
                          variant="default" 
                          text="AI is typing..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
            {messages.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {selectedTopic.prompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start group hover:bg-primary/5"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? 'text-red-500' : ''}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button type="submit" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}; 