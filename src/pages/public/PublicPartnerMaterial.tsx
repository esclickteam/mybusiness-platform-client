import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicPartnerCenterShare, type PartnerMaterial } from "../../lib/partnerCenterApi";
import { useLocaleDir } from "../../hooks/useLocaleDir";

export default function PublicPartnerMaterial() {
  const { token } = useParams();
  const dir = useLocaleDir();
  const [item, setItem] = useState<PartnerMaterial | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchPublicPartnerCenterShare(token)
      .then(setItem)
      .catch((err) => setError(err?.response?.data?.error || "Not found"));
  }, [token]);

  return (
    <div dir={dir} className="min-h-screen bg-[#F7F8FA] px-4 py-10">
      <article className="mx-auto max-w-3xl rounded-[24px] bg-white p-6 shadow-sm">
        {error ? <p className="font-bold text-rose-600">{error}</p> : null}
        {item ? (
          <>
            <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">Bizuply</p>
            <h1 className="mt-2 text-3xl font-black">{item.title}</h1>
            <p className="mt-2 font-bold text-slate-500">{item.description}</p>
            <pre className="mt-6 whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-700">
              {item.body}
            </pre>
          </>
        ) : null}
      </article>
    </div>
  );
}
