import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { chatApi } from '@/lib/api/enhancedChatApi';
import { useAuth } from '@/contexts/AuthContext';
import { Send, TestTube, CheckCircle, XCircle } from 'lucide-react';

export const ChatTestComponent: React.FC = () => {
  const [testMessage, setTestMessage] = useState('What should I invest in?');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const testChatEndpoint = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await chatApi.testChat({
        message: testMessage,
        context: 'Test user'
      });

      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testRealChat = async () => {
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await chatApi.sendMessage(user.uid, {
        message: testMessage,
        context: 'Test user'
      });

      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Chat API Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Message:</label>
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a test message..."
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={testChatEndpoint}
            disabled={isLoading}
            variant="outline"
          >
            <Send className="h-4 w-4 mr-2" />
            Test Chat Endpoint
          </Button>
          
          <Button
            onClick={testRealChat}
            disabled={isLoading || !user?.uid}
            variant="default"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Test Real Chat
          </Button>
        </div>

        {error && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {testResult && (
          <div className="space-y-2">
            <h4 className="font-medium">Test Result:</h4>
            <pre className="bg-muted p-3 rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-muted-foreground">
            Testing chat endpoint...
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 