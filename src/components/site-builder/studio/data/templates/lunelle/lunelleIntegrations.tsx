import React, { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";

import { getPublicBookingServices } from "../../../../../../api/publicBookingApi";
import {
  useStorePluginCatalog,
  type StoreCatalogProduct,
} from "../shared/useStorePluginCatalog";
import {
  lunelleDemoStoreProducts,
  lunelleImages,
  lunelleServices,
} from "./lunelleData";

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

function ServiceCards({ services }: { services: ServiceCard[] }) {
  return (
    <>
      {services.map((service, index) => (
        <article
          key={`${service.title}-${index}`}
          data-section-kind="service-card"
          data-section-title={service.title}
          className="lunelle-card lunelle-shine overflow-hidden rounded-[34px] border border-[#2a171c]/10 bg-white shadow-[0_22px_70px_rgba(42,23,28,.08)]"
        >
          <div className="overflow-hidden bg-[#f1d7dc]">
            <img
              src={service.image || lunelleImages.manicure}
              alt={service.title}
              className="lunelle-image-hover h-[300px] w-full object-cover"
              data-visual-edit-id={`services.${index}.image`}
              data-visual-edit-type="image"
            />
          </div>
          <div className="p-7">
            <div className="flex items-start justify-between gap-4">
              <h3
                className="text-2xl font-black tracking-[-0.04em] text-[#2a171c]"
                data-visual-edit-id={`services.${index}.name`}
              >
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
    </>
  );
}

function LunelleCrmServicesMount({
  businessId,
  enabled,
}: {
  businessId?: string;
  enabled: boolean;
}) {
  const demo: ServiceCard[] = lunelleServices.map((item) => ({
    title: item.title,
    price: item.price,
    time: item.time,
    text: item.text,
    image: item.image,
  }));
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
            image: lunelleServices[index % lunelleServices.length]?.image || lunelleImages.manicure,
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

function StoreProductCard({
  product,
  index,
}: {
  product: StoreCatalogProduct;
  index: number;
}) {
  return (
    <article
      data-visual-edit-id={`products.${index}.card`}
      className="lunelle-card lunelle-shine overflow-hidden rounded-[34px] border border-[#2a171c]/10 bg-white shadow-[0_22px_70px_rgba(42,23,28,.08)]"
    >
      <div className="overflow-hidden bg-[#f1d7dc]">
        <img
          src={product.image || lunelleImages.polish}
          alt={product.name}
          className="lunelle-image-hover h-[260px] w-full object-cover"
          data-visual-edit-id={`products.${index}.image`}
          data-field={`products.${index}.image`}
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-xl font-black tracking-[-0.04em] text-[#2a171c]"
            data-visual-edit-id={`products.${index}.name`}
          >
            {product.name}
          </h3>
          <div
            className="shrink-0 rounded-full bg-[#2a171c] px-4 py-2 text-sm font-black text-white"
            data-visual-edit-id={`products.${index}.price`}
          >
            {formatIls(product.price)}
          </div>
        </div>
        {product.badge ? (
          <p
            className="mt-2 text-xs font-black tracking-[0.16em] text-[#8a4f5f]"
            data-visual-edit-id={`products.${index}.tag`}
          >
            {product.badge}
          </p>
        ) : null}
        {product.shortDescription ? (
          <p
            className="mt-3 text-sm leading-7 text-[#2a171c]/60"
            data-visual-edit-id={`products.${index}.description`}
          >
            {product.shortDescription}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function LunelleStoreMount({
  businessId,
  enabled,
}: {
  businessId?: string;
  enabled: boolean;
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
        <StoreProductCard key={product.id || index} product={product} index={index} />
      ))}
    </div>
  );
}

/**
 * Hydrate CRM services + store catalog into Lunelle HTML mounts after paint.
 */
export function useLunelleIntegrationMounts(
  rootRef: React.RefObject<HTMLElement | null>,
  options: {
    businessId?: string;
    isStudioStatic?: boolean;
    pageId?: string;
    html?: string;
  },
) {
  const businessId = String(options.businessId || "").trim();
  // Skip createRoot during static HTML export (SSR markup) — keep seed HTML as-is.
  const allowMount = !options.isStudioStatic;
  const crmEnabled = allowMount && Boolean(businessId);

  useEffect(() => {
    if (!allowMount) return;

    const root = rootRef.current;
    if (!root) return;

    const reactRoots: Root[] = [];
    let cancelled = false;

    // Wait a frame so dangerouslySetInnerHTML has committed.
    const frame = window.requestAnimationFrame(() => {
      if (cancelled || !rootRef.current) return;

      root
        .querySelectorAll<HTMLElement>('[data-lunelle-crm-services="true"]')
        .forEach((node) => {
          node.innerHTML = "";
          const reactRoot = createRoot(node);
          reactRoot.render(
            <LunelleCrmServicesMount
              businessId={businessId || undefined}
              enabled={crmEnabled}
            />,
          );
          reactRoots.push(reactRoot);
        });

      root
        .querySelectorAll<HTMLElement>('[data-lunelle-store-mount="true"]')
        .forEach((node) => {
          node.innerHTML = "";
          const reactRoot = createRoot(node);
          reactRoot.render(
            <LunelleStoreMount
              businessId={businessId || undefined}
              // Demos when no businessId; live catalog when businessId exists.
              enabled={allowMount}
            />,
          );
          reactRoots.push(reactRoot);
        });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      reactRoots.forEach((reactRoot) => {
        try {
          reactRoot.unmount();
        } catch {
          // ignore stale roots after DOM reset
        }
      });
    };
  }, [rootRef, businessId, allowMount, crmEnabled, options.pageId, options.html]);
}
