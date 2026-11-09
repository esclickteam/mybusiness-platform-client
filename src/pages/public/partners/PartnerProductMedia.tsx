type ProductMedia = {
  image: string;
  alt: string;
  video?: string;
  videoHe?: string;
  captions?: string;
  captionsHe?: string;
};

export default function PartnerProductMedia({
  product,
  hebrew,
  priority = false,
}: {
  product: ProductMedia;
  hebrew: boolean;
  priority?: boolean;
}) {
  const videoSrc = product.video
    ? hebrew && product.videoHe
      ? product.videoHe
      : product.video
    : null;
  const captionSrc = hebrew && product.captionsHe ? product.captionsHe : product.captions || null;

  return (
    <figure className="ip-shot">
      {videoSrc ? (
        <video
          controls
          playsInline
          preload={priority ? "metadata" : "none"}
          poster={product.image}
          width={960}
          height={600}
          aria-label={product.alt}
        >
          <source src={videoSrc} type="video/mp4" />
          {captionSrc ? (
            <track
              kind="captions"
              src={captionSrc}
              srcLang={hebrew ? "he" : "en"}
              label={hebrew ? "עברית" : "English"}
              default
            />
          ) : null}
        </video>
      ) : (
        <img
          src={product.image}
          alt={product.alt}
          width={960}
          height={600}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
        />
      )}
    </figure>
  );
}
