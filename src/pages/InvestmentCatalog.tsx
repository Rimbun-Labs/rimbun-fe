import React from "react";
import { PageContainer, PageHeader } from "@/components/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Compass, CircleAlert } from "lucide-react";

const InvestmentCatalog: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        icon={Compass}
        title="Investments"
        description="Investment products available to offer."
      />
      <div className="mt-6">
        <Alert>
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Coming soon</AlertTitle>
          <AlertDescription>
            The investment catalog is not available here yet. Use Banking under Catalog, or open a
            customer from Home to review products for them.
          </AlertDescription>
        </Alert>
      </div>
    </PageContainer>
  );
};

export default InvestmentCatalog;
