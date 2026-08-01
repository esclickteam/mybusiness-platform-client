import React, { useEffect, useState } from "react";

import { getPublicBookingServices } from "../../../../../../api/publicBookingApi";
import {
  useStorePluginCatalog,
  type StoreCatalogProduct,
} from "../shared/useStorePluginCatalog";
import {
  lunelleDefaultData,
  lunelleDemoStoreProducts,
} from "./defaultData";

type ServiceCard = {
  title: string;
  price: string;
  time: string;
  text: string;
  image: string;
};

function formatIls(price: number) {
  if (!Number.isFinite(price)) return "";
  return `₪${Math.round(price)}`;
}

function demoServices(): ServiceCard[] {
  const d = lunelleDefaultData as Record<string, string>;
  return [
    {
      title: d.itemOneTitle,
      price: d.itemOnePrice,
      time: d.itemOneTime,
      text: d.itemOneText,
      image: d.itemOneImage,
    },
    {
      title: d.itemTwoTitle,
      price: d.itemTwoPrice,
      time: d.itemTwoTime,
      text: d.itemTwoText,
      image: d.itemTwoImage,
    },
    {
      title: d.itemThreeTitle,
      price: d.itemThreePrice,
      time: d.itemThreeTime,
      text: d.itemThreeText,
      image: d.itemThreeImage,
    },
    {
      title: d.itemFourTitle,
      price: d.itemFourPrice,
      time: d.itemFourTime,
      text: d.itemFourText,
      image: d.itemFourImage,
    },
    {
      title: d.packageOneTitle,
      price: d.packageOnePrice,
      time: "תוספת",
      text: d.packageOneText,
      image: d.galleryImage3,
    },
    {
      title: d.packageTwoTitle,
      price: d.packageTwoPrice,
      time: "30 דקות",
      text: d.packageTwoText,
      image: d.galleryImage8,
    },
  ];
}

function ServiceCards({ services }: { services: ServiceCard[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <article
          key={`${service.title}-${index}`}
          data-section-kind="service-card"
          data-section-title={service.title}
          className="overflow-hidden rounded-[34px] border border-[#2a171c]/10 bg-white shadow-[0_22px_70px_rgba(42,23,28,.08)]"
        >
          <div className="overflow-hidden bg-[#f1d7dc]">
            <img
              src={service.image}
              alt={service.title}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="p-7">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-black tracking-[-0.04em] text-[#2a171c]">
                {service.title}
              </h3>
              {service.price ? (
                <div className="shrink-0 rounded-full bg-[#fff1e7] px-4 py-2 text-sm font-black text-[#8a4f5f]">
                  {service.price}
                </div>
              ) : null}
            </div>
            {service.time ? (
              <p className="mt-2 text-xs font-black tracking-[0.16em] text-[#2a171c]/40">
                {service.time}
              </p>
            ) : null}
            {service.text ? (
              <p className="mt-4 text-sm leading-7 text-[#2a171c]/60">
                {service.text}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function LunelleCrmServicesGrid({
  businessId,
  enabled = true,
}: {
  businessId?: string;
  enabled?: boolean;
}) {
  const demo = demoServices();
  const [services, setServices] = useState<ServiceCard[]>(demo);

  useEffect(() => {
    if (!enabled || !businessId) {
      setServices(demo);
      return;
    }
    let cancelled = false;
    getPublicBookingServices(businessId)
      .then((list) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        setServices(
          list.map((service, index) => ({
            title: String(service.name || `שירות ${index + 1}`),
            price:
              service.price != null && service.price !== undefined
                ? formatIls(Number(service.price))
                : "",
            time: service.duration ? `${service.duration} דקות` : "",
            text: String(service.description || "שירות מהיומן של העסק"),
            image: demo[index % demo.length]?.image || demo[0].image,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setServices(demo);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, enabled]);

  return <ServiceCards services={services} />;
}

function StoreProductCard({ product }: { product: StoreCatalogProduct }) {
  return (
    <article className="overflow-hidden rounded-[34px] border border-[#2a171c]/10 bg-white shadow-[0_22px_70px_rgba(42,23,28,.08)]">
      <div className="overflow-hidden bg-[#f1d7dc]">
        <img
          src={product.image || lunelleDefaultData.galleryImage8}
          alt={product.name}
          className="h-[260px] w-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black tracking-[-0.04em] text-[#2a171c]">
            {product.name}
          </h3>
          <div className="shrink-0 rounded-full bg-[#2a171c] px-4 py-2 text-sm font-black text-white">
            {formatIls(product.price)}
          </div>
        </div>
        {product.badge ? (
          <p className="mt-2 text-xs font-black tracking-[0.16em] text-[#8a4f5f]">
            {product.badge}
          </p>
        ) : null}
        {product.shortDescription ? (
          <p className="mt-3 text-sm leading-7 text-[#2a171c]/60">
            {product.shortDescription}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function LunelleStoreGrid({
  businessId,
  enabled = true,
}: {
  businessId?: string;
  enabled?: boolean;
}) {
  const { products, loading } = useStorePluginCatalog({
    businessId,
    demoProducts: lunelleDemoStoreProducts,
    enabled,
  });

  if (loading && products.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[360px] animate-pulse rounded-[34px] bg-[#f1d7dc]/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <StoreProductCard key={product.id || index} product={product} />
      ))}
    </div>
  );
}
