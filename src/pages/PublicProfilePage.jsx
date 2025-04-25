import React from "react";
import BusinessBuilderPage from "../components/BusinessBuilderPage";

export default function PublicProfilePage() {
  // מצב תצוגה בלבד (publicView=true)
  return <BusinessBuilderPage publicView={true} />;
}
