import React from "react";
import AdminHeader from "./AdminsHeader";
import PartnerCenterHub from "../../components/partner/PartnerCenterHub";
import AdminPartnerOnboarding from "../../components/partner/AdminPartnerOnboarding";
import { useLocaleDir } from "../../hooks/useLocaleDir";

export default function AdminPartnerCenter() {
  const dir = useLocaleDir();
  return (
    <div dir={dir} className="min-h-screen bg-[#f6f2fb]">
      <AdminHeader />
      <main className="px-3 py-5 sm:px-4 md:px-8">
        <AdminPartnerOnboarding />
        <PartnerCenterHub admin />
      </main>
    </div>
  );
}
