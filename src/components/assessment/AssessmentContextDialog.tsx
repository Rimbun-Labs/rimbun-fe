import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssessmentContextDialogProps {
  isOpen: boolean;
  onStart: () => void;
  onClose: () => void;
}

const AssessmentContextDialog: React.FC<AssessmentContextDialogProps> = ({
  isOpen,
  onStart,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Investment Profile Assessment</DialogTitle>
          <DialogDescription className="text-lg">
            Understand your investment style and risk tolerance
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">What is this assessment?</h3>
              <p className="text-muted-foreground">
                This comprehensive assessment is designed to help us understand your investment 
                preferences, risk tolerance, and financial goals. By analyzing your responses, 
                we can provide personalized investment recommendations that align with your profile.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">What to expect?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>A series of carefully crafted questions about your investment preferences</li>
                <li>Questions about your financial goals and time horizon</li>
                <li>Scenarios to assess your risk tolerance</li>
                <li>Questions about your investment knowledge and experience</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Time Required</h3>
              <p className="text-muted-foreground">
                The assessment typically takes 10-15 minutes to complete. You can save your progress 
                and return later if needed.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">What you'll get</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>A detailed analysis of your investment profile</li>
                <li>Personalized investment strategy recommendations</li>
                <li>Risk tolerance assessment</li>
                <li>Suggested asset allocation based on your profile</li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onStart}>Start Assessment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentContextDialog; 