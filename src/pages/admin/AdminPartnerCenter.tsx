import React from "react";
import AdminHeader from "./AdminsHeader";
import PartnerCenterHub from "../../components/partner/PartnerCenterHub";
import { useLocaleDir } from "../../hooks/useLocaleDir";

export default function AdminPartnerCenter() {
  const dir = useLocaleDir();
  return (
    <div dir={dir} className="min-h-screen bg-[#f6f2fb]">
      <AdminHeader />
      <main className="px-3 py-5 sm:px-4 md:px-8">
        <PartnerCenterHub admin />
      </main>
    </div>
  );
}
