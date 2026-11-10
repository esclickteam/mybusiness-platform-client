type ProductMedia = {
  image: string;
  imageHe?: string;
  imageMobile?: string;
  imageMobileHe?: string;
  alt: string;
};

export default function PartnerProductMedia({
  product,
  hebrew = false,
  priority = false,
}: {
  product: ProductMedia;
  hebrew?: boolean;
  priority?: boolean;
}) {
  const desktop = hebrew && product.imageHe ? product.imageHe : product.image;
  const mobile =
    hebrew && product.imageMobileHe
      ? product.imageMobileHe
      : product.imageMobile || desktop;

  return (
    <figure className="ip-shot">
      <picture>
        {mobile && mobile !== desktop ? (
          <source media="(max-width: 719px)" srcSet={mobile} type="image/webp" />
        ) : null}
        <source srcSet={desktop} type="image/webp" />
        <img
          src={desktop}
          alt={product.alt}
          width={1600}
          height={1000}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
        />
      </picture>
    </figure>
  );
}
