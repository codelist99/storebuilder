export function OfferVideo({ src, label }: { src?: string; label: string }) {
  return (
    <div className="video">
      {src ? <video controls playsInline preload="metadata" src={src} /> : <strong>{label} video pending recovery</strong>}
    </div>
  );
}
