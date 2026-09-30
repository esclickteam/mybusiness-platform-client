import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { listMetaMediaLibrary, uploadMetaMedia } from "../../../../api/metaCampaignsApi";
import { btnSecondary } from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

export default function MetaMediaLibraryTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await listMetaMediaLibrary(businessId);
      setImages(data.images || []);
      setVideos(data.videos || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t("metaCampaigns.errors.loadOverview"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [businessId]);

  const upload = async (file: File) => {
    if (!businessId) return;
    try {
      await uploadMetaMedia(businessId, file, file.type.startsWith("video") ? "video" : "image");
      toast.success(t("metaCampaigns.toasts.mediaUploaded"));
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t("metaCampaigns.errors.uploadMedia"));
    }
  };

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(t("metaCampaigns.manager.copied"));
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">{t("metaCampaigns.manager.libraryTitle")}</h2>
          <p className="text-sm text-slate-500">{t("metaCampaigns.manager.libraryBody")}</p>
        </div>
        <label className={btnSecondary}>
          {t("metaCampaigns.manager.uploadNew")}
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">{t("metaCampaigns.empty.loadingFromMeta")}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item) => (
            <article key={item.hash} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {item.url ? <img src={item.url} alt="" className="h-40 w-full object-cover" /> : null}
              <div className="space-y-1 p-3 text-xs">
                <p className="font-bold text-slate-800">{item.name || "Image"}</p>
                <p className="break-all text-slate-500">{item.hash}</p>
                <button type="button" className="font-bold text-violet-700" onClick={() => void copy(item.hash)}>
                  {t("metaCampaigns.manager.reuse")}
                </button>
              </div>
            </article>
          ))}
          {videos.map((item) => (
            <article key={item.videoId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {item.picture ? <img src={item.picture} alt="" className="h-40 w-full object-cover" /> : null}
              <div className="space-y-1 p-3 text-xs">
                <p className="font-bold text-slate-800">{item.name || "Video"}</p>
                <p className="break-all text-slate-500">{item.videoId}</p>
                <button type="button" className="font-bold text-violet-700" onClick={() => void copy(item.videoId)}>
                  {t("metaCampaigns.manager.reuse")}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
