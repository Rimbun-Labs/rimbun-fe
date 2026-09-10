import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/dashboard/ui/LoadingState";
import Dashboard from "@/pages/Dashboard";
import BusinessOverview from "@/pages/business/BusinessOverview";

/** `/app` home — content by tenant type, same route for everyone. */
const AppHome: React.FC = () => {
  const { operator, loading } = useAuth();

  if (loading) {
    return <LoadingState variant="expanded" />;
  }

  if (operator?.tenantType === "business") {
    return <BusinessOverview />;
  }

  return <Dashboard />;
};

export default AppHome;
